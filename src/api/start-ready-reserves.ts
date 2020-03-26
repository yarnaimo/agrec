import { $ } from '@yarnaimo/rain'
import { basename } from 'path'
import { rec } from '../services/ag'
import { config } from '../services/config'
import { dayjs, sleep } from '../services/date'
import { extractAudio } from '../services/ffmpeg'
import { uploadToDrive } from '../services/google-drive'
import { log } from '../services/log'
import { getReadyReserves } from '../services/reserve'
import { sendWebhook } from '../services/webhook'

export const startReadyReserves = async () => {
    log('startReadyReserves')

    const { time, readyReserves } = getReadyReserves()
    const dateStr = time.format('YYYYMMDD')

    await $.p(
        readyReserves,

        $.map(async ({ audioOnly, label, durationSeconds }) => {
            const base = `${label}-${dateStr}`
            const videoPath = `.data/${base}.flv`
            const audioPath = `.data/${base}.aac`

            try {
                const sleepMs = time.valueOf() - dayjs().valueOf() - 10 * 1000
                log(`sleep for ${sleepMs / 1000}s`)
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

startReadyReserves()
