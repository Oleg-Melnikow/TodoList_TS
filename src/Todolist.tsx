import React, {ChangeEvent, useCallback} from "react";
import {FilterValueType, TaskType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, TextField} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";

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

export const TodoList = React.memo((props: PropsType) => {
    console.log("Todolist called");
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    let tasksForTodoList = props.tasks
    if (props.filter === "active") {
        tasksForTodoList = tasksForTodoList.filter(t => !t.isDone)
    }
    if (props.filter === "completed") {
        tasksForTodoList = tasksForTodoList.filter(t => t.isDone)
    }

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [])
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [])
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [])
    const remoteTodoList = () => props.remoteTodoList(props.id)

    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }, [props.changeTodoListTitle, props.id])

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
                    tasksForTodoList.map(task => {
                        return <Task task={task} todoListId={props.id} remoteTask={props.remoteTask}
                                     changeStatus={props.changeStatus} changeTaskTitle={props.changeTaskTitle}/>
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
})