import got from 'got'
import { parse, types } from 'hls-parser'
import { Merge } from 'type-fest'
import { resolve } from 'url'
import { log } from './log'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

type MasterPlaylist = Merge<types.MasterPlaylist, { isMasterPlaylist: true }>
type MediaPlaylist = Merge<types.MediaPlaylist, { isMasterPlaylist: false }>
type MediaPlaylistEntry = { url: string; playlist: MediaPlaylist }

export const fetchPlaylist = async (playlistUrl: string) => {
  const response = await got.get(playlistUrl, { retry: 10 }).text()
  log(`fetched ${playlistUrl}`)
  const playlist = parse(response)
  return playlist as MasterPlaylist | MediaPlaylist
}

const getBestVariant = (variants: readonly types.Variant[]) => {
  const variantsDesc = [...variants].sort((a, b) => b.bandwidth - a.bandwidth)
  return variantsDesc[0] as types.Variant | undefined
}

export const getMediaPlaylistEntry = async (
  playlistUrl: string,
): Promise<MediaPlaylistEntry> => {
  const playlist = await fetchPlaylist(playlistUrl)
  if (!playlist.isMasterPlaylist) {
    return { url: playlistUrl, playlist }
  }

  const bestVariant = getBestVariant(playlist.variants)
  if (!bestVariant) {
    throw new Error('no variants found in master playlist')
  }
  const bestVariantUrl = resolve(playlistUrl, bestVariant.uri)
  return getMediaPlaylistEntry(bestVariantUrl)
}
