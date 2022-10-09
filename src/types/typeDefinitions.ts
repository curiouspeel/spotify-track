interface TrackDataI {
  title: string, 
  artist: string,
  playedAt: Date
}

interface EpisodeInfoI {
  show?: string,
  episodeName?: string,
  description?: string,
  href?: string
}
interface TrackInfoI {
  album: string,
  trackName?: string,
  artist?: string,
  href?: string,
  thumbnailImage?: {url: string, width: number, height: number}
}
interface PlaybackInfoI {
  isPlaying: boolean,
  deviceName: string
  currentlyPlayingType: 'track'|'episode'|'ad'|'unknown',
  trackInfo?: TrackInfoI,
  episodeInfo?: EpisodeInfoI
}


export type {
  TrackDataI,
  PlaybackInfoI
}