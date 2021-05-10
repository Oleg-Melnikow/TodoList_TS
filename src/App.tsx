import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {FilterValueType, TodoListDomainType} from "./state/todoListReducer";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    function remoteTask(id: string, todoListId: string) {
        tasks[todoListId] = tasks[todoListId].filter(t => t.id !== id)
        setTasks({...tasks})
    }

    function changeFilter(value: FilterValueType, todoListId: string) {
        let todoList = todoLists.find(tl => tl.id === todoListId)
        if (todoList) {
            todoList.filter = value
            setTodoLists([...todoLists])
        }

    }

    function addTask(title: string, todoListId: string) {
        let newTask: TaskType = {id: v1(), title: title, status: TaskStatuses.New, order: 1, addedDate: "",
        todoListId, startDate: "", priority: 1, deadline: "", description: ""}
        tasks[todoListId] = [newTask, ...tasks[todoListId]]
        setTasks({...tasks})
    }

    function changeStatus(id: string, status: TaskStatuses, todoListId: string) {
        let task = tasks[todoListId].find(t => t.id === id)
        if (task) {
            task.status = status
            setTasks({...tasks})
        }
    }

    function remoteTodoList(todoListId: string) {
        todoLists = todoLists.filter(t => t.id !== todoListId)
        setTodoLists(todoLists)
        delete tasks[todoListId]
        setTasks({...tasks})
    }

    let todoListID_1 = v1()
    let todoListID_2 = v1()

    let [todoLists, setTodoLists] = useState<Array<TodoListDomainType>>([
        {id: todoListID_1, title: "What to learn", filter: "active", addedDate: "", order: 0},
        {id: todoListID_2, title: "What to buy", filter: "completed", addedDate: "", order: 0}
    ])

    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListID_1]: [
            {id: v1(), title: "HTML&CSS", order: 1, addedDate: "",
                todoListId: todoListID_1, status: TaskStatuses.Completed, startDate: "", priority: 1, deadline: "", description: ""},
            {id: v1(), title: "JS", order: TaskStatuses.InProgress, addedDate: "",
                todoListId: todoListID_1, status: 1, startDate: "", priority: 1, deadline: "", description: ""},
        ],
        [todoListID_2]: [
            {id: v1(), title: "Book", order: 1, addedDate: "",
                todoListId: todoListID_2, status: TaskStatuses.InProgress, startDate: "", priority: 1, deadline: "", description: ""},
            {id: v1(), title: "Journal", order: 1, addedDate: "",
                todoListId: todoListID_2, status: TaskStatuses.New, startDate: "", priority: 1, deadline: "", description: ""}
        ]
    })

    function addTodoList(title: string) {
        let newTodoListId = v1();
        let newTodoList: TodoListDomainType = {id: newTodoListId, title, order: 1, addedDate: "", filter: "all"};
        setTodoLists([newTodoList, ...todoLists])
        setTasks({
            ...tasks,
            [newTodoListId]: []
        })
    }

    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        let task = tasks[todoListId].find(t => t.id === id)
        if (task) {
            task.title = newTitle
            setTasks({...tasks})
        }
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        let todoList = todoLists.find(tl => tl.id === id)
        if (todoList) {
            todoList.title = newTitle
            setTodoLists([...todoLists])
        }
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

export default App;
