import '../styles/global.scss'

import { useState } from 'react'
import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerContext } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'

const MyApp = ({ Component, pageProps }) => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ episodeList, setEpisodeList ] = useState([])
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)

    const play = (episode) => {
        setIsPlaying(true)
        setEpisodeList([ episode ])
        setCurrentEpisodeIndex(0)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const setPlayingState = (state: boolean) => setIsPlaying(state)

    return (
        <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, isPlaying, play, togglePlay, setPlayingState }}>
            <div className={styles.wrapper}>
                <main>
                    <Header />
                    <Component {...pageProps}/>
                </main>
                <Player />
            </div>
        </PlayerContext.Provider>  
    )
}

export default MyApp