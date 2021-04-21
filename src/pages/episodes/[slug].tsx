import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../services/api'
import { format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from '../../utils'

import Link from 'next/link'
import Image from 'next/image'
import ptBR from 'date-fns/locale/pt-BR'
import styles from './episode.module.scss'

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

const Episode = ({ episode } : { episode: Episode } ) => {
    const router = useRouter()

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button title="Voltar à pagina anterior">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                 <button title="Reproduzir episódio">
                    <img src="/play.svg" alt="Reproduzir episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }}/>
                
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode: Episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        durationAsString: convertDurationToTimeString({ duration: Number(data.file.duration)}),
        duration: Number(data.file.duration),
        description: data.description,
        url: data.file.url
    }
    
    return {
        props: { episode },
        revalidate: 60 * 60 * 24 // 24 horas
    }
}

export default Episode