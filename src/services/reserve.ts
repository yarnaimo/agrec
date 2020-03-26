import { config } from './config'
import { dayjs } from './date'

export type Reserve = {
    active: boolean
    audioOnly?: boolean
    label: string
    dow: number
    start: [number, number]
    durationMinutes: number
}

export const getReadyReserves = () => {
    const time = dayjs()
        .set('second', 0)
        .add(1, 'minute')

    const readyReserves = config.reserves
        .filter(({ active, dow, start: [h, m] }) => {
            const sameDow = time.day() === dow
            const sameTime = time.hour() === h && time.minute() === m
            return active && sameDow && sameTime
        })
        .map(({ durationMinutes, ...rest }) => {
            return {
                ...rest,
                durationSeconds: durationMinutes * 60 + 15,
            }
        })

    return { time, readyReserves }
}
