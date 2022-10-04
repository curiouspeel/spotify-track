import Head from 'next/head'
// react
import { useEffect, useState } from 'react'
// components
import { Footer } from '../src/components/Footer'
import { LoginButton } from '../src/components/LoginButton'
// utils
import { extractTokenFromHash, handleSpotifyLogout } from '../src/utils/auth'
import getRecentlyPlayed from '../src/utils/getRecentlyPlayed'
import getPlaybackState from '../src/utils/getPlaybackState'
// styles
import styles from '../styles/Home.module.css'
// types
import type { NextPage } from 'next'
import { TrackDataI } from '../src/types/typeDefinitions'


const Home: NextPage = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const [recentlyPlayed, setRecentlyPlayed] = useState<TrackDataI[]>();
  const [playbackState, setPlaybackState] = useState<string>();
  const scope = 'user-read-recently-played user-read-playback-state';


  useEffect(()=>{
    const hash = window.location.hash;
    const token = localStorage.getItem("token");

    if(token) setAccessToken(token);
    // store access token in local storage
    if(!token && hash){
      const accessToken = extractTokenFromHash(hash);
      window.localStorage.setItem("token", accessToken);
      window.location.hash = "";
      
      setAccessToken(accessToken);
    }
  }, []);

  useEffect(()=>{
    if(!accessToken) return;

    const getData = async ()=>{
      const recentlyPlayedData = await getRecentlyPlayed(accessToken);
      recentlyPlayedData.success === true ? setRecentlyPlayed(recentlyPlayedData.response) : handleSpotifyLogout(setAccessToken)

      const playbackStateData = await getPlaybackState(accessToken);
      setPlaybackState(playbackStateData);
    }
    getData();

  }, [accessToken])

  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Track</title>
        <meta name="description" content="Track spotify activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome!
        </h1>

        <div className={styles.grid}>
          {!accessToken ?
            <LoginButton scope={scope}/>
            :
            <div style={{display: 'block'}}>
              {/* show last 5 recently played tracks */}
              {recentlyPlayed &&
                <div className={styles.mainFont}>
                  {recentlyPlayed.slice(0, 5).map(item => {
                    return <div key={`${item.title}:${item.playedAt}`}>{item.title}  - {item.artist}</div>
                  })}
                </div>
              }
              <br/>
              {/* show playback state information */}
              <p className={styles.mainFont}>Currently Playing --- </p>
              {playbackState? <pre style={{maxWidth: '500px', overflowX: 'scroll'}}>{playbackState}</pre> : ''}
              <br/>
              {/* logout button */}
              <button className={styles.code} onClick={()=>handleSpotifyLogout(setAccessToken)}>Log out &rarr;</button>
            </div>
          }
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
