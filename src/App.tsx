import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {v1} from "uuid";

export type FilterValueType = "all" | "active" | "completed";

type TodoListType = {
    id: string,
    title: string,
    filter: FilterValueType
}

function App() {

    function remoteTask(id: string, todoListId: string) {
        tasks[todoListId] = tasks[todoListId].filter(t => t.id !== id)
        setTasks({...tasks})
    }

    function changeFilter(value: FilterValueType, todoListId: string) {
        let todoList = todoLists.find(tl => tl.id === todoListId)
        if(todoList){
            todoList.filter = value
            setTodoLists([...todoLists])
        }

    }
    function addTask(title: string, todoListId: string) {
        let newTask = {id: v1(), title: title, isDone: false}
        tasks[todoListId] = [newTask, ...tasks[todoListId]]
        setTasks({...tasks})
    }

    function changeStatus(id: string, isDone: boolean, todoListId: string){
        let task = tasks[todoListId].find(t => t.id === id)
        if(task){
            task.isDone = isDone
            setTasks({...tasks})
        }
    }

    function remoteTodoList(todoListId: string) {
        debugger
        todoLists = todoLists.filter(t => t.id !== todoListId)
        setTodoLists(todoLists)
        delete tasks[todoListId]
        setTasks({...tasks})
    }

    let todoList1 = v1()
    let todoList2 = v1()

    let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoList1, title: "What to learn", filter: "active"},
        {id: todoList2, title: "What to buy", filter: "completed"}
    ])

    const [tasks, setTasks] = useState({
        [todoList1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false}
        ],
        [todoList2]: [
            {id: v1(), title: "Book", isDone: true},
            {id: v1(), title: "Journal", isDone: false}
        ]
    })

    return (
        <div className="App">
            {todoLists.map(tl => {

                let tasksForTodoList = tasks[tl.id]
                if (tl.filter === "active") {
                    tasksForTodoList = tasksForTodoList.filter(t => t.isDone === false)
                }
                if (tl.filter === "completed") {
                    tasksForTodoList = tasksForTodoList.filter(t => t.isDone === true)
                }

                return <TodoList key={tl.id} title={tl.title} tasks={tasksForTodoList}
                                 remoteTask={remoteTask} id={tl.id}
                                 changeFilter={changeFilter} addTask={addTask}
                                 changeStatus={changeStatus} filter={tl.filter}
                                 remoteTodoList={remoteTodoList}/>
            })}

        </div>
    );
}

export default App;
