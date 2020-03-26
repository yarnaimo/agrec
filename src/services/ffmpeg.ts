import { $ } from 'tish'

export const extractAudio = async (videoPath: string, outputPath: string) => {
    await $(`ffmpeg -i ${videoPath} -c:a copy ${outputPath}`)
}
