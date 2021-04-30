import axios from 'axios'

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': process.env.REACT_APP_API_KEY
    }
}

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists/",
    ...settings
})

export const todolistAPI = {
    createTodoList(){
        return instance.post("",{title: "newJS"})
    },
    getTodoLists(){
        return instance.get("")
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put(`${todolistId}`, {title: title})
    },
    deleteTodoList(todolistId: string){
        return  instance.delete(`${todolistId}`)
    }
}
