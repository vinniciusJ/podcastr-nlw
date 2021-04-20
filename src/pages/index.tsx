const Home = ({ episodes }) => {
    return (
        <h1>Home</h1>
    )
}
// Server side-rendering

/*
export const getServerSideProps = async () => {
    const response = await fetch('http://localhost:3333/episodes')
    const data = await response.json()

    return {
        props: { episodes: data }
    }
}
*/

// Static server generation
export const getStaticProps = async () => {
    const response = await fetch('http://localhost:3333/episodes')
    const data = await response.json()

    return {
        props: { episodes: data },
        revalidate: 60 * 60 * 8
    }
}

export default Home