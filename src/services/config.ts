import { configDefault } from '../.config/default'
import { Reserve } from './reserve'

export type Config = {
    webhookUrl: string | null
    driveFolder: string | null
    reserves: Reserve[]
}

export const config = configDefault
