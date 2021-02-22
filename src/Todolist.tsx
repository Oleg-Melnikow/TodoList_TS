import React from "react";
import {FilterValueType} from "./App";

type PropsType = {
    title: string,
    tasks: Array<TaskType>,
    remoteTask: (id: number) => void,
    changeFilter: (value: FilterValueType) => void
}

type TaskType = {
    id: number,
    title: string,
    isDone: boolean
}

export function TodoList(props: PropsType) {
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {
                    props.tasks.map(task => <li>
                        <input type="checkbox" checked={task.isDone}/>
                        <span>{task.title}</span>
                        <button onClick={()=>props.remoteTask(task.id)}>x</button>
                    </li>)
                }
            </ul>
            <div>
                <button onClick={()=>{props.changeFilter("all")}}>All</button>
                <button onClick={()=>{props.changeFilter("active")}}>Active</button>
                <button onClick={()=>{props.changeFilter("completed")}}>Completed</button>
            </div>
        </div>
    )
}