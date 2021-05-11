import {todolistAPI, TodoListType} from "../api/todolist-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";

export type RemoveTodoListActionType = {
    type: "REMOVE_TODOLIST",
    todoListId: string
}

export type AddTodoListActionType = {
    type: "ADD_TODOLIST",
    todoList: TodoListType
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

export type SetTodoListsActionType = {
    type: 'SET-TODO_LISTS'
    todoLists: Array<TodoListType>
}

type ActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | changeTodoListTitleActionType
    | changeTodoListFilterActionType
    | SetTodoListsActionType;

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
            const newTodoList: TodoListDomainType = {...action.todoList, filter: "all"}
            return [newTodoList, ...state]
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
        case 'SET-TODO_LISTS': {
            return action.todoLists.map(tl => ({
                ...tl,
                filter: 'all'
            }))

        }

        default:
            return state
    }
}

export const RemoveTodolistAC = (todoListId: string): RemoveTodoListActionType => {
    return {type: "REMOVE_TODOLIST", todoListId}
}

export const AddTodoListAC = (todoList: TodoListType): AddTodoListActionType => {
    return {type: "ADD_TODOLIST", todoList}
}

export const changeTodoListTitleAC = (todoListId: string, newTitle: string): changeTodoListTitleActionType => {
    return {type: "CHANGE_TODOLIST_TITLE", todoListId, newTitle}
}

export const changeTodoListFilterAC = (todoListId: string, filter: FilterValueType): changeTodoListFilterActionType => {
    return {type: "CHANGE_TODOLIST_FILTER", todoListId, filter}
}

export const setTodoLists = (todoLists: Array<TodoListType>): SetTodoListsActionType => {
    return {type: 'SET-TODO_LISTS', todoLists}
}

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const setTodoListsTC = (): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    todolistAPI.getTodoLists()
        .then((response) => {
            dispatch(setTodoLists(response.data))
        })
}


export const updateTodoListTitleTC = (todolistId: string, title: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        debugger
        todolistAPI.updateTodolist(todolistId, title)
            .then(() => {
                dispatch(changeTodoListTitleAC(todolistId, title))
            })
    }

export const createTodoListsTC = (title: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    todolistAPI.createTodoList(title)
        .then((response) => {
            dispatch(AddTodoListAC(response.data.data.item))
        })
}

export const deleteTodoListsTC = (todolistId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    todolistAPI.deleteTodoList(todolistId)
        .then((response) => {
            dispatch(RemoveTodolistAC(todolistId))
        })
}