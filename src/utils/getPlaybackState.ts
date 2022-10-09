import { PlaybackInfoI } from "../types/typeDefinitions";


const getPlaybackState = async (accessToken: string) => {
  const res = await fetch("https://api.spotify.com/v1/me/player?additional_types=episode",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  if (res.status !== 200) {
    return undefined;
  }

  const userPlaybackState: SpotifyApi.CurrentlyPlayingResponse = await res.json();
  
  const userPlaybackInfo: PlaybackInfoI = {
    isPlaying: userPlaybackState.is_playing,
    deviceName: userPlaybackState.device.name,
    currentlyPlayingType: userPlaybackState.currently_playing_type,
    trackInfo: userPlaybackState.currently_playing_type === 'track' ? {
      // @ts-ignore
      album: userPlaybackState.item?.album.name,
      trackName: userPlaybackState.item?.name,
      // @ts-ignore
      artist: userPlaybackState.item?.artists[0].name,
      href: userPlaybackState.item?.external_urls.spotify,
      // @ts-ignore
      thumbnailImage: userPlaybackState.item?.album?.images[0],
    } : undefined,
    episodeInfo: userPlaybackState.currently_playing_type === 'episode' ? {
      // @ts-ignore
      show: userPlaybackState.item?.show.name,
      episodeName: userPlaybackState.item?.name,
      // @ts-ignore
      description: userPlaybackState.item?.description,
      href: userPlaybackState.item?.external_urls.spotify
    } : undefined,

  }
  return JSON.stringify(userPlaybackInfo, null, 2);
}

export default getPlaybackState;