import { IncomingWebhook } from '@slack/webhook'
import { config } from './config'

export const webhook = config.webhookUrl
    ? new IncomingWebhook(config.webhookUrl)
    : null

export const sendWebhook = (text: string) =>
    webhook?.send({ username: 'agrec', text })
