import { $ } from '@yarnaimo/rain'
import { rec } from '../services/ag'
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
            try {
                await rec(durationSeconds, `.data/${filename}`)
                await sendWebhook(`${filename} を保存しました`)
            } catch (error) {
                log(error)
                await sendWebhook(`${filename} の録画に失敗しました\n${error}`)
            }
        }),
    )
}

startReadyReserves()
