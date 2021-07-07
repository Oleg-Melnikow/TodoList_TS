import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodoListsActionType
} from "./todoListReducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/todolist-api";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {Dispatch} from "redux";

export type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatusAC>;

export type TaskStateType = {
    [key: string]: Array<TaskDomainType>
}

const initialState: TaskStateType = {};
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export const taskReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case "REMOVE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case "ADD_TASK":
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]
            }
        case "UPDATE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => {
                    if (task.id === action.taskId) {
                        return {...task, ...action.model}
                    } else {
                        return task
                    }
                })
            }
        case "ADD_TODOLIST":
            return {
                ...state,
                [action.todoList.id]: []
            }
        case "REMOVE_TODOLIST": {
            const copyState = {...state}
            delete copyState[action.todoListId];
            return copyState;
        }
        case 'SET-TODO_LISTS':
            const stateCopy = {...state}
            action.todoLists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'SET-TASKS':
            return {
                ...state,
                [action.todoListId]: action.tasks.map(t => ({...t, entityStatus: "idle"}))
            }
        case "CHANGE-TASK_ENTITY_STATUS":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => {
                    if (task.id === action.taskId) {
                        return {...task, entityStatus: action.entityStatus}
                    } else {
                        return task
                    }
                })
            }
        default:
            return state
    }
}

export const removeTaskAC = (todoListId: string, taskId: string) => ({type: "REMOVE_TASK", todoListId, taskId} as const)
export const addTaskAC = (task: TaskType) => ({type: "ADD_TASK", task} as const)
export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskType) => ({
    type: "UPDATE_TASK", todoListId, taskId, model
} as const)
export const setTasksAC = (tasks: Array<TaskType>, todoListId: string) => ({
    type: 'SET-TASKS', tasks, todoListId
} as const)

export const changeTaskEntityStatusAC = (todoListId: string, taskId: string, entityStatus: RequestStatusType) => ({
    type: "CHANGE-TASK_ENTITY_STATUS",
    todoListId,
    taskId,
    entityStatus
} as const)

export const setTasksTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}));
        tasksAPI.getTasks(todolistId)
            .then(response => {
                dispatch(setTasksAC(response.data.items, todolistId));
                dispatch(setAppStatusAC({status: "succeeded"}));
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const deleteTasksTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch) => {
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"));
        dispatch(setAppStatusAC({status: "loading"}));
        tasksAPI.deleteTask(todolistId, taskId)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(removeTaskAC(todolistId, taskId));
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
                    dispatch(addTaskAC(response.data.data.item));
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
                        dispatch(updateTaskAC(todolistId, taskId, apiModel));
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