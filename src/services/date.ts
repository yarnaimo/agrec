process.env.TZ = 'Asia/Tokyo'
import dayjs, { Dayjs } from 'dayjs'

export { dayjs, Dayjs }

export const sleep = (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000))

const pad = (number: number) => String(number).padStart(2, '0')

export const stringifyTimeTuple = ([h, m]: [number, number], padh0?: boolean) =>
    `${padh0 ? pad(h) : h}:${pad(m)}`
