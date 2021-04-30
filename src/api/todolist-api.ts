import axios from 'axios'

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': process.env.REACT_APP_API_KEY
    }
}

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    ...settings
})

type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>,
    fieldsErrors: Array<string>
    data: T
}

type TaskType = {
    description: string,
    title: string,
    completed: string,
    status: number,
    priority: number,
    startDate: string,
    deadline: string,
    id: string,
    todoListId: string,
    order: string,
    addedDate: string
}

type ResponseTaskType = {
    items: Array<TaskType>,
    totalCount: number,
    error: string | null
}

export const todolistAPI = {
    createTodoList(title: string){
        return instance.post<ResponseType<TodolistType>>("todo-lists/",{title})
    },
    getTodoLists(){
        return instance.get<TodolistType[]>("todo-lists/")
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
    deleteTodoList(todolistId: string){
        return  instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    }
}

export const tasksAPI = {
    createTask(todolistId: string){
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`,{title: "newJS hello"})
    },
    getTasks(todolistId: string){
        return instance.get<ResponseTaskType>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string){
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistId: string, taskId: string, title: string){
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }
}
