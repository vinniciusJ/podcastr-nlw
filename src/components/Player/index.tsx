import styles from './styles.module.scss'

export const Player = () => {

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>

            <footer className={styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        <div className={styles.emptySlider}/>
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button title="Aleatório">
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>
                    <button title="Tocar anterior">
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button className={styles.playButton} title="Tocar">
                        <img src="/play.svg" alt="Tocar"/>
                    </button>
                    <button title="Tocar próxima">
                        <img src="/play-next.svg" alt="Tocar próximo"/>
                    </button>
                    <button title="Repetir">
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}