import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./Todolist";

export type FilterValueType = "all" | "active" | "completed";

function App() {

    const [tasks, setTasks] = useState([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false}
    ])

    const [filter, setFilter] = useState<FilterValueType>("all")
    let tasksForTodoList = tasks
    if(filter === "active"){
        tasksForTodoList = tasks.filter(t => t.isDone === false)
    }
    if(filter === "completed"){
        tasksForTodoList = tasks.filter(t => t.isDone === true)
    }

    function remoteTask(id:number){
        const filteredTasks = tasks.filter(t => t.id !== id)
        setTasks(filteredTasks)
    }

    function changeFilter(value: FilterValueType){
        setFilter(value)
    }

    return (
        <div className="App">
            <TodoList title="What to learn" tasks={tasksForTodoList} remoteTask={remoteTask} changeFilter={changeFilter}/>
        </div>
    );
}

export default App;
