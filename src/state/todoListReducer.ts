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
            const index = state.findIndex(t => t.id === action.payload.todoListId);
            if(index !== -1) state.splice(index, 1);
        },
        AddTodoListAC(state, action: PayloadAction<{ todoList: TodoListType }>) {
            state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ todoListId: string, newTitle: string }>) {
            const index = state.findIndex(t => t.id === action.payload.todoListId);
            state[index].title = action.payload.newTitle;
        },
        changeTodoListFilterAC(state, action: PayloadAction<{ todoListId: string, filter: FilterValueType }>) {
            const index = state.findIndex(t => t.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        setTodoListsAC(state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(t => t.id === action.payload.id);
            state[index].entityStatus = action.payload.entityStatus;
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