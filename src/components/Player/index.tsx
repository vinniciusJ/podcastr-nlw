import { useContext, useRef, useEffect } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'

import Image from 'next/image'
import Slider from 'rc-slider'

import styles from './styles.module.scss'

import 'rc-slider/assets/index.css'

export const Player = () => {
    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext)

    const audioRef = useRef<HTMLAudioElement>(null)

    const episode = episodeList[currentEpisodeIndex]

    useEffect(() => {
        if(!audioRef.current) return

        if(isPlaying)
            audioRef.current.play()
        else 
            audioRef.current.pause()

    }, [ isPlaying ])

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora </strong>
            </header>
            
            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ background: '#04d361' }}
                                railStyle={{ background: '#9F75FF'}}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        ) }
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button title="Aleatório" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>
                    <button title="Tocar anterior" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button className={styles.playButton} title="Tocar" disabled={!episode} onClick={togglePlay}>
                        <img src={ isPlaying ? '/pause.svg' : '/play.svg' } alt="Tocar"/>
                    </button>
                    <button title="Tocar próxima" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar próximo"/>
                    </button>
                    <button title="Repetir" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

            { episode && (
                <audio 
                ref={audioRef} 
                src={episode.url} 
                autoPlay 
                onPlay={() => setPlayingState(true)}
                onPause={() => setPlayingState(false)}
                ></audio>
            ) }
        </div>
    )
}