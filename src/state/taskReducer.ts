import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListsActionType} from "./todoListReducer";
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, todolistAPI} from "../api/todolist-api";
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

export type changeTaskStatusActionType = {
    type: "CHANGE_TASK_STATUS",
    todoListId: string,
    taskId: string,
    status: TaskStatuses
}

export type changeTaskTitleActionType = {
    type: "CHANGE_TASK_TITLE",
    todoListId: string,
    taskId: string,
    title: string
}

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todoListId: string
}


type ActionsType =
    removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
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
        case "CHANGE_TASK_STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => {
                    if (task.id === action.taskId) {
                        return {...task, status: action.status}
                    } else {
                        return task
                    }
                })
            }
        }
        case "CHANGE_TASK_TITLE": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id === action.taskId
                        ? {...task, title: action.title}
                        : task)
            }

        }
        case "ADD_TODOLIST": {
            const copyState = {...state}
            copyState[action.todoListId] = [];
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

export const changeTaskStatusAC = (todoListId: string, taskId: string, status: TaskStatuses): changeTaskStatusActionType => {
    return {type: "CHANGE_TASK_STATUS", todoListId, taskId, status}
}

export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string): changeTaskTitleActionType => {
    return {type: "CHANGE_TASK_TITLE", todoListId, taskId, title}
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

export const deleteTasksTC = (todolistId: string, taskId: string) : ThunkType =>
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

export const updateTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string ): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        debugger
        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        if (task) {
            tasksAPI.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            }).then(() => {
                const action = changeTaskStatusAC(todolistId, taskId, status)
                dispatch(action)
            })
        }

    }
