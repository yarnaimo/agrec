import { unlink } from 'fs-extra'
import { Do, MapAsync, P } from 'lifts'
import { basename } from 'path'
import { rec } from '../services/ag'
import { appConfig } from '../services/config'
import { Dayjs } from '../services/date'
import { extractAudio } from '../services/ffmpeg'
import { uploadToDrive } from '../services/google-drive'
import { log } from '../services/log'
import { getReservesWithDate } from '../services/reserve'
import { sendWebhook } from '../services/webhook'

export const startRecs = async (currentDate: Dayjs) => {
    const config = appConfig.get()
    const nextMinute = currentDate.add(1, 'minute').second(0)
    const reserves = getReservesWithDate(nextMinute)

    const dateStr = nextMinute.format('YYYYMMDD')

    await P(
        reserves,

        MapAsync(async ({ audioOnly, label, durationSeconds }) => {
            const base = `${label}-${dateStr}`
            const videoPath = `.data/${base}.flv`
            const audioPath = `.data/${base}.aac`

            try {
                await rec(durationSeconds, videoPath)

                const encodedPath = await Do(async () => {
                    if (audioOnly) {
                        await extractAudio(videoPath, audioPath)
                        await unlink(videoPath)
                        return audioPath
                    } else {
                        return videoPath
                    }
                })
                const encodedFilename = basename(encodedPath)

                if (config.driveFolder) {
                    await uploadToDrive(encodedPath, config.driveFolder)
                    await sendWebhook(
                        `${encodedFilename} をアップロードしました`,
                    )
                } else {
                    await sendWebhook(
                        `${encodedFilename} をローカルに保存しました`,
                    )
                }
            } catch (error) {
                log(error)
                await sendWebhook(`${base} の録画に失敗しました\n${error}`)
            }
        }),
    )
}
