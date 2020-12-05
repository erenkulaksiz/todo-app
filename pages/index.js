import React, { useState, useEffect } from 'react';
import styles from '../styles/app.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartbeat, faCheckCircle, faLightbulb, faArrowLeft, faArrowRight, faEdit, faPlus, faCheck, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'

const App = () => {

  const [allTasks, setAllTasks] = useState([
    {
      taskName: "Homework",
      taskDesc: "Get the homework done.",
      taskTarget: "todo",
    },
    {
      taskName: "Turn off the lamp",
      taskDesc: "",
      taskTarget: "todo",
    },
    {
      taskName: "Buy a game",
      taskDesc: "Get the Battlefield 1!",
      taskTarget: "todo",
    },
    {
      taskName: "Ask her out",
      taskDesc: "I know you can do it!",
      taskTarget: "todo",
    },
    {
      taskName: "Grociries",
      taskDesc: "Go buy domates, biber, patlıcan and many more you would like",
      taskTarget: "todo",
    },
    {
      taskName: "Boring tasks",
      taskDesc: "I know right????",
      taskTarget: "todo",
    },
    {
      taskName: "Tweet",
      taskDesc: "",
      taskTarget: "todo",
    },
    {
      taskName: "Watch: Interstellar",
      taskDesc: "",
      taskTarget: "later",
    },
    {
      taskName: "Watch: Martian",
      taskDesc: "",
      taskTarget: "later",
    }
  ]);

  const [editTitle, setEditTitle] = useState(null);
  const [editDesc, setEditDesc] = useState(null);

  const targets = ["todo","done","later"];

  let gotTaskForTodo  = false;
  let gotTaskForDone  = false;
  let gotTaskForLater = false;

  const gotTask = (task) => {
    if(!task){
      return <div className={styles.cardBanner}>
        <div className={styles.cardBanner__icon}>
          <div className={styles.banner_icon}>
            <FontAwesomeIcon icon={faCheck}/>
          </div>
        </div>
        <div className={styles.cardBanner__texts}>
          <div className={styles.banner_title}>
            No Tasks
          </div>
          <div className={styles.banner_desc}>
            Move tasks by navigators <br/>or click + to add new task
          </div>
        </div>
      </div>
    }
  }

  //

  const addNewTask = (target) => {
    setAllTasks([...allTasks, {taskName: 'Title', taskDesc: 'Description (Optional)', taskTarget: target}])
  }

  const deleteTask = (index) => {
    const temp = [...allTasks];
    temp.splice(index, 1);
    setAllTasks(temp);
    setTaskHovered([false, -1]);
  }

  const moveTask = (index, target) => {
    const temp = [...allTasks];
    temp[index].taskTarget = target;
    setAllTasks(temp);
  }

  const enterEditingMode = (index) => {

  }

  //

  const [taskHovered, setTaskHovered] = useState([false, 0]);
  const toggleTaskHover = (index) => {
    setTaskHovered([!taskHovered, index]);
  }

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

              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[0]){
                    gotTaskForTodo = true;
                    return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                      {/* Controls */}
                      <div className={taskHovered[1] == index ? styles.card__controls_hover : styles.card__controls}>
                        <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[1])}}><FontAwesomeIcon icon={faArrowRight}/></a>
                        <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(index)}}><FontAwesomeIcon icon={faEdit} /></a>
                        <a href='#' onClick={() => {deleteTask(index)}}><FontAwesomeIcon icon={faTrash}/></a>
                      </div>
                      {/* End of Controls */}
                      <div className={styles.card__title}>
                        {task.taskName}
                      </div>

                      {task.taskDesc ? <div className={styles.card__desc}>
                        {task.taskDesc}
                      </div> : null}
                      
                    </div>
                  }
                })
              }

              <div className={styles.card__edit}>
                {/* Controls */}
                <div className={styles.card__controls_hover}>
                  <a href='#' className={styles.navIcon}><FontAwesomeIcon icon={faCheck}/></a>
                  <a href='#'><FontAwesomeIcon icon={faTimes} /></a>
                </div>
                {/* End of Controls */}
                <div className={styles.card__title}>
                  <input type='text'></input>
                </div>
                <div className={styles.card__desc}>
                  <textarea cols="40" rows="5"></textarea>
                </div>
              </div>

              <div className={styles.cardAdd}>
                <a href='#' onClick={() => {addNewTask(targets[0])}}><FontAwesomeIcon icon={faPlus} /></a>
              </div>

              {gotTask(gotTaskForTodo)}

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

              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[1]){
                    gotTaskForDone = true;

                    // Check if editing.
                    


                    return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                      {/* Controls */}
                      <div className={taskHovered[1] == index ? styles.card__controls_hover : styles.card__controls}>

                        <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[0])}} ><FontAwesomeIcon icon={faArrowLeft}/></a>
                        <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[2])}}><FontAwesomeIcon icon={faArrowRight}/></a>
                        <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(index)}}><FontAwesomeIcon icon={faEdit} /></a>
                        <a href='#' onClick={() => {deleteTask(index)}}><FontAwesomeIcon icon={faTrash}/></a>
                      </div>
                      {/* End of Controls */}
                      <div className={styles.card__title}>
                        {task.taskName}
                      </div>
                      <div className={styles.card__desc}>
                        {task.taskDesc}
                      </div>
                    </div>
                  }
                })
              } 

              <div className={styles.cardAdd}>
                <a href='#' onClick={() => {addNewTask(targets[1])}}><FontAwesomeIcon icon={faPlus} /></a>
              </div>

              {gotTask(gotTaskForDone)}

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

              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[2]){
                    gotTaskForLater = true;
                    return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                      {/* Controls */}
                      <div className={taskHovered[1] == index ? styles.card__controls_hover : styles.card__controls}>

                        <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[1])}}><FontAwesomeIcon icon={faArrowLeft}/></a>
                        <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(index)}}><FontAwesomeIcon icon={faEdit} /></a>
                        <a href='#' onClick={() => {deleteTask(index)}}><FontAwesomeIcon icon={faTrash}/></a>
                      </div>
                      {/* End of Controls */}
                      <div className={styles.card__title}>
                        {task.taskName}
                      </div>
                      <div className={styles.card__desc}>
                        {task.taskDesc}
                      </div>
                    </div>
                  }
                })
              } 

              <div className={styles.cardAdd}>
                <a href='#' onClick={() => {addNewTask(targets[2])}}><FontAwesomeIcon icon={faPlus} /></a>
              </div>

              {gotTask(gotTaskForLater)}

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