import { config } from './config'
import { dayjs } from './date'

export type Reserve = {
    label: string
    dow: number
    start: [number, number]
    durationMinutes: number
}

export const getReadyReserves = () => {
    const now = dayjs().add(1, 'minute')

    const readyReserves = config.reserves
        .filter(({ dow, start: [h, m] }) => {
            const sameDow = now.day() === dow
            const sameTime = now.hour() === h && now.minute() === m
            return sameDow && sameTime
        })
        .map(({ label, durationMinutes }) => {
            return {
                label,
                durationSeconds: (durationMinutes + 2) * 60,
            }
        })

    return { now, readyReserves }
}
