// types
import { TrackDataI } from "../types/typeDefinitions";
interface ErrorResponseI {
  success: false,
  response: SpotifyApi.ErrorObject
}
interface SuccessfulResponseI {
  success: true,
  response: TrackDataI[]
}

const getRecentlyPlayed = async (accessToken: string): Promise<SuccessfulResponseI | ErrorResponseI> => {
  const res = await fetch("https://api.spotify.com/v1/me/player/recently-played",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if(res.status !== 200){
    const response: {error: SpotifyApi.ErrorObject} = await res.json();
    return {
      success: false,
      response: response.error
    };
  }
  const userRecentlyPlayed: SpotifyApi.UsersRecentlyPlayedTracksResponse = await res.json();

  const recentlyPlayedData: TrackDataI[] = userRecentlyPlayed.items.map((item) => {
    return {
      title: item.track.name,
      artist: item.track.artists[0].name,
      playedAt: new Date(item.played_at)
    }
  })

  // tracks are sorted by : most recent first
  return {
    success: true,
    response: recentlyPlayedData
  };
}

export default getRecentlyPlayed;
