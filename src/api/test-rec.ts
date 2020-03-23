import { rec } from '../services/ag'
import { sendWebhook } from '../services/webhook'

const testRec = async () => {
    try {
        await rec(5, '.data/test.flv')
    } catch (error) {
        await sendWebhook(
            'agqrの録画テストに失敗しました。.agserver の URL を確認してください。',
        )
    }
}

testRec()
