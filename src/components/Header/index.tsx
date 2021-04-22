import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import styles from './styles.module.scss'


export const Header = () => {
    const currentdate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    })

    return (
        <header className={styles.container}>
            <img src="/logo.svg" alt="Podcastr logo"/>
            <p>O melhor para você ouvir sempre</p>

            <span>{currentdate}</span>
        </header>
    )
}