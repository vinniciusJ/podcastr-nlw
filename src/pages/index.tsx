import { api } from '../services/api'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from '../utils'
import { usePlayer } from '../contexts/PlayerContext'

import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
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
    const { playList } = usePlayer()

    const episodeList = [ ...latestEpisodes, ...allEpisodes ]

    return (
        <div className={styles.homepage}>
            <Head>
                <title>Home | Podcastr</title>
            </Head>

            <section className={styles.latestEpisodes}>
                <h2>Últimos lançamentos</h2>
                <ul>
                    {latestEpisodes.map((episode, index) => (
                        <li key={episode.id}>
                            <Image 
                                width={192} 
                                height={192} 
                                src={episode.thumbnail} 
                                alt={episode.title}
                                objectFit='cover'

                            />

                            <div className={styles.episodeDetails}>
                                <Link href={`/episodes/${episode.id}`} >
                                    <a>{episode.title}</a>
                                </Link>
                                <p>{episode.members}</p>
                                <span>{episode.publishedAt}</span>
                                <span>{episode.durationAsString}</span>
                            </div>

                            <button onClick={() => playList(episodeList, index)}>
                                <img src="/play-green.svg" alt="Reproduzir episódio"/>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={styles.allEpisodes}>
                <h2>Todos episódios</h2>

                <table cellSpacing={0}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Podcast</th>
                            <th>Integrantes</th>
                            <th>Data</th>
                            <th>Duração</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allEpisodes.map((episode, index) => (
                            <tr key={episode.id}>
                                <td style={{ width: 72 }}>
                                    <Image 
                                        width={120} 
                                        height={120} 
                                        src={episode.thumbnail} 
                                        alt={episode.title}
                                        objectFit='cover'
                                    />
                                </td>
                                <td>
                                    <Link href={`/episodes/${episode.id}`}>
                                        <a>{episode.title}</a>
                                    </Link>
                                    
                                </td>
                                <td>{episode.members}</td>
                                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                                <td>{episode.durationAsString}</td>
                                <td>
                                    <button onClick={() => playList(episodeList, ( index + latestEpisodes.length ))}>
                                        <img src="/play-green.svg" alt="Reproduzir episódio"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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