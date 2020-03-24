import { rec } from '../services/ag'
import { log } from '../services/log'
import { sendWebhook } from '../services/webhook'

const testRec = async () => {
    log('testRec')

    try {
        await rec(5, '.data/test.flv')
    } catch (error) {
        log(error)
        await sendWebhook(
            `agqr の録画テストに失敗しました。.agserver の URL を確認してください\n${error}`,
        )
    }
}

testRec()
