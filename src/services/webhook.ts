import { IncomingWebhook } from '@slack/webhook'
import { hostname } from 'os'
import { getConfig } from './config'

const hostnameLabel = `*[${hostname()}]*`

export const sendWebhook = async (text: string) => {
    const config = getConfig()

    const webhook = config.webhookUrl
        ? new IncomingWebhook(config.webhookUrl)
        : null
    await webhook?.send({ text: `${hostnameLabel} ${text}` })
}
