process.env.TZ = 'Asia/Tokyo'
import dayjs from 'dayjs'

export { dayjs }

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))
