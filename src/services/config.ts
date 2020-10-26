import { readFile } from 'fs-extra'
import { load } from 'js-yaml'
import { log } from './log'
import { Reserve, stringifyReserve } from './reserve'
import { sendWebhook } from './webhook'

const configPath = './config.yaml'
const read = () => readFile(configPath, 'utf8')

export type ConfigType = {
    webhookUrl: string | null
    driveFolder: string | null
    deleteLocal?: boolean
    reserves: Reserve[]
}

let _configStr: string
let _config: ConfigType = {
    driveFolder: null,
    webhookUrl: null,
    reserves: [],
}

export const getConfig = () => _config
const setConfig = (configStr: string) => {
    _configStr = configStr
    _config = load(configStr) as ConfigType
}

const loadConfig = async () => {
    const newConfigStr = await read()
    const changed = newConfigStr !== _configStr
    if (changed) {
        setConfig(newConfigStr)
    }
    return { changed }
}

loadConfig()

const onConfigChange = async () => {
    log('config file changed')
    const reserveStrs = getConfig().reserves.map(stringifyReserve)
    const quotedBlock = ['*予約リスト*', ...reserveStrs].map(str => `> ${str}`)

    await sendWebhook(
        ['設定ファイルが更新されました', ...quotedBlock].join('\n'),
    )
}

export const watchConfig = () => {
    setInterval(async () => {
        try {
            const { changed } = await loadConfig()
            if (changed) {
                await onConfigChange()
            }
        } catch (error) {
            console.error(error)
            await sendWebhook('設定ファイルの読み込みに失敗しました')
        }
    }, 5000)
}
