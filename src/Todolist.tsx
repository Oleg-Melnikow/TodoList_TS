import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType, TaskType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

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

    return (
        <div>
            <div className="title-wrap">
                <h3>{props.title}</h3>
                <button onClick={remoteTodoList}>x</button>
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
                            <input type="checkbox" checked={task.isDone} onChange={onChangeTaskStatus}/>
                            <EditableSpan value={task.title} changeTitle={changeTaskTitle}/>
                            <button onClick={deleteTask}>x</button>
                        </li>
                    })
                }
            </ul>
            <div>
                <button className={props.filter === "all" ? "active-filter" : ""} onClick={onAllClickHandler}>All
                </button>
                <button className={props.filter === "active" ? "active-filter" : ""}
                        onClick={onActiveClickHandler}>Active
                </button>
                <button className={props.filter === "completed" ? "active-filter" : ""}
                        onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    )
}