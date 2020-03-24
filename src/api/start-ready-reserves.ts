import { $ } from '@yarnaimo/rain'
import { rec } from '../services/ag'
import { config } from '../services/config'
import { uploadToDrive } from '../services/google-drive'
import { log } from '../services/log'
import { getReadyReserves } from '../services/reserve'
import { sendWebhook } from '../services/webhook'

export const startReadyReserves = async () => {
    log('startReadyReserves')

    const { now, readyReserves } = getReadyReserves()
    const dateStr = now.format('YYYYMMDD')

    await $.p(
        readyReserves,

        $.map(async ({ label, durationSeconds }) => {
            const filename = `${label}-${dateStr}.flv`
            const path = `.data/${filename}`

            try {
                await rec(durationSeconds, path)

                if (config.driveFolder) {
                    await uploadToDrive(path, config.driveFolder)
                    await sendWebhook(`${filename} をアップロードしました`)
                } else {
                    await sendWebhook(`${filename} をローカルに保存しました`)
                }
            } catch (error) {
                log(error)
                await sendWebhook(`${filename} の録画に失敗しました\n${error}`)
            }
        }),
    )
}

startReadyReserves()
