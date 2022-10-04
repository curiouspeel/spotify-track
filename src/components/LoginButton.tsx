import styles from '../../styles/Home.module.css';

interface PropsI {
  scope: string
}

export const LoginButton = ({scope}: PropsI) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = "http://localhost:3000";
  const auth_endpoint = "https://accounts.spotify.com/authorize";
  const response_type = "token";
  const spotifyAuthUrl = `${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
  
  return (
    <a href={spotifyAuthUrl} 
      className={`${styles.card} ${styles.code}`}
    >
      <p>Connect to Spotify to get started.</p>
      <h2>Log in &rarr;</h2>
    </a>
  )
}
