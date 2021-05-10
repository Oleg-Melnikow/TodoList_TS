import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListsActionType} from "./todoListReducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

export type removeTaskActionType = {
    type: "REMOVE_TASK",
    todoListId: string,
    taskId: string
}

export type addTaskActionType = {
    type: "ADD_TASK",
    todoListId: string,
    title: string
}

export type changeTaskStatusActionType = {
    type: "CHANGE_TASK_STATUS",
    todoListId: string,
    taskId: string,
    isDone: boolean
}

export type changeTaskTitleActionType = {
    type: "CHANGE_TASK_TITLE",
    todoListId: string,
    taskId: string,
    title: string
}

type ActionsType =
    removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType;

const initialState: TaskStateType = {};

export const taskReducer = (state: TaskStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE_TASK": {
            debugger
            const copyState = {...state}
            copyState[action.todoListId] = copyState[action.todoListId].filter(t => t.id !== action.taskId);
            return copyState;
        }
        case "ADD_TASK": {
            let newTask: TaskType = {
                id: v1(),
                title: action.title,
                completed: true,
                status: TaskStatuses.New,
                todoListId: action.todoListId, description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            }
            return {...state, [action.todoListId]: [newTask, ...state[action.todoListId]]};
        }
        case "CHANGE_TASK_STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => {
                    if (task.id === action.taskId) {
                        return {...task, completed: action.isDone}
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

        default:
            return state
    }
}

export const removeTaskAC = (todoListId: string, taskId: string): removeTaskActionType => {
    return {type: "REMOVE_TASK", todoListId, taskId}
}

export const addTaskAC = (todoListId: string, title: string): addTaskActionType => {
    return {type: "ADD_TASK", todoListId, title}
}

export const changeTaskStatusAC = (todoListId: string, taskId: string, isDone: boolean): changeTaskStatusActionType => {
    return {type: "CHANGE_TASK_STATUS", todoListId, taskId, isDone}
}

export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string): changeTaskTitleActionType => {
    return {type: "CHANGE_TASK_TITLE", todoListId, taskId, title}
}