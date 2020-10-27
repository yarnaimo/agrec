import { rec } from '../services/ag'
import { log } from '../services/log'
import { sendWebhook } from '../services/webhook'

export const testRec = async () => {
  log('testRec')

  try {
    await rec(5, '.data/test.mp4')
  } catch (error) {
    log(error)
    await sendWebhook(
      `agqr の録画テストに失敗しました。.agstream の URL を確認してください\n${error}`,
    )
  }
}
