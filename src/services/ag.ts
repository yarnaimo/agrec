import { mkdirp, readFileSync, stat } from 'fs-extra'
import { dirname } from 'path'
import { recStream } from './hls'

const streamUrl = readFileSync('.agstream', 'utf8').trim()

export const rec = async (length: number, path: string) => {
  console.log({ streamUrl, length, path })
  await mkdirp(dirname(path))

  await recStream(streamUrl, length, path)

  const { size } = await stat(path)
  if (!size) {
    throw new Error('Recorded file is empty')
  }
}
