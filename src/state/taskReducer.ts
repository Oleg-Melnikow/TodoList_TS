import {TaskStateType} from "../App";
import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListsActionType} from "./todoListReducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/todolist-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";

export type removeTaskActionType = {
    type: "REMOVE_TASK",
    todoListId: string,
    taskId: string
}

export type addTaskActionType = {
    type: "ADD_TASK",
    task: TaskType
}

export type updateTaskActionType = {
    type: "UPDATE_TASK",
    todoListId: string,
    taskId: string,
    model: UpdateDomainTaskType
}


export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todoListId: string
}


type ActionsType =
    removeTaskActionType
    | addTaskActionType
    | updateTaskActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | SetTasksActionType;

const initialState: TaskStateType = {};

export const taskReducer = (state: TaskStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE_TASK": {
            const copyState = {...state}
            copyState[action.todoListId] = copyState[action.todoListId].filter(t => t.id !== action.taskId);
            return copyState;
        }
        case "ADD_TASK": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId];
            stateCopy[action.task.todoListId] = [action.task, ...tasks];
            return stateCopy;
        }
        case "UPDATE_TASK": {
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
        }
        case "ADD_TODOLIST": {
            const copyState = {...state}
            copyState[action.todoList.id] = [];
            return copyState;
        }
        case "REMOVE_TODOLIST": {
            const copyState = {...state}
            delete copyState[action.todoListId];
            return copyState;
        }
        case 'SET-TODO_LISTS': {
            const stateCopy = {...state}
            action.todoLists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (todoListId: string, taskId: string): removeTaskActionType => {
    return {type: "REMOVE_TASK", todoListId, taskId}
}

export const addTaskAC = (task: TaskType): addTaskActionType => {
    return {type: "ADD_TASK", task}
}

export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskType): updateTaskActionType => {
    return {type: "UPDATE_TASK", todoListId, taskId, model}
}

export const setTasksAC = (tasks: Array<TaskType>, todoListId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todoListId}
}

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const setTasksTC = (todolistId: string): ThunkType => {
    return (dispatch, getState: () => AppRootStateType) => {
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
            })
    }
}

export const deleteTasksTC = (todolistId: string, taskId: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        tasksAPI.deleteTask(todolistId, taskId)
            .then(response => {
                dispatch(removeTaskAC(todolistId, taskId))
            })
    }

export const addTaskTC = (todoListId: string, taskTitle: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        tasksAPI.createTask(todoListId, taskTitle)
            .then(response => {
                dispatch(addTaskAC(response.data.data.item))
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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskType, todolistId: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        debugger
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

            tasksAPI.updateTask(todolistId, taskId, apiModel).then(() => {
                dispatch(updateTaskAC(todolistId, taskId, apiModel))
            })
        }

    }