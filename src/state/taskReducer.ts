import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListsActionType} from "./todoListReducer";
import {tasksAPI, TaskType, UpdateTaskType} from "../api/todolist-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {TaskStateType} from "../AppWithRedux";
import {setAppErrorAC, setAppErrorActionType, setAppStatusAC, setAppStatusActionType} from "./appReducer";

type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | ReturnType<typeof setTasksAC>
    | setAppStatusActionType
    | setAppErrorActionType;

const initialState: TaskStateType = {};

export const taskReducer = (state: TaskStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case "ADD_TASK":
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
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
                [action.todoListId]: action.tasks
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

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const setTasksTC = (todolistId: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC("loading"));
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId));
                dispatch(setAppStatusAC("succeeded"));
            })
    }

export const deleteTasksTC = (todolistId: string, taskId: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC("loading"));
        tasksAPI.deleteTask(todolistId, taskId)
            .then(response => {
                dispatch(removeTaskAC(todolistId, taskId));
                dispatch(setAppStatusAC("succeeded"));
            })
    }

export const addTaskTC = (todoListId: string, taskTitle: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC("loading"));
        tasksAPI.createTask(todoListId, taskTitle)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(addTaskAC(response.data.data.item));
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
        dispatch(setAppStatusAC("loading"));
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
                dispatch(updateTaskAC(todolistId, taskId, apiModel));
                dispatch(setAppStatusAC("succeeded"));
            })
        }

    }