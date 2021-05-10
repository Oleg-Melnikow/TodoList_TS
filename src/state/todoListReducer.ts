import {v1} from "uuid";
import {TodoListType} from "../api/todolist-api";


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

const initialState: Array<TodoListDomainType> = [];

export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValueType
}

export const todoListReducer = (state: Array<TodoListDomainType> = initialState, action: ActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE_TODOLIST":
            return state.filter(t => t.id !== action.todoListId)
        case "ADD_TODOLIST":
            return [{
                id: action.todoListId,
                title: action.title,
                filter: "all",
                addedDate: "",
                order: 0
            },
                ...state]
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
