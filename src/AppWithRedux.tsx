import React, {useCallback} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {AddTodoListAC, changeTodoListTitleAC, RemoveTodolistAC, changeTodoListFilterAC} from "./state/todoListReducer";
import {removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from "./state/taskReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValueType = "all" | "active" | "completed";

export type TodoListType = {
    id: string,
    title: string,
    filter: FilterValueType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

export function AppWithRedux() {

    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todoLists);
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    const dispatch = useDispatch();

    const remoteTask = useCallback((todoListId: string, taskId: string) => {
        dispatch(removeTaskAC(todoListId, taskId))
    }, [])

    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskAC(todoListId, title))
    }, [])

    const changeStatus = useCallback((id: string, isDone: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(todoListId, id, isDone))
    }, [])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(todoListId, id, newTitle))
    }, [])

    const addTodoList = useCallback((title: string) => {
        let action = AddTodoListAC(title);
        dispatch(action);
    }, [])

    const remoteTodoList = useCallback((todoListId: string) => {
        let action = RemoveTodolistAC(todoListId);
        dispatch(action);
    }, [])


    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(todoListId, value));
    }, [])

    const changeTodoListTitle = useCallback((id: string, newTitle: string) => {
        dispatch(changeTodoListTitleAC(id, newTitle))
    }, [])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "15px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={6}>
                    {todoLists.map(tl => {
                        return <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <TodoList key={tl.id} title={tl.title} tasks={tasks[tl.id]}
                                          remoteTask={remoteTask} id={tl.id}
                                          changeFilter={changeFilter} addTask={addTask}
                                          changeStatus={changeStatus} filter={tl.filter}
                                          changeTaskTitle={changeTaskTitle}
                                          changeTodoListTitle={changeTodoListTitle}
                                          remoteTodoList={remoteTodoList}/>
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>
        </div>
    );
}