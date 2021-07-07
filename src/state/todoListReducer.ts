import {todolistAPI, TodoListType} from "../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodoListDomainType> = [];

export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValueType,
    entityStatus: RequestStatusType
}

const slice = createSlice({
    name: "todoLists",
    initialState,
    reducers: {
        RemoveTodolistAC(state, action: PayloadAction<{ todoListId: string }>) {
            state.filter(t => t.id !== action.payload.todoListId)
        },
        AddTodoListAC(state, action: PayloadAction<{ todoList: TodoListType }>) {
            state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ todoListId: string, newTitle: string }>) {
            state.map(tl => tl.id === action.payload.todoListId ? {...tl, title: action.payload.newTitle} : tl)
        },
        changeTodoListFilterAC(state, action: PayloadAction<{ todoListId: string, filter: FilterValueType }>) {
            state.map(tl => tl.id === action.payload.todoListId ? {...tl, filter: action.payload.filter} : tl)
        },
        setTodoListsAC(state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.entityStatus} : tl)
        }
    }
});

export const {
    AddTodoListAC,
    changeTodoListTitleAC,
    changeTodoListFilterAC,
    setTodoListsAC,
    RemoveTodolistAC,
    changeTodolistEntityStatusAC
} = slice.actions;

export type AddTodoListActionType = ReturnType<typeof AddTodoListAC>;
export type RemoveTodoListActionType = ReturnType<typeof RemoveTodolistAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>;

export const todoListReducer = slice.reducer;

export const setTodoListsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.getTodoLists()
        .then(response => {
            dispatch(setTodoListsAC({todoLists: response.data}));
            dispatch(setAppStatusAC({status: "succeeded"}));
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}


export const updateTodoListTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.updateTodolist(todolistId, title)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC({todoListId:todolistId, newTitle: title}));
                dispatch(setAppStatusAC({status: "succeeded"}));
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const createTodoListsTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.createTodoList(title)
        .then((response) => {
            if (response.data.resultCode === 0) {
                dispatch(AddTodoListAC({todoList: response.data.data.item}));
                dispatch(setAppStatusAC({status: "succeeded"}));
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const deleteTodoListsTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "loading"}))
    todolistAPI.deleteTodoList(todolistId)
        .then((response) => {
            if (response.data.resultCode === 0) {
                dispatch(RemoveTodolistAC({todoListId: todolistId}));
                dispatch(setAppStatusAC({status: "succeeded"}));
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}