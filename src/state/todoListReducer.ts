import {todolistAPI, TodoListType} from "../api/todolist-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {
    RequestStatusType,
    setAppErrorAC,
    setAppErrorActionType,
    setAppStatusAC,
    setAppStatusActionType
} from "./appReducer";

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

export type changeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;

type ActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | SetTodoListsActionType
    | setAppStatusActionType
    | setAppErrorActionType
    | changeTodolistEntityStatusActionType;

const initialState: Array<TodoListDomainType> = [];

export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValueType,
    entityStatus: RequestStatusType
}

export const todoListReducer = (state: Array<TodoListDomainType> = initialState, action: ActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE_TODOLIST":
            return state.filter(t => t.id !== action.todoListId)
        case "ADD_TODOLIST":
            const newTodoList: TodoListDomainType = {...action.todoList, filter: "all", entityStatus: "idle"}
            return [newTodoList, ...state]
        case "CHANGE_TODOLIST_TITLE":
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        case "CHANGE_TODOLIST_FILTER":
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        case 'SET-TODO_LISTS':
            return action.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        case "CHANGE-TODOLISTS_ENTITY_STATUS":
            debugger
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
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

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>({
    type: "CHANGE-TODOLISTS_ENTITY_STATUS",
    id,
    entityStatus
} as const)

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
            if (response.data.resultCode === 0) {
                dispatch(AddTodoListAC(response.data.data.item));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                if (response.data.messages.length) {
                    dispatch(setAppErrorAC(response.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
}

export const deleteTodoListsTC = (todolistId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"));
    debugger
    dispatch(changeTodolistEntityStatusAC(todolistId,"loading"))
    todolistAPI.deleteTodoList(todolistId)
        .then((response) => {
            dispatch(RemoveTodolistAC(todolistId));
            dispatch(setAppStatusAC("succeeded"));
        })
}