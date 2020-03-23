import { mkdirSync, readFileSync, statSync } from 'fs'
import { dirname } from 'path'
import { $ } from 'tish'

const serverUrl = readFileSync('.agserver', 'utf8').trim()

export const rec = async (length: number, path: string) => {
    console.log({ serverUrl, length, path })
    mkdirSync(dirname(path), { recursive: true })

    await $(
        `rtmpdump --live --rtmp ${serverUrl} --timeout 60 -B ${length} -o ${path}`,
    )
    const { size } = statSync(path)
    if (!size) {
        throw new Error('Recorded file is empty')
    }
}
