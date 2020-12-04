import Head from 'next/head'
import styles from '../styles/app.module.scss'

const App = () => {

  return (
    <div className={styles.wrapper}>
      Hello World!

      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div,
        div#__next > div > div {
          height: 100%;
        }
      `}</style>
    </div>

    
  )
}

export default App