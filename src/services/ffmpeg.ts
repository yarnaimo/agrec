import { $ } from 'tish'

export const extractAudio = async (videoPath: string, outputPath: string) => {
    await $(`ffmpeg -y -i "${videoPath}" -c:a copy "${outputPath}"`)
}
