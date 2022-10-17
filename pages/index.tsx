import Head from 'next/head'
import Image from 'next/image'
// react
import { useEffect, useState } from 'react'
// react icons
import { FiExternalLink } from 'react-icons/fi'
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

        {/* display image (currently playing) */}
        {playbackState && JSON.parse(playbackState).currentlyPlayingType === 'track' &&
          <div id={styles.outerContainer}>
            <div id={styles.thumbnailImageContainer}>
              <Image
                src={JSON.parse(playbackState).trackInfo.thumbnailImage.url}
                height={250} width={250}
              />
            </div>
          </div>
        }
        {playbackState && JSON.parse(playbackState).currentlyPlayingType === 'episode' &&
          <div id={styles.outerContainer}>
            <div id={styles.thumbnailImageContainer}>
              <Image
                src={JSON.parse(playbackState).episodeInfo.thumbnailImage.url}
                height={250} width={250}
              />
            </div>
          </div>
        }
        <div className={styles.grid}>
          {!accessToken ?
            <LoginButton scope={scope}/>
            :
            <div style={{ display: 'block' }}>
              {/* show playback state information */}
              <p className={styles.mainFont} style={{ margin: '8px 0', color: 'lightskyblue' }}>
                Currently Playing --- {'  '}
                {playbackState ?
                  (JSON.parse(playbackState).currentlyPlayingType === 'track'?
                    // link to currently playing track
                    <a href={JSON.parse(playbackState).trackInfo.href} target='_blank' rel="noopener noreferrer">
                      {JSON.parse(playbackState).trackInfo.trackName}
                      <FiExternalLink style={{ margin: '0 0 0 10px' }} />
                    </a>
                    :
                    <a href={JSON.parse(playbackState).episodeInfo.href} target='_blank' rel="noopener noreferrer" style={{color: 'white'}}>
                      {JSON.parse(playbackState).episodeInfo.episodeName}
                      <FiExternalLink style={{ margin: '0 0 0 10px' }} />
                    </a>
                  )
                  :
                  'Nothing'
                }
              </p>
              {playbackState &&
                (JSON.parse(playbackState).currentlyPlayingType === 'track' ?
                  <div className={styles.mainFont} style={{ padding: '0 1rem' }}>
                    <p style={{ margin: '4px 0' }}>Artist: {JSON.parse(playbackState).trackInfo.artist}</p>
                    <p style={{ margin: '4px 0' }}>Album: {JSON.parse(playbackState).trackInfo.album}</p>
                    <p style={{ margin: '4px 0' }}>Device: {JSON.parse(playbackState).deviceName}</p>
                  </div>
                  :
                  <div className={styles.mainFont} style={{ padding: '0 1rem' }}>
                    <p style={{ margin: '10px 0' }}>Podcast: {JSON.parse(playbackState).episodeInfo.show}</p>
                    <p style={{ margin: '10px 0' }}>Description: 
                    <span style={{fontSize: '12px', color: 'grey', display: 'block', padding: '5px 0'}}>{JSON.parse(playbackState).episodeInfo.description}</span>
                    </p>
                    <p style={{ margin: '10px 0' }}>Device: {JSON.parse(playbackState).deviceName}</p>
                  </div>
                )
              }
              {/* {playbackState? <pre style={{maxWidth: '500px', overflowX: 'scroll'}}>{playbackState}</pre> : ''} */}
              <br />
              {/* show last 5 recently played tracks */}
              {recentlyPlayed &&
                <div className={styles.mainFont}>
                  <p style={{color: 'lightskyblue'}}>
                    Last Played --- {'  '}
                  </p>
                  {recentlyPlayed.slice(0, 5).map(item => {
                    return <p key={`${item.title}:${item.playedAt}`} style={{ margin: '5px 0' }}>{item.title}  - {item.artist}</p>
                  })}
                </div>
              }
              <br/>
              {/* logout button */}
              <button className={styles.code}
                onClick={() => {
                  setPlaybackState(undefined);
                  setRecentlyPlayed(undefined);
                  handleSpotifyLogout(setAccessToken);
                }}>
                Log out &rarr;
              </button>
            </div>
          }
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
