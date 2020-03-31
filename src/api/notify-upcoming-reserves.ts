import { $ } from '@yarnaimo/rain'
import { Dayjs, stringifyTimeTuple } from '../services/date'
import { getReservesWithDate } from '../services/reserve'
import { sendWebhook } from '../services/webhook'

export const notifyUpcomingReserves = async (currentDate: Dayjs) => {
    const tenMinutesLater = currentDate.add(10, 'minute')
    const upcomingReserves = getReservesWithDate(tenMinutesLater)

    await $.mapWrapped(upcomingReserves, async reserve => {
        const timeStr = stringifyTimeTuple(reserve.start)
        await sendWebhook(`${timeStr} から ${reserve.label} が始まります`)
    })
}
