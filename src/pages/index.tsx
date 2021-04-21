import { GetStaticProps } from 'next'
import { api } from '../services/api'

type Episode = {
    id: string
    title: string
    members: string
}

type HomeProps = {
    episodes: Episode[]
}

const Home = (props: HomeProps) => {
    
    return (
        <h1>Home</h1>
    )
}

// Static server generation
export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes', { params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
    } })

    return {
        props: { episodes: data },
        revalidate: 60 * 60 * 8
    }
}

export default Home