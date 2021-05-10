import React, {useCallback} from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";
import {TaskType} from "./api/todolist-api";
import {FilterValueType} from "./state/todoListReducer";

type PropsType = {
    id: string,
    title: string,
    tasks: Array<TaskType>,
    remoteTask: (todoListId: string, id: string) => void,
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
        tasksForTodoList = tasksForTodoList.filter(t => !t.completed)
    }
    if (props.filter === "completed") {
        tasksForTodoList = tasksForTodoList.filter(t => t.completed)
    }

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.id])

    const remoteTodoList = () => {
        props.remoteTodoList(props.id)
    }

    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }, [props.changeTodoListTitle, props.id])

    const onClickHandler = useCallback((taskId: string) => {
        props.remoteTask(props.id, taskId)
    }, [props.id, props.remoteTask])

    const onChangeHandler = useCallback((taskId: string, isDone: boolean) => {
        props.changeStatus(taskId, isDone, props.id)
    }, [props.id, props.changeStatus])

    const onTitleChangeHandler = useCallback((taskId: string, newTitle: string) => {
        props.changeTaskTitle(taskId, newTitle, props.id)
    }, [props.id, props.changeTaskTitle])

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
                        return <Task key={task.id} task={task} remoteTask={onClickHandler}
                                     changeStatus={onChangeHandler} changeTaskTitle={onTitleChangeHandler}/>
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