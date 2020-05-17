import chokidar from 'chokidar'
import { readFile } from 'fs-extra'
import { load } from 'js-yaml'
import { Reserve, stringifyReserve } from './reserve'
import { sendWebhook } from './webhook'

const configPath = 'config.yaml'

export type ConfigType = {
    webhookUrl: string | null
    driveFolder: string | null
    deleteLocal?: boolean
    reserves: Reserve[]
}

let _config: ConfigType = {
    driveFolder: null,
    webhookUrl: null,
    reserves: [],
}

export const appConfig = {
    get: () => _config,
    load: async () => {
        const str = await readFile(configPath, 'utf8')
        _config = load(str) as ConfigType
    },
}

appConfig.load()

export const watchConfig = () => {
    const watcher = chokidar.watch(configPath).on('change', async () => {
        await appConfig.load()
        const reserveStrs = appConfig.get().reserves.map(stringifyReserve)

        await sendWebhook(
            `設定ファイルが更新されました\n\n*予約リスト*\n${reserveStrs.join(
                '\n',
            )}`,
        )
    })
    return { unwatch: () => watcher.close() }
}
