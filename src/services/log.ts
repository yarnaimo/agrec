import { dayjs } from './date'

export const log = (...messages: any[]) => {
  const dateStr = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log(`[${dateStr}] [agrec]`, ...messages)
}
