import { $ } from '@yarnaimo/rain'
import { rec } from '../services/ag'
import { getReadyReserves } from '../services/reserve'
import { sendWebhook } from '../services/webhook'

export const startReadyReserves = async () => {
    const { now, readyReserves } = getReadyReserves()
    const dateStr = now.format('YYYYMMDD')

    await $.p(
        readyReserves,

        $.map(async ({ label, durationSeconds }) => {
            try {
                const filename = `${label}-${dateStr}.flv`
                await rec(durationSeconds, `.data/${filename}`)
                await sendWebhook(`${filename} を保存しました`)
            } catch (error) {}
        }),
    )
}

startReadyReserves()
