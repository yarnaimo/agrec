import { getConfig } from './config'
import { dayjs, stringifyTimeTuple } from './date'

export type Reserve = {
    disabled?: boolean
    audioOnly?: boolean
    label: string
    wday: number
    start: [number, number]
    length: number
}

export type ReserveWithSeconds = Reserve & {
    durationSeconds: number
}

const wdays = [...'日月火水木金土']

export const stringifyReserve = ({
    disabled,
    audioOnly,
    label,
    wday,
    start,
    length,
}: Reserve) => {
    const _ = disabled ? '~' : ''
    return (
        _ +
        [
            audioOnly ? '音声' : '動画',
            wdays[wday],
            stringifyTimeTuple(start, true),
            `${length}分`,
            label,
        ].join(' ') +
        _
    )
}

export const getReservesWithDate = (
    date: dayjs.Dayjs,
): ReserveWithSeconds[] => {
    const reserves = getConfig()
        .reserves.filter(({ disabled, wday, start: [h, m] }) => {
            const sameDow = date.day() === wday
            const sameTime = date.hour() === h && date.minute() === m
            return !disabled && sameDow && sameTime
        })
        .map(({ length, ...rest }) => {
            return {
                ...rest,
                length,
                durationSeconds: length * 60 + 15,
            }
        })

    return reserves
}
