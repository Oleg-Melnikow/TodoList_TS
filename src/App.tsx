import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";

export type FilterValueType = "all" | "active" | "completed";

type TodoListType = {
    id: string,
    title: string,
    filter: FilterValueType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TaskStateType = {
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
        let newTask: TaskType = {id: v1(), title: title, isDone: false}
        tasks[todoListId] = [newTask, ...tasks[todoListId]]
        setTasks({...tasks})
    }

    function changeStatus(id: string, isDone: boolean, todoListId: string) {
        let task = tasks[todoListId].find(t => t.id === id)
        if (task) {
            task.isDone = isDone
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

    let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListID_1, title: "What to learn", filter: "active"},
        {id: todoListID_2, title: "What to buy", filter: "completed"}
    ])

    const [tasks, setTasks] = useState<TaskStateType>({
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
        let newTodoListId = v1();
        let newTodoList: TodoListType = {id: newTodoListId, title, filter: "all"};
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
            <AddItemForm addItem={addTodoList}/>
            {todoLists.map(tl => {

                let tasksForTodoList = tasks[tl.id]
                if (tl.filter === "active") {
                    tasksForTodoList = tasksForTodoList.filter(t => !t.isDone)
                }
                if (tl.filter === "completed") {
                    tasksForTodoList = tasksForTodoList.filter(t => t.isDone)
                }

                return <TodoList key={tl.id} title={tl.title} tasks={tasksForTodoList}
                                 remoteTask={remoteTask} id={tl.id}
                                 changeFilter={changeFilter} addTask={addTask}
                                 changeStatus={changeStatus} filter={tl.filter}
                                 changeTaskTitle={changeTaskTitle}
                                 changeTodoListTitle={changeTodoListTitle}
                                 remoteTodoList={remoteTodoList}/>
            })}

        </div>
    );
}

export default App;
