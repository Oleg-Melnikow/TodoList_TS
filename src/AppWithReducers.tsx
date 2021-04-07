import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {todoListReducer, AddTodoListAC, changeTodoListTitleAC, RemoveTodolistAC, changeTodoListFilterAC} from "./state/todoListReducer";
import {taskReducer, removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from "./state/taskReducer";

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

export function AppWithReducers() {

    function remoteTask(id: string, todoListId: string) {
        dispatchTasks(removeTaskAC(id, todoListId))
    }

    function addTask(title: string, todoListId: string) {
        dispatchTasks(addTaskAC(todoListId, title))
    }

    function changeStatus(id: string, isDone: boolean, todoListId: string) {
        dispatchTasks(changeTaskStatusAC(todoListId, id, isDone))
    }

    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        dispatchTasks(changeTaskTitleAC(todoListId, id, newTitle))
    }

    let todoListID_1 = v1()
    let todoListID_2 = v1()

    let [todoLists, dispatchTodoLists] = useReducer(todoListReducer,[
        {id: todoListID_1, title: "What to learn", filter: "active"},
        {id: todoListID_2, title: "What to buy", filter: "completed"}
    ])

    const [tasks, dispatchTasks] = useReducer(taskReducer,{
        [todoListID_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false}
        ],
        [todoListID_2]: [
            {id: v1(), title: "Book", isDone: true},
            {id: v1(), title: "Journal", isDone: false}
        ]
    })

    function addTodoList(title: string) {
        dispatchTodoLists(AddTodoListAC(title))
    }

    function remoteTodoList(todoListId: string) {
        dispatchTodoLists(RemoveTodolistAC(todoListId))
    }


    function changeFilter(value: FilterValueType, todoListId: string) {
        dispatchTodoLists(changeTodoListFilterAC(todoListId, value));
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        dispatchTodoLists(changeTodoListTitleAC(id, newTitle))
    }

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

                        let tasksForTodoList = tasks[tl.id]
                        if (tl.filter === "active") {
                            tasksForTodoList = tasksForTodoList.filter(t => !t.isDone)
                        }
                        if (tl.filter === "completed") {
                            tasksForTodoList = tasksForTodoList.filter(t => t.isDone)
                        }

                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <TodoList key={tl.id} title={tl.title} tasks={tasksForTodoList}
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