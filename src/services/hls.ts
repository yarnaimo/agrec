import { createWriteStream, mkdirp } from 'fs-extra'
import got from 'got'
import { join } from 'path'
import { $ } from 'tish'
import { resolve } from 'url'
import { sleep } from './date'
import { fetchPlaylist, getMediaPlaylistEntry } from './hls-playlist'
import { log } from './log'

const getOutputPath = ({
  segmentUrl,
  segmentsDirPath,
}: {
  segmentUrl: string
  segmentsDirPath: string
}) => {
  const filename = segmentUrl.substr(segmentUrl.lastIndexOf('/') + 1)
  const outputPath = join(segmentsDirPath, filename)
  return outputPath
}

const startDownload = ({
  segmentUrl,
  outputPath,
  onComplete,
}: {
  segmentUrl: string
  outputPath: string
  onComplete: () => void
}) => {
  const stream = createWriteStream(outputPath)
  got
    .stream(segmentUrl)
    .pipe(stream)
    .on('finish', () => {
      log(`downloaded ${segmentUrl} => ${outputPath}`)
      onComplete()
    })
}

const getSegmentsDirPath = (outputFilePath: string) => {
  return outputFilePath.replace(/\.[^/.]+$/, '')
}

export const recStream = async (
  inputPlaylistUrl: string,
  duration: number,
  outputFilePath: string,
) => {
  const segmentsDirPath = getSegmentsDirPath(outputFilePath)
  await mkdirp(segmentsDirPath)

  let durationCount = 0
  let knownSegmentNumber = 0

  const downloadCompleteFlags: Record<string, boolean> = {}
  const downloadCompleted = () =>
    Object.values(downloadCompleteFlags).every(flag => flag)

  const entry = await getMediaPlaylistEntry(inputPlaylistUrl)

  while (durationCount < duration) {
    const playlist = await fetchPlaylist(entry.url)
    if (playlist.isMasterPlaylist) {
      throw new Error('fetched playlist is not media playlist')
    }

    const newSegments = playlist.segments
      .filter(segment => segment.mediaSequenceNumber > knownSegmentNumber)
      .slice(durationCount ? 0 : -1) // keep only last segment if first loop

    for (const segment of newSegments) {
      durationCount += segment.duration
      knownSegmentNumber = segment.mediaSequenceNumber

      const segmentUrl = resolve(entry.url, segment.uri)
      const outputPath = getOutputPath({ segmentUrl, segmentsDirPath })

      downloadCompleteFlags[outputPath] = false

      void startDownload({
        segmentUrl,
        outputPath,
        onComplete: () => {
          downloadCompleteFlags[outputPath] = true
        },
      })
    }

    await sleep(entry.playlist.targetDuration / 2)
  }

  while (!downloadCompleted()) {
    log('waiting for downloads complete')
    await sleep(1)
  }

  await encode({
    paths: Object.keys(downloadCompleteFlags),
    segmentsDirPath,
    outputFilePath,
    duration,
  })

  log(`saved ${outputFilePath}`)
}

const encode = async ({
  paths,
  segmentsDirPath,
  outputFilePath,
  duration,
}: {
  paths: string[]
  segmentsDirPath: string
  outputFilePath: string
  duration: number
}) => {
  const pathsStr = [...paths]
    .sort()
    .map(path => `"${path}"`)
    .join(' ')
  const allFilePath = join(segmentsDirPath, 'all.mp4')

  await $(`cat ${pathsStr} > "${allFilePath}"`)
  await $(
    `ffmpeg -y -i "${allFilePath}" -t ${duration} -c copy -f mp4 "${outputFilePath}"`,
  )
  await $(`rm -rf "${segmentsDirPath}"`)
}
