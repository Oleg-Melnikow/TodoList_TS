import React, {ChangeEvent} from "react";
import {FilterValueType, TaskType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, TextField} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type PropsType = {
    id: string,
    title: string,
    tasks: Array<TaskType>,
    remoteTask: (id: string, todoListId: string) => void,
    changeFilter: (value: FilterValueType, todoListId: string) => void,
    addTask: (title: string, todoListId: string) => void,
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void,
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void,
    remoteTodoList: (todoListId: string) => void,
    changeTodoListTitle: (id: string, newTitle: string) => void,
    filter: string
}

export function TodoList(props: PropsType) {

    function addTask(title: string) {
        props.addTask(title, props.id)
    }

    const onAllClickHandler = () => props.changeFilter("all", props.id)
    const onActiveClickHandler = () => props.changeFilter("active", props.id)
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id)
    const remoteTodoList = () => props.remoteTodoList(props.id)

    const changeTodoListTitle = (newTitle: string) => props.changeTodoListTitle(props.id, newTitle)

    return (
        <div>
            <div>
                <EditableSpan value={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={remoteTodoList}>
                    <Delete color={"secondary"}/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTask}/>
            <ul>
                {
                    props.tasks.map(task => {
                        const deleteTask = () => props.remoteTask(task.id, props.id)
                        const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            let newIsDoneValue = e.currentTarget.checked
                            props.changeStatus(task.id, newIsDoneValue, props.id)
                        }
                        const changeTaskTitle = (newTitle: string) => {
                            props.changeTaskTitle(task.id, newTitle, props.id)
                        }
                        return <li key={task.id} className={task.isDone ? "is-done" : ""}>
                            <Checkbox checked={task.isDone} onChange={onChangeTaskStatus} style={{color: "green"}}/>
                            <EditableSpan value={task.title} changeTitle={changeTaskTitle}/>
                            <IconButton onClick={deleteTask}>
                                <Delete color={"secondary"}/>
                            </IconButton>
                        </li>
                    })
                }
            </ul>
            <div>
                <Button variant={props.filter === "all" ? "contained" : "text"} onClick={onAllClickHandler}>All
                </Button>
                <Button color={"secondary"} variant={props.filter === "active" ? "contained" : "text"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={"primary"} variant={props.filter === "completed" ? "contained" : "text"}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
}