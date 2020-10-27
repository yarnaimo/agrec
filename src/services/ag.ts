import { mkdirp, readFileSync, stat } from 'fs-extra'
import { dirname } from 'path'
import { $ } from 'tish'

const streamUrl = readFileSync('.agstream', 'utf8').trim()

export const rec = async (length: number, path: string) => {
  console.log({ streamUrl, length, path })
  await mkdirp(dirname(path))

  await $(`ffmpeg -y -i "${streamUrl}" -t ${length} -c copy -f mp4 "${path}"`)

  const { size } = await stat(path)
  if (!size) {
    throw new Error('Recorded file is empty')
  }
}
