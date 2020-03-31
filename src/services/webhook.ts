import { IncomingWebhook } from '@slack/webhook'
import { appConfig } from './config'

export const sendWebhook = async (text: string) => {
    const config = appConfig.get()

    const webhook = config.webhookUrl
        ? new IncomingWebhook(config.webhookUrl)
        : null
    await webhook?.send({ username: 'agrec', text })
}
