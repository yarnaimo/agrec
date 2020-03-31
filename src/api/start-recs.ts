import { $ } from '@yarnaimo/rain'
import { basename } from 'path'
import { rec } from '../services/ag'
import { appConfig } from '../services/config'
import { dayjs, Dayjs, sleep } from '../services/date'
import { extractAudio } from '../services/ffmpeg'
import { uploadToDrive } from '../services/google-drive'
import { log } from '../services/log'
import { getReservesWithDate } from '../services/reserve'
import { sendWebhook } from '../services/webhook'

export const startRecs = async (currentDate: Dayjs) => {
    const config = appConfig.get()
    const nextMinute = currentDate.add(1, 'minute')
    const reserves = getReservesWithDate(nextMinute)

    const dateStr = nextMinute.format('YYYYMMDD')

    await $.p(
        reserves,

        $.map(async ({ audioOnly, label, durationSeconds }) => {
            const base = `${label}-${dateStr}`
            const videoPath = `.data/${base}.flv`
            const audioPath = `.data/${base}.aac`

            try {
                const sleepMs =
                    nextMinute.valueOf() - dayjs().valueOf() - 10 * 1000
                await sleep(sleepMs)

                await rec(durationSeconds, videoPath)
                if (audioOnly) {
                    await extractAudio(videoPath, audioPath)
                }
                const encPath = audioOnly ? audioPath : videoPath
                const encFilename = basename(encPath)

                if (config.driveFolder) {
                    await uploadToDrive(encPath, config.driveFolder)
                    await sendWebhook(`${encFilename} をアップロードしました`)
                } else {
                    await sendWebhook(`${encFilename} をローカルに保存しました`)
                }
            } catch (error) {
                log(error)
                await sendWebhook(`${base} の録画に失敗しました\n${error}`)
            }
        }),
    )
}
