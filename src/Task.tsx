import React, {ChangeEvent} from "react";
import {TaskType} from "./App";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";


export type TaskPropsType = {
    task: TaskType,
    remoteTask: (id: string) => void,
    changeStatus: (id: string, isDone: boolean) => void,
    changeTaskTitle: (id: string, newTitle: string) => void,
}

export const Task = React.memo((props: TaskPropsType) => {
    let {id, title, isDone} = props.task

    const deleteTask = () => {
        props.remoteTask(id)
    }
    const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(id, e.currentTarget.checked)
    }
    const changeTaskTitle = (newTitle: string) => {
        props.changeTaskTitle(id, newTitle)
    }

    return <li className={isDone ? "is-done" : ""}>
        <Checkbox checked={isDone} onChange={onChangeTaskStatus} style={{color: "green"}}/>
        <EditableSpan value={title} changeTitle={changeTaskTitle}/>
        <IconButton onClick={deleteTask}>
            <Delete color={"secondary"}/>
        </IconButton>
    </li>
})