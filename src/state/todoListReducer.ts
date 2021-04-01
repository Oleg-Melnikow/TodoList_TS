import {TodoListType, FilterValueType} from "../App";
import {v1} from "uuid";


export type RemoveTodoListActionType = {
    type: "REMOVE_TODOLIST",
    todoListId: string
}

export type AddTodoListActionType = {
    type: "ADD_TODOLIST",
    title: string,
    todoListId: string
}

type changeTodoListTitleActionType = {
    type: "CHANGE_TODOLIST_TITLE",
    todoListId: string,
    newTitle: string
}

type changeTodoListFilterActionType = {
    type: "CHANGE_TODOLIST_FILTER",
    todoListId: string,
    filter: FilterValueType
}

type ActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | changeTodoListTitleActionType
    | changeTodoListFilterActionType;

export const todoListReducer = (state: Array<TodoListType>, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE_TODOLIST":
            return state.filter(t => t.id !== action.todoListId)
        case "ADD_TODOLIST":
            let newTodoList: TodoListType = {id: action.todoListId, title: action.title, filter: "all"};
            return [...state, newTodoList]
        case "CHANGE_TODOLIST_TITLE":
            let todoList = state.find(tl => tl.id === action.todoListId)
            if (todoList) {
                todoList.title = action.newTitle
                return [...state]
            }
            return state
        case "CHANGE_TODOLIST_FILTER": {
            let todoList = state.find(tl => tl.id === action.todoListId)
            if (todoList) {
                todoList.filter = action.filter
                return [...state]
            }
            return state
        }
        default:
            return state
    }
}

export const RemoveTodolistAC = (todoListId: string): RemoveTodoListActionType => {
    return {type: "REMOVE_TODOLIST", todoListId}
}

export const AddTodoListAC = (title: string): AddTodoListActionType => {
    return {type: "ADD_TODOLIST", title, todoListId: v1()}
}

export const changeTodoListTitleAC = (todoListId: string, newTitle: string): changeTodoListTitleActionType => {
    return {type: "CHANGE_TODOLIST_TITLE", todoListId, newTitle}
}

export const changeTodoListFilterAC = (todoListId: string, filter: FilterValueType): changeTodoListFilterActionType => {
    return {type: "CHANGE_TODOLIST_FILTER", todoListId, filter}
}
