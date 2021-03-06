import React, {ChangeEvent} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "./api/todolist-api";
import {TaskDomainType} from "./state/taskReducer";


export type TaskPropsType = {
    task: TaskDomainType,
    remoteTask: (id: string) => void,
    changeStatus: (taskId: string, status: TaskStatuses) => void,
    changeTaskTitle: (id: string, newTitle: string) => void,
}

export const Task = React.memo((props: TaskPropsType) => {
    let {id, title, status} = props.task

    const deleteTask = () => {
        props.remoteTask(id)
    }

    const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
    }
    const changeTaskTitle = (newTitle: string) => {
        props.changeTaskTitle(id, newTitle)
    }

    return <li className={status === TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox checked={status === TaskStatuses.Completed} onChange={onChangeTaskStatus} style={{color: "green"}} disabled={props.task.entityStatus === "loading"}/>
        <EditableSpan value={title} changeTitle={changeTaskTitle} disabled={props.task.entityStatus === "loading"}/>
        <IconButton onClick={deleteTask} disabled={props.task.entityStatus === "loading"} color={"secondary"}>
            <Delete/>
        </IconButton>
    </li>
})