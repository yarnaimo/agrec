import { config } from './config'
import { dayjs } from './date'

export type Reserve = {
    active: boolean
    label: string
    dow: number
    start: [number, number]
    durationMinutes: number
}

export const getReadyReserves = () => {
    const now = dayjs().add(1, 'minute')

    const readyReserves = config.reserves
        .filter(({ active, dow, start: [h, m] }) => {
            const sameDow = now.day() === dow
            const sameTime = now.hour() === h && now.minute() === m
            return active && sameDow && sameTime
        })
        .map(({ label, durationMinutes }) => {
            return {
                label,
                durationSeconds: (durationMinutes + 2) * 60,
            }
        })

    return { now, readyReserves }
}
