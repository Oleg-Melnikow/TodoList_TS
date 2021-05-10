import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {combineReducers, createStore} from "redux";
import {v1} from "uuid";
import {taskReducer} from "../../state/taskReducer";
import {todoListReducer} from '../../state/todoListReducer';
import {TaskStatuses} from "../../api/todolist-api";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListReducer
})

const initialGlobalState = {
    todoLists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", order: 0}
    ],
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", completed: false, order: 1, addedDate: "",
                todoListId: "todolistId1", status: TaskStatuses.Completed, startDate: "", priority: 1, deadline: "", description: ""},
            {id: v1(), title: "JS", completed: false, order: TaskStatuses.InProgress, addedDate: "",
                todoListId: "todolistId1", status: 1, startDate: "", priority: 1, deadline: "", description: ""}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Book", completed: false, order: 1, addedDate: "",
                todoListId: "todolistId2", status: TaskStatuses.InProgress, startDate: "", priority: 1, deadline: "", description: ""},
            {id: v1(), title: "Journal", completed: false, order: 1, addedDate: "",
                todoListId: "todolistId2", status: TaskStatuses.New, startDate: "", priority: 1, deadline: "", description: ""}
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)