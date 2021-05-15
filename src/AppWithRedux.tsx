import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, LinearProgress, Paper, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {
    changeTodoListFilterAC,
    TodoListDomainType,
    FilterValueType,
    setTodoListsTC,
    updateTodoListTitleTC,
    createTodoListsTC,
    deleteTodoListsTC
} from "./state/todoListReducer";
import {
    deleteTasksTC,
    addTaskTC, updateTaskTC
} from "./state/taskReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {RequestStatusType} from "./state/appReducer";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";


export type TaskStateType = {
    [key: string]: Array<TaskType>
}

export function AppWithRedux() {

    useEffect(() => {
        dispatch(setTodoListsTC())
    }, []);

    const status = useSelector<AppRootStateType, RequestStatusType>( state => state.app.status)

    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists);
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    const dispatch = useDispatch();

    const remoteTask = useCallback((todoListId: string, taskId: string) => {
        dispatch(deleteTasksTC(todoListId, taskId))
    }, [dispatch])

    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskTC(todoListId, title))
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTaskTC(taskId, {status}, todoListId))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todoListId: string) => {
        dispatch(updateTaskTC(taskId, {title: newTitle}, todoListId))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoListsTC(title));
    }, [dispatch])

    const remoteTodoList = useCallback((todoListId: string) => {
        dispatch(deleteTodoListsTC(todoListId));
    }, [dispatch])


    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(todoListId, value));
    }, [dispatch])

    const changeTodoListTitle = useCallback((id: string, newTitle: string) => {
        dispatch(updateTodoListTitleTC(id, newTitle))
    }, [dispatch])

    return (
        <div className="App">
            <ErrorSnackbar/>
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
            {status === "loading" && <LinearProgress color="secondary"/>}
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
                                          entityStatus={tl.entityStatus}
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