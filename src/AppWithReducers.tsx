import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {
    todoListReducer,
    AddTodoListAC,
    changeTodoListTitleAC,
    RemoveTodolistAC,
    changeTodoListFilterAC
} from "./state/todoListReducer";
import {
    taskReducer,
    removeTaskAC,
    updateTaskAC,
    addTaskTC
} from "./state/taskReducer";
import {TaskStatuses} from "./api/todolist-api";
import {useDispatch} from "react-redux";

export type FilterValueType = "all" | "active" | "completed";

export function AppWithReducers() {

    const dispatch = useDispatch()

    function remoteTask(id: string, todoListId: string) {
        dispatchTasks(removeTaskAC(id, todoListId))
    }

    function addTask(title: string, todoListId: string) {
        dispatch(addTaskTC(todoListId, title))
    }

    function changeStatus(id: string, status: TaskStatuses, todoListId: string) {
        dispatchTasks(updateTaskAC(todoListId, id, {status}))
    }

    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        dispatchTasks(updateTaskAC(todoListId, id, {title: newTitle}))
    }

    let todoListID_1 = v1()
    let todoListID_2 = v1()

    let [todoLists, dispatchTodoLists] = useReducer(todoListReducer, [
        {id: todoListID_1, title: "What to learn", filter: "active", addedDate: "", order: 0, entityStatus: "idle"},
        {id: todoListID_2, title: "What to buy", filter: "completed", addedDate: "", order: 0, entityStatus: "idle"}
    ])

    const [tasks, dispatchTasks] = useReducer(taskReducer, {
        [todoListID_1]: [
            {id: v1(), title: "HTML&CSS", order: 1, addedDate: "",
                todoListId: todoListID_1, status: TaskStatuses.Completed, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"},
            {id: v1(), title: "JS", order: TaskStatuses.InProgress, addedDate: "",
                todoListId: todoListID_1, status: 1, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"},

        ],
        [todoListID_2]: [
            {id: v1(), title: "Book", order: 1, addedDate: "",
                todoListId: todoListID_2, status: TaskStatuses.InProgress, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"},
            {id: v1(), title: "Journal", order: 1, addedDate: "",
                todoListId: todoListID_2, status: TaskStatuses.New, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"}
        ]
    })

    function addTodoList(title: string) {
        let action = AddTodoListAC({todoList: {id: v1(), addedDate: "", order: 0, title}});
        dispatchTodoLists(action);
        dispatchTasks(action);
    }

    function remoteTodoList(todoListId: string) {
        let action = RemoveTodolistAC({todoListId: todoListId});
        dispatchTodoLists(action);
        dispatchTasks(action);
    }


    function changeFilter(value: FilterValueType, todoListId: string) {
        dispatchTodoLists(changeTodoListFilterAC({todoListId: todoListId, filter: value}));
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        dispatchTodoLists(changeTodoListTitleAC({todoListId: id, newTitle: newTitle}))
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
                            tasksForTodoList = tasksForTodoList.filter(t => !t.status)
                        }
                        if (tl.filter === "completed") {
                            tasksForTodoList = tasksForTodoList.filter(t => t.status)
                        }

                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <TodoList key={tl.id} title={tl.title} tasks={tasksForTodoList}
                                          remoteTask={remoteTask} id={tl.id}
                                          entityStatus={tl.entityStatus}
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