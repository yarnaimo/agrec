import { mkdirp, readFileSync, stat } from 'fs-extra'
import { dirname } from 'path'
import { $ } from 'tish'

const serverUrl = readFileSync('.agserver', 'utf8').trim()

export const rec = async (length: number, path: string) => {
    console.log({ serverUrl, length, path })
    await mkdirp(dirname(path))

    await $(
        `rtmpdump --live --rtmp ${serverUrl} --timeout 60 -B ${length} -o ${path}`,
    )
    const { size } = await stat(path)
    if (!size) {
        throw new Error('Recorded file is empty')
    }
}
