import React, { useState, useEffect } from 'react';
import styles from '../styles/app.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartbeat, faCheckCircle, faLightbulb, faArrowLeft, faArrowRight, faEdit, faPlus, faCheck, faTrash, faTimes, faSync } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const App = () => {

  // States

  const [allTasks, setAllTasks] = useState([]);

  const [editing, setEditing] = useState([
    {
      editTitle: null,
      editDesc: null,
      mode: {
        isEditing: false,
        id: -1,
      }
    }
  ]);

  const [taskHovered, setTaskHovered] = useState([false, 0]);

  // Config

  const apiKey = "5fca12143c1c220016441a5f";
  const apiURL = "app/api";
  const apiResourceName = "list"; // Blank if no mockup

  const targets = ["todo","done","later"];

  //

  const apiRoute = `https://${apiKey}.mockapi.io/${apiURL}/${apiResourceName}/`;

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

  const addNewTask = async (target) => {
    await exitEditingMode(); // Make sure you exit edit mode
    
    const newTask = {
      taskName: "New Task", 
      taskDesc: "Description (Optional)", 
      taskTarget: target
    }

    await axios.post(apiRoute, newTask)
      .then(res => {
        const data = res.data;
        console.log(data);
      })

    handleRefresh();

    console.log("added new task at target: "+target);
  }

  const deleteTask = async (id) => {
    const temp = [...allTasks];
    const indexOfTask = temp.findIndex(x => x.id === id);

    console.log("deleting task index:"+indexOfTask+" id:"+id);

    await axios.delete(apiRoute+id)
      .then(res => {
        const data = res.data;
        console.log(data);
      })
      handleRefresh();
      setTaskHovered([false, -1]);
  }

  const moveTask = (id, target) => {
    const temp = [...allTasks];
    const indexOfTask = temp.findIndex(x => x.id === id);
    temp[indexOfTask].taskTarget = target;
    console.log("moving task id: "+indexOfTask);
    setAllTasks(temp);
    sendTasksToAPI(id);
  }

  const enterEditingMode = (id) => {
    console.log("entering editing mode id: "+id);
    setEditing((prevState) => {
      prevState[0].editTitle = null;
      prevState[0].editDesc = null;
      prevState[0].mode.isEditing = true;
      prevState[0].mode.id = id;
      return([
        ...prevState
      ])
    });
  }

  const exitEditingMode = (id) => {
    console.log("exiting editing mode id: "+id);
    setEditing((prevState) => {
      prevState[0].mode.isEditing = false;
      prevState[0].mode.id = id;
      return([
        ...prevState
      ])
    });
  }

  const submitEditingMode = async (id) => {
    const temp = [...allTasks];
    const indexOfTask = temp.findIndex(x => x.id === id);
    console.log("submitting edit name: "+editing[0].editTitle+" desc: "+editing[0].editDesc+ " index: "+indexOfTask+" id: "+id);

    if(editing[0].editTitle && /\S/.test(editing[0].editTitle)){ 
      temp[indexOfTask].taskName = editing[0].editTitle;
      // success edit of title
      if(editing[0].editDesc || editing[0].editDesc === ""){ 
        temp[indexOfTask].taskDesc = editing[0].editDesc; 
      }
      setAllTasks(temp);
      exitEditingMode(id);
      sendTasksToAPI(id);
    } else { 
      /*deleteTask(index);*/
      if(editing[0].editDesc || editing[0].editDesc === ""){ 
        temp[indexOfTask].taskDesc = editing[0].editDesc; 
      }
      exitEditingMode(id); 
      sendTasksToAPI(id);
    } 

    if(editing[0].editTitle === ""){
      deleteTask(id);
    }
  }

  const sendTasksToAPI = async (id) => {
    const temp = [...allTasks];

    const indexOfTask = temp.findIndex(x => x.id === id);

    try { 
      await axios.put(apiRoute+id, temp[indexOfTask])
        .then(res => {
          const data = res.data;
          console.log(data);
          console.log("%cSend task index: "+indexOfTask+" id:"+temp[indexOfTask]['id'], "color:green");
        })
      .catch(err => {
        if (err.response.status === 404) {
          throw new Error('404');
        }
        throw err;
      })
    } catch (err) {
      console.log("%cCant send tasks:" +err, "color:red");
    }

    handleRefresh();
  }

  const handleRefresh = async () => {
    console.log("refreshing...");

    try { 
      await axios.get(apiRoute)
      .then(res => {
          const data = res.data;
          console.log(data);
          setAllTasks(data);
      })
      .catch(err => {
        if (err.response.status === 404) {
          throw new Error('404');
        }
        throw err;
      })
    } catch (err) {
      console.log("%cCant refresh tasks:" +err, "color:red");
    }
  }

  useEffect(() => {
    console.log("API URL: "+apiRoute);
    console.log("%cTodo app launch", "color:green");
    handleRefresh();
  }, []);

  const toggleTaskHover = (index) => {
    setTaskHovered([true, index]);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.todo}>
          <div className={styles.refresh}>
            <a href='#' onClick={() => {handleRefresh()}}><FontAwesomeIcon icon={faSync} /></a>
          </div>
          <div className={styles.todo__header}>
            <div className={styles.header_content}>
              <div className={styles.header_content__title}>
                <FontAwesomeIcon icon={faHeartbeat} className={styles.headerIcon}/> To-Do
              </div>
              <div className={styles.header_content__count}>
                {
                  allTasks.map(function(task, index){
                    task.taskTarget == targets[0] && todoCount++;
                  })   
                }
                {<React.Fragment>{todoCount != 0 && todoCount}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.todo__content}>
              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[0]){
                    if(editing[0].mode.isEditing == true && editing[0].mode.id == task.id){
                      return <div className={styles.card__edit} key={index}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIconSubmit} onClick={() => {submitEditingMode(task.id)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(task.id)}}><FontAwesomeIcon icon={faTimes}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          <input type='text' placeholder={"Title"} defaultValue={task.taskName} 
                              onChange={e => {setEditing((prevState) => {
                                prevState[0].editTitle = e.target.value;
                                return([
                                  ...prevState
                                ])
                              });
                            }
                          }></input>
                        </div>
                        <div className={styles.card__desc}>
                          <textarea placeholder={"Description"} cols="25" rows="5" style={{width : "100%"}} defaultValue={task.taskDesc} 
                              onChange={e => {setEditing((prevState) => {
                                prevState[0].editDesc = e.target.value;
                                return([
                                  ...prevState
                                ])
                              });
                            }
                          }></textarea>
                        </div>
                      </div>
                    }else{
                      return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                      {/* Controls */}
                      <div className={taskHovered[1] == index && !editing[0].mode.isEditing ? styles.card__controls_hover : styles.card__controls}>
                        <a href='#' className={styles.navIcon} onClick={() => {moveTask(task.id, targets[1])}}><FontAwesomeIcon icon={faArrowRight}/></a>
                        <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(task.id)}}><FontAwesomeIcon icon={faEdit} /></a>
                        <a href='#' onClick={() => {deleteTask(task.id)}}><FontAwesomeIcon icon={faTrash}/></a>
                      </div>
                      {/* End of Controls */}
                      <div className={styles.card__title}>
                        {task.taskName}
                      </div>

                      {task.taskDesc && <div className={styles.card__desc}>{task.taskDesc}</div>}
                      
                      </div>
                    }
                  }
                })
              }

              <div className={styles.cardAdd}>
                <a href='#' onClick={() => {addNewTask(targets[0])}}><FontAwesomeIcon icon={faPlus} /></a>
              </div>

              {gotTask(todoCount != 0)}
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
                    task.taskTarget == targets[1] && doneCount++;
                  })  
                }
                {<React.Fragment>{doneCount != 0 && doneCount}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.done__content}>
              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[1]){
                    if(editing[0].mode.isEditing == true && editing[0].mode.id == task.id){
                      return <div className={styles.card__edit} key={index}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIconSubmit} onClick={() => {submitEditingMode(task.id)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(task.id)}}><FontAwesomeIcon icon={faTimes}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          <input type='text' placeholder={"Title"} defaultValue={task.taskName} 
                            onChange={e => {setEditing((prevState) => {
                                prevState[0].editTitle = e.target.value;
                                return([
                                  ...prevState
                                ])
                              });
                            }
                          }></input>
                        </div>
                        <div className={styles.card__desc}>
                          <textarea placeholder={"Description"} cols="25" rows="5" style={{width : "100%"}} defaultValue={task.taskDesc} 
                              onChange={e => {setEditing((prevState) => {
                                prevState[0].editDesc = e.target.value;
                                return([
                                  ...prevState
                                ])
                              });
                            }
                          }></textarea>
                        </div>
                      </div>
                    }else{
                      return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                        {/* Controls */}
                        <div className={taskHovered[1] == index && !editing[0].mode.isEditing ? styles.card__controls_hover : styles.card__controls}>
                          <a href='#' className={styles.navIcon} onClick={() => {moveTask(task.id, targets[0])}} ><FontAwesomeIcon icon={faArrowLeft}/></a>
                          <a href='#' className={styles.navIcon} onClick={() => {moveTask(task.id, targets[2])}}><FontAwesomeIcon icon={faArrowRight}/></a>
                          <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(task.id)}}><FontAwesomeIcon icon={faEdit} /></a>
                          <a href='#' onClick={() => {deleteTask(task.id)}}><FontAwesomeIcon icon={faTrash}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          {task.taskName}
                        </div>
                        
                        {task.taskDesc && <div className={styles.card__desc}>{task.taskDesc}</div>}

                      </div>
                    }
                  }
                })
              } 

              <div className={styles.cardAdd}>
                <a href='#' onClick={() => {addNewTask(targets[1])}}><FontAwesomeIcon icon={faPlus} /></a>
              </div>

              {gotTask(doneCount != 0)}
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
                    task.taskTarget == targets[2] && laterCount++;
                  })  
                }
                {<React.Fragment>{laterCount != 0 && laterCount}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.later__content}>
              {
                allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[2]){
                    if(editing[0].mode.isEditing && editing[0].mode.id == task.id){
                      return <div className={styles.card__edit} key={index}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIconSubmit} onClick={() => {submitEditingMode(task.id)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(task.id)}}><FontAwesomeIcon icon={faTimes}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          <input type='text' placeholder={"Title"} defaultValue={task.taskName} 
                              onChange={e => {setEditing((prevState) => {
                                prevState[0].editTitle = e.target.value;
                                return([
                                  ...prevState
                                ])
                              });
                            }
                          }></input>
                        </div>
                        <div className={styles.card__desc}>
                          <textarea placeholder={"Description"} cols="25" rows="5" style={{width : "100%"}} defaultValue={task.taskDesc} 
                              onChange={e => {setEditing((prevState) => {
                                prevState[0].editDesc = e.target.value;
                                return([
                                  ...prevState
                                ])
                              });
                            }
                          }></textarea>
                        </div>
                      </div>
                    }else{
                      return <div className={styles.card} key={index} onMouseEnter={() => {toggleTaskHover(index)}} onMouseLeave={() => {setTaskHovered([false, -1])}}>
                        {/* Controls */}
                        <div className={taskHovered[1] == index && !editing[0].mode.isEditing ? styles.card__controls_hover : styles.card__controls}>
                          <a href='#' className={styles.navIcon} onClick={() => {moveTask(task.id, targets[1])}}><FontAwesomeIcon icon={faArrowLeft}/></a>
                          <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(task.id)}}><FontAwesomeIcon icon={faEdit} /></a>
                          <a href='#' onClick={() => {deleteTask(task.id)}}><FontAwesomeIcon icon={faTrash}/></a>
                        </div>
                        {/* End of Controls */}
                        <div className={styles.card__title}>
                          {task.taskName}
                        </div>
                        
                        {task.taskDesc && <div className={styles.card__desc}>{task.taskDesc}</div>}
                        
                      </div>
                    }
                  }
                })
              } 

              <div className={styles.cardAdd}>
                <a href='#' onClick={() => {addNewTask(targets[2])}}><FontAwesomeIcon icon={faPlus} /></a>
              </div>

              {gotTask(laterCount != 0)}
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