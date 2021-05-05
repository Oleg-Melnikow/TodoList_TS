import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../../api/todolist-api";

export default {
    title: 'todolistAPI'
}

export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodoLists()
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodoList = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<any>(null);

    function addTodoList() {
        todolistAPI.createTodoList(title)
            .then((res) => {
                setState(res.data.data.item);
                setTitle("");
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={title} placeholder="Title"
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={addTodoList}>Add todoList</button>
        </div>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>("");

    function deleteTodolist() {
        todolistAPI.deleteTodoList(todolistId)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} placeholder="todoListId"
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={deleteTodolist}>delete</button>
        </div>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const [newTitle, setNewTitle] = useState<string>("");
    const [todolistId, setTodolistId] = useState<string>("");

    function updateTodolist() {
        todolistAPI.updateTodolist(todolistId, newTitle)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} placeholder="todoListId"
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" value={newTitle} placeholder="Title"
                   onChange={(e) => setNewTitle(e.currentTarget.value)}/>
            <button onClick={updateTodolist}>update</button>
        </div>
    </div>
}