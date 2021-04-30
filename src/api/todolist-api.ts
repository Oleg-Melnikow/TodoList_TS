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
