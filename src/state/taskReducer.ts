import {tasksAPI, TaskType, UpdateTaskType} from "../api/todolist-api";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {Dispatch} from "redux";
import {AddTodoListAC, RemoveTodolistAC, setTodoListsAC,} from "./todoListReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TaskStateType = {
    [key: string]: Array<TaskDomainType>
}

const initialState: TaskStateType = {};
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
            const task = state[action.payload.todoListId];
            const index = task.findIndex(t => t.id === action.payload.taskId);
            if (index !== -1) task.splice(index, 1);
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
        },
        updateTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateDomainTaskType }>) {
            debugger
            const task = state[action.payload.todoListId];
            const index = task.findIndex(t => t.id === action.payload.taskId);
            if (index !== -1) task[index] = {...task[index], ...action.payload.model}
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todoListId: string }>) {
            state[action.payload.todoListId] = action.payload.tasks.map((t: any) => ({...t, entityStatus: "idle"}))
        },
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) {
            state[action.payload.todoListId] = state[action.payload.todoListId].map(task => {
                if (task.id === action.payload.taskId) {
                    return {...task, entityStatus: action.payload.entityStatus}
                } else {
                    return task
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AddTodoListAC, (state, action) => {
            state[action.payload.todoList.id] = []
        })
        builder.addCase(RemoveTodolistAC, (state, action) => {
            delete state[action.payload.todoListId];
        })
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach((tl: any) => {
                state[tl.id] = []
            })
        })
    }
});

export const taskReducer = slice.reducer;
export const {setTasksAC, addTaskAC, removeTaskAC, updateTaskAC, changeTaskEntityStatusAC} = slice.actions;

export const setTasksTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}));
        tasksAPI.getTasks(todolistId)
            .then(response => {
                dispatch(setTasksAC({tasks: response.data.items, todoListId: todolistId}));
                dispatch(setAppStatusAC({status: "succeeded"}));
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const deleteTasksTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch) => {
        dispatch(changeTaskEntityStatusAC({todoListId: todolistId, taskId: taskId, entityStatus: "loading"}));
        dispatch(setAppStatusAC({status: "loading"}));
        tasksAPI.deleteTask(todolistId, taskId)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(removeTaskAC({todoListId: todolistId, taskId: taskId}));
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(response.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const addTaskTC = (todoListId: string, taskTitle: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}));
        tasksAPI.createTask(todoListId, taskTitle)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(addTaskAC({task: response.data.data.item}));
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(response.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}));
        const task = getState().tasks[todolistId].find(t => {
            return t.id === taskId
        })

        if (task) {
            const apiModel: UpdateTaskType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                ...domainModel
            }
            tasksAPI.updateTask(todolistId, taskId, apiModel)
                .then(response => {
                    if (response.data.resultCode === 0) {
                        dispatch(updateTaskAC({todoListId: todolistId, taskId: taskId, model: apiModel}));
                        dispatch(setAppStatusAC({status: "succeeded"}));
                    } else {
                        handleServerAppError(response.data, dispatch)
                    }
                })
                .catch(error => {
                    handleServerNetworkError(error, dispatch)
                })
        }
    }