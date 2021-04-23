import { createContext, ReactNode, useState } from 'react'

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
    setPlayingState: (state: boolean) => void
    togglePlay: () => void
    play: (episode: Episode) => void
}

type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ episodeList, setEpisodeList ] = useState([])
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)

    const play = (episode: Episode) => {
        setIsPlaying(true)
        setEpisodeList([ episode ])
        setCurrentEpisodeIndex(0)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const setPlayingState = (state: boolean) => setIsPlaying(state)

    return (
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            play, 
            togglePlay, 
            setPlayingState
        }}>
            { children }
        </PlayerContext.Provider>
    )
}
