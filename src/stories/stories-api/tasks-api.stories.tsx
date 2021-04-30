import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../../api/todolist-api";

export default {
    title: 'tasksAPI'
}

export const GetTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '05b3a6eb-b2c0-4b99-a660-26e7b86eaa0d'
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data.items);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '05b3a6eb-b2c0-4b99-a660-26e7b86eaa0d'
        tasksAPI.createTask(todolistId)
            .then((res) => {
                setState(res.data.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '05b3a6eb-b2c0-4b99-a660-26e7b86eaa0d';
        const taskId = "516a0326-5e42-4dc0-bd84-6c8ab300d847"
        tasksAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '05b3a6eb-b2c0-4b99-a660-26e7b86eaa0d'
        const taskId = "bceb811b-875b-4831-900d-85a12326908b"
        tasksAPI.updateTaskTitle(todolistId, taskId, "Hello World")
            .then((res) => {
                setState(res.data.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
