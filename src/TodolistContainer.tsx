import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import { Container, Grid, Paper} from "@material-ui/core";
import {TaskStatuses} from "./api/todolist-api";
import {
    changeTodoListFilterAC,
    createTodoListsTC,
    deleteTodoListsTC,
    FilterValueType, setTodoListsTC,
    TodoListDomainType, updateTodoListTitleTC
} from "./state/todoListReducer";
import {useDispatch, useSelector} from "react-redux";
import {addTaskTC, deleteTasksTC, TaskStateType, updateTaskTC} from "./state/taskReducer";
import {TodoList} from "./Todolist";
import {AppRootStateType} from "./state/store";
import {Redirect} from "react-router-dom";

export const TodoListContainer = React.memo(() => {

    const isLoggedIn = useSelector<AppRootStateType, boolean>( state => state.auth.isLoggedIn);

    useEffect(() => {
        if(!isLoggedIn){
            return;
        }
        dispatch(setTodoListsTC())
    }, []);

    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists);
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    const dispatch = useDispatch();

    const remoteTask = useCallback((todoListId: string, taskId: string) => {
        dispatch(deleteTasksTC(todoListId, taskId))
    }, [dispatch]);

    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskTC(todoListId, title))
    }, [dispatch]);

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTaskTC(taskId, {status}, todoListId))
    }, [dispatch]);

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todoListId: string) => {
        dispatch(updateTaskTC(taskId, {title: newTitle}, todoListId))
    }, [dispatch]);

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoListsTC(title));
    }, [dispatch]);

    const remoteTodoList = useCallback((todoListId: string) => {
        dispatch(deleteTodoListsTC(todoListId));
    }, [dispatch]);


    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        dispatch(changeTodoListFilterAC(todoListId, value));
    }, [dispatch]);

    const changeTodoListTitle = useCallback((id: string, newTitle: string) => {
        dispatch(updateTodoListTitleTC(id, newTitle))
    }, [dispatch]);

    if(!isLoggedIn){
        return <Redirect to={"/login"}/>
    }

    return (
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
    )
})