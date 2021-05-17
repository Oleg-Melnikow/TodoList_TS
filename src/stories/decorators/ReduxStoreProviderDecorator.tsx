import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {combineReducers, createStore} from "redux";
import {v1} from "uuid";
import {taskReducer} from "../../state/taskReducer";
import {todoListReducer} from '../../state/todoListReducer';
import {TaskStatuses} from "../../api/todolist-api";
import {appReducer} from "../../state/appReducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todoLists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: "idle"}
    ],
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", order: 1, addedDate: "",
                todoListId: "todolistId1", status: TaskStatuses.Completed, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"},
            {id: v1(), title: "JS", order: TaskStatuses.InProgress, addedDate: "",
                todoListId: "todolistId1", status: 1, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Book", order: 1, addedDate: "",
                todoListId: "todolistId2", status: TaskStatuses.InProgress, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"},
            {id: v1(), title: "Journal", order: 1, addedDate: "",
                todoListId: "todolistId2", status: TaskStatuses.New, startDate: "", priority: 1, deadline: "", description: "", entityStatus: "idle"}
        ]
    },
    app: {
        status: "idle",
        error: null
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)