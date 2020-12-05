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
      taskName: "Groceries",
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
  const [editingMode, setEditingMode] = useState([false, -1]);

  const targets = ["todo","done","later"];

  let gotTaskForTodo = false,
      gotTaskForDone = false,
      gotTaskForLater = false;

  let todoCount = 0,
      doneCount = 0,
      laterCount = 0;

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
    setAllTasks([...allTasks, {taskName: 'New Task', taskDesc: 'Description (Optional)', taskTarget: target}])
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
    setEditingMode([true, index]);
  }

  const exitEditingMode = (index) => {
    setEditTitle(null);
    setEditDesc(null);
    setEditingMode([false, index]);
  }

  const submitEditingMode = (index) => {
    setEditingMode([false, index]);
    const temp = [...allTasks];
    if(editTitle){ temp[index].taskName = editTitle; }else if(editTitle == "" || editTitle == " "){ deleteTask(index); }
    // Deletetask not working here
    if(editDesc){ temp[index].taskDesc = editDesc; }else if(editDesc == "" || editDesc == ""){ temp[index].taskDesc = editDesc; }
    setAllTasks(temp);
    //setTaskHovered([false, -1]);
    setEditDesc(null);
    setEditTitle(null);
  }

  //

  const [taskHovered, setTaskHovered] = useState([false, 0]);
  const toggleTaskHover = (index) => {
    setTaskHovered([true, index]);
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
                {
                  allTasks.map(function(task, index){
                    task.taskTarget == targets[0] ? todoCount++ : null;
                  })   
                }
                {<React.Fragment>{todoCount != 0 ? todoCount : null}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.todo__content}>

              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[0]){
                    gotTaskForTodo = true;

                    if(editingMode[0] == true && editingMode[1] == index){
                      return <div className={styles.card__edit}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIcon} onClick={() => {submitEditingMode(index)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(index)}}><FontAwesomeIcon icon={faTimes}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          <input type='text' defaultValue={task.taskName} onChange={e => {setEditTitle(e.target.value)}}></input>
                        </div>
                        <div className={styles.card__desc}>
                          <textarea cols="25" rows="5" style={{width : "100%"}} defaultValue={task.taskDesc} onChange={e => {setEditDesc(e.target.value)}}></textarea>
                        </div>
                      </div>
                    }else{
                      return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                      {/* Controls */}
                      <div className={taskHovered[1] == index && !editingMode[0] ? styles.card__controls_hover : styles.card__controls}>
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

                    
                  }
                })
              }

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
                {
                  allTasks.map(function(task, index){
                    task.taskTarget == targets[1] ? doneCount++ : null;
                  })  
                }
                {<React.Fragment>{doneCount != 0 ? doneCount : null}</React.Fragment>}
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

                    if(editingMode[0] == true && editingMode[1] == index){
                      return <div className={styles.card__edit}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIcon} onClick={() => {submitEditingMode(index)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(index)}}><FontAwesomeIcon icon={faTimes}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          <input type='text' defaultValue={task.taskName} onChange={e => {setEditTitle(e.target.value)}}></input>
                        </div>
                        <div className={styles.card__desc}>
                          <textarea cols="25" rows="5" style={{width : "100%"}} defaultValue={task.taskDesc} onChange={e => {setEditDesc(e.target.value)}}></textarea>
                        </div>
                      </div>
                    }else{
                      return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                        {/* Controls */}
                        <div className={taskHovered[1] == index && !editingMode[0] ? styles.card__controls_hover : styles.card__controls}>

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
                {
                  allTasks.map(function(task, index){
                    task.taskTarget == targets[2] ? laterCount++ : null;
                  })  
                }
                {<React.Fragment>{laterCount != 0 ? laterCount : null}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.later__content}>

              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[2]){
                    gotTaskForLater = true;

                    if(editingMode[0] == true && editingMode[1] == index){
                      return <div className={styles.card__edit}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIcon} onClick={() => {submitEditingMode(index)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(index)}}><FontAwesomeIcon icon={faTimes}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          <input type='text' defaultValue={task.taskName} onChange={e => {setEditTitle(e.target.value)}}></input>
                        </div>
                        <div className={styles.card__desc}>
                          <textarea cols="25" rows="5" style={{width : "100%"}} defaultValue={task.taskDesc} onChange={e => {setEditDesc(e.target.value)}}></textarea>
                        </div>
                      </div>
                    }else{
                      return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                        {/* Controls */}
                        <div className={taskHovered[1] == index && !editingMode[0] ? styles.card__controls_hover : styles.card__controls}>

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