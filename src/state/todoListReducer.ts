import {todolistAPI, TodoListType} from "../api/todolist-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {setAppStatusAC, setAppStatusActionType} from "./appReducer";

export type RemoveTodoListActionType = {
    type: "REMOVE_TODOLIST",
    todoListId: string
}

export type AddTodoListActionType = {
    type: "ADD_TODOLIST",
    todoList: TodoListType
}

export type SetTodoListsActionType = {
    type: 'SET-TODO_LISTS'
    todoLists: Array<TodoListType>
}

type ActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | SetTodoListsActionType
    | setAppStatusActionType;

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
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        case "CHANGE_TODOLIST_FILTER":
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        case 'SET-TODO_LISTS':
            return action.todoLists.map(tl => ({...tl, filter: 'all'}))
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

export const changeTodoListTitleAC = (todoListId: string, newTitle: string) => ({
    type: "CHANGE_TODOLIST_TITLE", todoListId, newTitle
} as const)

export const changeTodoListFilterAC = (todoListId: string, filter: FilterValueType) => ({
    type: "CHANGE_TODOLIST_FILTER", todoListId, filter
} as const)

export const setTodoLists = (todoLists: Array<TodoListType>): SetTodoListsActionType => {
    return {type: 'SET-TODO_LISTS', todoLists}
}

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const setTodoListsTC = (): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"));
    todolistAPI.getTodoLists()
        .then((response) => {
            dispatch(setTodoLists(response.data));
            dispatch(setAppStatusAC("succeeded"));
        })
}


export const updateTodoListTitleTC = (todolistId: string, title: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"));
    todolistAPI.updateTodolist(todolistId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(todolistId, title));
            dispatch(setAppStatusAC("succeeded"));
        })
}

export const createTodoListsTC = (title: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"));
    todolistAPI.createTodoList(title)
        .then((response) => {
            dispatch(AddTodoListAC(response.data.data.item));
            dispatch(setAppStatusAC("succeeded"));
        })
}

export const deleteTodoListsTC = (todolistId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"));
    todolistAPI.deleteTodoList(todolistId)
        .then((response) => {
            dispatch(RemoveTodolistAC(todolistId));
            dispatch(setAppStatusAC("succeeded"));
        })
}