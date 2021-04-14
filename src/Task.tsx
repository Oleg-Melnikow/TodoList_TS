import React, {ChangeEvent} from "react";
import {TaskType} from "./App";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";


type TaskPropsType = {
    task: TaskType,
    todoListId: string,
    remoteTask: (id: string, todoListId: string) => void,
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void,
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void,
}

export const Task = React.memo((props: TaskPropsType) => {

    let {id, title, isDone} = props.task

    const deleteTask = () => props.remoteTask(props.todoListId, id)
    const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeStatus(id, newIsDoneValue, props.todoListId)
    }
    const changeTaskTitle = (newTitle: string) => {
        props.changeTaskTitle(id, newTitle, props.todoListId)
    }
    return <li key={id} className={isDone ? "is-done" : ""}>
        <Checkbox checked={isDone} onChange={onChangeTaskStatus} style={{color: "green"}}/>
        <EditableSpan value={title} changeTitle={changeTaskTitle}/>
        <IconButton onClick={deleteTask}>
            <Delete color={"secondary"}/>
        </IconButton>
    </li>
})