import {TaskStateType, TaskType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType} from "./todoListReducer";

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
    | RemoveTodoListActionType;

export const taskReducer = (state: TaskStateType, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE_TASK": {
            const copyState = {...state}
            copyState[action.todoListId] = state[action.todoListId].filter(t => t.id !== action.taskId);
            return copyState;
        }
        case "ADD_TASK": {
            const copyState = {...state}
            let newTask: TaskType = {id: v1(), title: action.title, isDone: false}
            copyState[action.todoListId] = [newTask, ...state[action.todoListId]];
            return copyState;
        }
        case "CHANGE_TASK_STATUS": {
            const copyState = {...state}
            let task = copyState[action.todoListId].find(t => t.id === action.taskId);
            if (task) {
                task.isDone = action.isDone;
                return copyState;
            }
            return state;
        }
        case "CHANGE_TASK_TITLE": {
            const copyState = {...state}
            let task = copyState[action.todoListId].find(t => t.id === action.taskId);
            if (task) {
                task.title = action.title;
                return copyState;
            }
            return state;
        }
        case "ADD_TODOLIST":
            const copyState = {...state}
            copyState[action.id] = [];
            return  copyState;
        case "REMOVE_TODOLIST":{
            const copyState = {...state}
            delete copyState[action.todoListId];
            return copyState;
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