import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'

import Image from 'next/image'
import Slider from 'rc-slider'

import styles from './styles.module.scss'

import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils'

export const Player = () => {
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setPlayingState, 
        playNext, 
        playPrevious, 
        hasNext, 
        hasPrevious, 
        isLooping, 
        toggleLoop,
        isShuflling, 
        toggleShuflle,
        clearPlayerState
    } = usePlayer()

    const [ progress, setProgress ] = useState<number>(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    const episode = episodeList[currentEpisodeIndex]

    const setUpProgressListener = () => {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () => setProgress(Math.floor(audioRef.current.currentTime)))
    }

    const handleSliderChange = (amount: number) => {
        audioRef.current.currentTime = amount

        setProgress(amount)
    }

    const handleEpisodeEnd = () => {
        if(hasNext)
            playNext()
        else
            clearPlayerState()
    }

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
                <span>{convertDurationToTimeString({ duration: progress })}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ background: '#04d361' }}
                                railStyle={{ background: '#9F75FF'}}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                max={episode?.duration ?? 0}
                                value={progress}
                                onChange={handleSliderChange}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        ) }
                    </div>
                    <span>{convertDurationToTimeString({ duration: episode?.duration ?? 0 })}</span>
                </div>

                <div className={styles.buttons}>
                    <button 
                        className={isShuflling ? styles.isActive : ''}  
                        title="Aleatório" 
                        disabled={!episode || (episodeList.length === 1)} 
                        onClick={toggleShuflle}
                    >
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>
                    <button title="Tocar anterior" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button className={styles.playButton} title="Tocar" disabled={!episode} onClick={togglePlay}>
                        <img src={ isPlaying ? '/pause.svg' : '/play.svg' } alt="Tocar"/>
                    </button>
                    <button title="Tocar próxima" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próximo"/>
                    </button>
                    <button 
                        className={isLooping ? styles.isActive : ''} 
                        title="Repetir" 
                        onClick={toggleLoop} 
                        disabled={!episode}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

            { episode && (
                <audio 
                    autoPlay 
                    ref={audioRef} 
                    src={episode.url} 
                    loop={isLooping}
                    onEnded={handleEpisodeEnd}
                    onLoadedMetadata={setUpProgressListener}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                ></audio>
            ) }
        </div>
    )
}