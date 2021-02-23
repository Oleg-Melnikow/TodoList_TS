import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./Todolist";
import {v1} from "uuid";

export type FilterValueType = "all" | "active" | "completed";

function App() {

    const [tasks, setTasks] = useState([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false}
    ])

    const [filter, setFilter] = useState<FilterValueType>("all")
    let tasksForTodoList = tasks
    if (filter === "active") {
        tasksForTodoList = tasks.filter(t => t.isDone === false)
    }
    if (filter === "completed") {
        tasksForTodoList = tasks.filter(t => t.isDone === true)
    }

    function remoteTask(id: string) {
        const filteredTasks = tasks.filter(t => t.id !== id)
        setTasks(filteredTasks)
    }

    function changeFilter(value: FilterValueType) {
        setFilter(value)
    }

    function addTask(title: string) {
        let newTask = {id: v1(), title: title, isDone: true}
        setTasks([newTask, ...tasks])
    }

    return (
        <div className="App">
            <TodoList title="What to learn" tasks={tasksForTodoList} remoteTask={remoteTask}
                      changeFilter={changeFilter} addTask={addTask}/>
        </div>
    );
}

export default App;
