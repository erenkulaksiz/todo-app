import React, { useState, useEffect } from 'react';
import styles from '../styles/app.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartbeat, faCheckCircle, faLightbulb, faArrowLeft, faArrowRight, faEdit, faPlus, faCheck, faTrash, faTimes, faSync } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const App = () => {

  // States
  
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [editing, setEditing] = useState([
    {
      editTitle: null,
      editDesc: null,
      mode: {
        isEditing: false,
        index: -1,
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
      taskTarget: target}
  
    await axios.post(apiRoute, newTask)
      .then(res => {
        const data = res.data;
        console.log(data);
      })

    setAllTasks([...allTasks, {taskName: 'New Task', taskDesc: 'Description (Optional)', taskTarget: target}]);

    handleRefresh();
  }

  const deleteTask = async (index) => {
    const temp = [...allTasks];
    const taskIndex = temp[index]['id'];

    if(taskIndex){
      await axios.delete(apiRoute+taskIndex)
      .then(res => {
        const data = res.data;
        console.log(data);
      })
      temp.splice(index, 1);
      setAllTasks(temp);
      setTaskHovered([false, -1]);
    }else{
      console.log("error with index: "+index);
      console.log("TRY AGAIN");
      handleRefresh();
    }
  }

  const moveTask = (index, target) => {
    const temp = [...allTasks];
    temp[index].taskTarget = target;
    setAllTasks(temp);
    sendTasksToAPI(index);
  }

  const enterEditingMode = (index) => {
    setEditing((prevState) => {
      prevState[0].editTitle = null;
      prevState[0].editDesc = null;
      prevState[0].mode.isEditing = true;
      prevState[0].mode.index = index;
      return([
        ...prevState
      ])
    });
  }

  const exitEditingMode = (index) => {
    setEditing((prevState) => {
      prevState[0].mode.isEditing = false;
      prevState[0].mode.index = index;
      return([
        ...prevState
      ])
    });
  }

  const submitEditingMode = async (index) => {
    const temp = [...allTasks];
    console.log("submitting edit name: "+editing[0].editTitle+" desc: "+editing[0].editDesc+ " index: "+index);

    if(editing[0].editTitle && /\S/.test(editing[0].editTitle)){ 
      temp[index].taskName = editing[0].editTitle;
      // success edit of title
      if(editing[0].editDesc || editing[0].editDesc === ""){ 
        temp[index].taskDesc = editing[0].editDesc; 
      }
      setAllTasks(temp);
      exitEditingMode(index);
      sendTasksToAPI(index);
    } else { 
      /*deleteTask(index);*/
      if(editing[0].editDesc || editing[0].editDesc === ""){ 
        temp[index].taskDesc = editing[0].editDesc; 
      }
      exitEditingMode(index); 
      sendTasksToAPI(index);
    } 

    if(editing[0].editTitle === ""){
      deleteTask(index);
    }
  }

  const sendTasksToAPI = async (index) => {
    const temp = [...allTasks];

    if(temp[index]['id']){
      await axios.put(apiRoute+temp[index]['id'], temp[index])
        .then(res => {
          const data = res.data;
          console.log(data);
        })
      console.log("send task index: "+index+" id:"+temp[index]['id']);
    }else{
      console.log("error with index: "+index);
    }

    handleRefresh();
  }

  const handleRefresh = async () => {
    console.log("refreshing...");
    setLoading(true);
    await axios.get(apiRoute)
      .then(res => {
        const data = res.data;
        console.log(data);
        setAllTasks(data);
        setLoading(false);
      })
  
  }

  useEffect(() => {
    console.log("API URL: "+apiRoute);
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
            {isLoading && <div className={styles.refresh__text}>Loading tasks...</div>}
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
                !isLoading && allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[0]){
                    if(editing[0].mode.isEditing == true && editing[0].mode.index == index){
                      return <div className={styles.card__edit} key={index}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIconSubmit} onClick={() => {submitEditingMode(index)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(index)}}><FontAwesomeIcon icon={faTimes}/></a>
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
                        <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[1])}}><FontAwesomeIcon icon={faArrowRight}/></a>
                        <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(index)}}><FontAwesomeIcon icon={faEdit} /></a>
                        <a href='#' onClick={() => {deleteTask(index)}}><FontAwesomeIcon icon={faTrash}/></a>
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

              {
                isLoading ? <div className={styles.card}>
                  <div className={styles.card__title_skeleton}></div>
                  <div className={styles.card__desc_skeleton}></div> 
                </div> : <React.Fragment>
                <div className={styles.cardAdd}>
                  <a href='#' onClick={() => {addNewTask(targets[0])}}><FontAwesomeIcon icon={faPlus} /></a>
                </div>

                {gotTask(todoCount != 0)}

                </React.Fragment> 
              }

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
                {<React.Fragment>{doneCount != 0 ? doneCount : null}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.done__content}>
              {
                !isLoading && allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[1]){
                    if(editing[0].mode.isEditing == true && editing[0].mode.index == index){
                      return <div className={styles.card__edit} key={index}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIconSubmit} onClick={() => {submitEditingMode(index)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(index)}}><FontAwesomeIcon icon={faTimes}/></a>
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
                          <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[0])}} ><FontAwesomeIcon icon={faArrowLeft}/></a>
                          <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[2])}}><FontAwesomeIcon icon={faArrowRight}/></a>
                          <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(index)}}><FontAwesomeIcon icon={faEdit} /></a>
                          <a href='#' onClick={() => {deleteTask(index)}}><FontAwesomeIcon icon={faTrash}/></a>
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

              {
                isLoading ? <div className={styles.card}>
                  <div className={styles.card__title_skeleton}></div>
                  <div className={styles.card__desc_skeleton}></div> 
                </div> : <React.Fragment>
                <div className={styles.cardAdd}>
                  <a href='#' onClick={() => {addNewTask(targets[1])}}><FontAwesomeIcon icon={faPlus} /></a>
                </div>

                {gotTask(doneCount != 0)}

                </React.Fragment> 
              }

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
                {<React.Fragment>{laterCount != 0 ? laterCount : null}</React.Fragment>}
              </div>
            </div>
          </div>
          <div className={styles.later__content}>
              {
                !isLoading && allTasks.map(function(task, index){
                  // Show only the targeted tasks.
                  if(task.taskTarget == targets[2]){
                    if(editing[0].mode.isEditing && editing[0].mode.index == index){
                      return <div className={styles.card__edit} key={index}>
                        {/* Controls */}
                        <div className={styles.card__controls_hover}>
                          <a href='#' className={styles.navIconSubmit} onClick={() => {submitEditingMode(index)}}><FontAwesomeIcon icon={faCheck}/></a>
                          <a href='#' onClick={() => {exitEditingMode(index)}}><FontAwesomeIcon icon={faTimes}/></a>
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
                          <a href='#' className={styles.navIcon} onClick={() => {moveTask(index, targets[1])}}><FontAwesomeIcon icon={faArrowLeft}/></a>
                          <a href='#' className={styles.navIcon} onClick={() => {enterEditingMode(index)}}><FontAwesomeIcon icon={faEdit} /></a>
                          <a href='#' onClick={() => {deleteTask(index)}}><FontAwesomeIcon icon={faTrash}/></a>
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

              {
                isLoading ? <div className={styles.card}>
                  <div className={styles.card__title_skeleton}></div>
                  <div className={styles.card__desc_skeleton}></div> 
                </div> : <React.Fragment>
                <div className={styles.cardAdd}>
                  <a href='#' onClick={() => {addNewTask(targets[2])}}><FontAwesomeIcon icon={faPlus} /></a>
                </div>

                {gotTask(laterCount != 0)}

                </React.Fragment> 
              }

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