import { api } from '../services/api'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from '../utils'

import Image from 'next/image'
import ptBR from 'date-fns/locale/pt-BR'
import styles from './home.module.scss'

type Episode = {
    id: string
    title: string
    members: string
    publishedAt: string
    thumbnail: string
    duration: number
    durationAsString: string
    description: string
    url: string
}

type EpisodeParam = {
    id: string
    title: string
    members: string
    published_at: string
    thumbnail: string
    description: string
    file: {
        duration: string
        url: string
    }
}

type HomeProps = {
    latestEpisodes: Episode[]
    allEpisodes: Episode[]
}

const Home = ({ latestEpisodes, allEpisodes }: HomeProps) => {
    return (
        <div className={styles.homepage}>
            <section className={styles.latestEpisodes}>
                <h2>Últimos lançamentos</h2>
                <ul>
                    {latestEpisodes.map(episode => (
                        <li key={episode.id}>
                            <Image 
                                width={192} 
                                height={192} 
                                src={episode.thumbnail} 
                                alt={episode.title}
                                objectFit='cover'

                            />

                            <div className={styles.episodeDetails}>
                                <a href="">{episode.title}</a>
                                <p>{episode.members}</p>
                                <span>{episode.publishedAt}</span>
                                <span>{episode.durationAsString}</span>
                            </div>

                            <button>
                                <img src="/play-green.svg" alt="Reproduzir episódio"/>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={styles.allEpisodes}>

            </section>
        </div>
    )
}

// Static server generation
export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes', { params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
    }})

    const episodes = data.map((episode: EpisodeParam )=> ({
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
        durationAsString: convertDurationToTimeString({ duration: Number(episode.file.duration)}),
        duration: Number(episode.file.duration),
        description: episode.description,
        url: episode.file.url
    }))

    const latestEpisodes = episodes.slice(0, 2)
    const allEpisodes = episodes.slice(2, episodes.length)

    return {
        props: { 
            latestEpisodes, 
            allEpisodes
         },
        revalidate: 60 * 60 * 8
    }
}

export default Home