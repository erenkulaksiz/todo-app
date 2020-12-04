import Head from 'next/head'
import styles from '../styles/app.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartbeat, faCheckCircle, faLightbulb, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const App = () => {

  return (
    <div className={styles.wrapper}>

      <div className={styles.container}>
        <div className={styles.todo}>
          <div className={styles.todo__header}>
            <div className={styles.header_content}>
              <div className={styles.header_content__title}>
                <FontAwesomeIcon icon={faHeartbeat} className={styles.headerIcon}/> To-Do
              </div>
              <div className={styles.header_content__count}>
                5
              </div>
            </div>
          </div>
          <div className={styles.todo__content}>
              <div className={styles.card}>
                <div className={styles.card__controls}>
                  <a href='#' className={styles.navIcon}><FontAwesomeIcon icon={faArrowLeft}/></a>
                  <a href='#'><FontAwesomeIcon icon={faArrowRight} /></a>
                </div>
                <div className={styles.card__title}>
                  Title asdas
                </div>
                <div className={styles.card__desc}>
                  descriptionsfdsf
                </div>
              </div>
          </div>
        </div>
        <div className={styles.done}>
          <div className={styles.done__header}>
            <div className={styles.header_content}>
              <div className={styles.header_content__title}>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.headerIcon}/> Done
              </div>
              <div className={styles.header_content__count}>
                5
              </div>
            </div>
          </div>
          <div className={styles.done__content}>
            content
          </div>
        </div>
        <div className={styles.later}>
          <div className={styles.later__header}>
            <div className={styles.header_content}>
              <div className={styles.header_content__title}>
                <FontAwesomeIcon icon={faLightbulb} className={styles.headerIcon}/> To-Do Someday
              </div>
              <div className={styles.header_content__count}>
                5
              </div>
            </div>
          </div>
          <div className={styles.later__content}>
            content
          </div>
        </div>
      </div>
      
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div{
          height: 100%;
        }
      `}</style>
    </div>

    
  )
}

export default App