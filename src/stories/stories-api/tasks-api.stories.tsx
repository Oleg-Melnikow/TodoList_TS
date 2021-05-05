import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../../api/todolist-api";

export default {
    title: 'tasksAPI'
}

export const GetTask = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>("");

    function setTasks() {
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data.items);
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} placeholder="todoListId"
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={setTasks}>set tasks</button>
        </div>
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    function addTasks() {
        tasksAPI.createTask(todolistId, title)
            .then((res) => {
                setState(res.data.data);
                setTitle("")
            })
    }


    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} placeholder="todoListId"
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" value={title} placeholder="Title"
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={addTasks}>add tasks</button>
        </div>
    </div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>("");
    const [taskId, setTaskId] = useState<string>("");

    function deleteTasks() {
        tasksAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data);
            })
    }

    //6bd62177-7a15-4bd0-950c-1a140fbc2d1b
    //c6e39b06-6e07-45b5-a550-877c60b14de3

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} placeholder="todoListId"
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" value={taskId} placeholder="taskId"
                   onChange={(e) => setTaskId(e.currentTarget.value)}/>
            <button onClick={deleteTasks}>delete tasks</button>
        </div>
    </div>
}

export const UpdateTaskTitle = () => {
    const [todolistId, setTodolistId] = useState<string>("");
    const [taskId, setTaskId] = useState<string>("");
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [completed, setCompleted] = useState<boolean>(false);
    const [status, setStatus] = useState<number>(1);
    const [priority, setPriority] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");

    function updateTasks() {
        tasksAPI.updateTaskTitle(todolistId, taskId, {
            title,
            description,
            completed,
            status,
            priority,
            startDate,
            deadline
        })
            .then((res) => {
                setState(res.data.data)
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} placeholder="todoListId"
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" value={taskId} placeholder="taskId"
                   onChange={(e) => setTaskId(e.currentTarget.value)}/>
            <input type="text" value={title} placeholder="title"
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <input type="text" value={description} placeholder="description"
                   onChange={(e) => setDescription(e.currentTarget.value)}/>
            <input type="text" value={status} placeholder="status"
                   onChange={(e) => setStatus(+e.currentTarget.value)}/>
            <input type="checkbox" checked={completed}
                   onChange={(e) => setCompleted(e.currentTarget.checked)}/>
            <button onClick={updateTasks}>update tasks</button>
        </div>
    </div>
}
