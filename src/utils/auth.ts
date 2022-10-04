// types
import { SetStateAction } from "react";
type AccessTokenSetterI = (value: SetStateAction<string | undefined>) => void

const extractTokenFromHash = (hash: string) => {
    const extractedToken = (hash.slice(1)).split('&')[0].split('=')[1];
    return extractedToken;
}

const handleSpotifyLogout = (setAccessToken: AccessTokenSetterI) => {
    setAccessToken(undefined);
    window.localStorage.removeItem("token");
  }

export {
    extractTokenFromHash,
    handleSpotifyLogout
}