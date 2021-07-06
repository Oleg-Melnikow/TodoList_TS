import {combineReducers} from 'redux';
import {todoListReducer} from './todoListReducer';
import {taskReducer} from './taskReducer';
import thunkMiddleware from "redux-thunk";
import {appReducer} from './appReducer';
import {authReducer} from "./authReducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListReducer,
    app: appReducer,
    auth: authReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
});

export type AppRootStateType = ReturnType<typeof rootReducer>;