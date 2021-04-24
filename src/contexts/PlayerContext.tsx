import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    hasNext: boolean
    hasPrevious: boolean
    isLooping: boolean, 
    isShuflling: boolean
    clearPlayerState: () => void
    toggleShuflle: () => void
    toggleLoop: () => void
    playNext: () => void
    togglePlay: () => void
    playPrevious: () => void
    play: (episode: Episode) => void
    setPlayingState: (state: boolean) => void 
    playList: (episodes: Episode[], index: number) => void
}

type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ episodeList, setEpisodeList ] = useState([])
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)
    const [ isLooping, setIsLooping ] = useState(false)
    const [ isShuflling, setIsShuflling ] = useState(false)

    const [ hasPrevious, hasNext ] = [
        (currentEpisodeIndex > 0),
        isShuflling || (currentEpisodeIndex + 1 < episodeList.length)
    ]

    const clearPlayerState = () => {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
        setIsLooping(false)
        setIsShuflling(false)
    }

    const play = (episode: Episode) => {
        setIsPlaying(true)
        setEpisodeList([ episode ])
        setCurrentEpisodeIndex(0)
    }

    const playList = (episodes: Episode[], index: number) => {
        setIsPlaying(true)
        setEpisodeList(episodes)
        setCurrentEpisodeIndex(index)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleLoop = () => {
        if(!isLooping) setIsShuflling(false)

        setIsLooping(!isLooping)
    }

    const toggleShuflle = () => {
        if(!isShuflling) setIsLooping(false)

        setIsShuflling(!isShuflling)
    }

    const playNext = () => {
        if(isShuflling){
            const nextRandomEpIndex = Math.floor(Math.random() * episodeList.length) 

            setCurrentEpisodeIndex(nextRandomEpIndex)
        }
        else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    const playPrevious = () => {
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1) 
        }
    }

    const setPlayingState = (state: boolean) => setIsPlaying(state)

    return (
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            play, 
            hasNext,
            hasPrevious,
            playList,
            playNext,
            isLooping, 
            isShuflling,
            toggleShuflle,
            toggleLoop,
            clearPlayerState,
            playPrevious,
            togglePlay, 
            setPlayingState
        }}>
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext)