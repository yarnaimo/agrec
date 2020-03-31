import schedule from 'node-schedule'
import { watchConfig } from '../services/config'
import { dayjs } from '../services/date'
import { notifyUpcomingReserves } from './notify-upcoming-reserves'
import { startRecs } from './start-recs'
import { testRec } from './test-rec'

watchConfig()

schedule.scheduleJob({ second: 0 }, async fireDate => {
    const currentDate = dayjs(fireDate)

    startRecs(currentDate)
    notifyUpcomingReserves(currentDate)
})

schedule.scheduleJob({ hour: [0, 12], minute: 0 }, async fireDate => {
    await testRec()
})
