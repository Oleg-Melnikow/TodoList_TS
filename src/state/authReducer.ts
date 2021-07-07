import {setAppStatusAC} from "./appReducer";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions

type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>

export const loginTC = (data: LoginParamsType): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    authAPI.login(data)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}));
                dispatch(setIsLoggedInAC({value: true}));
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const logoutTC = (): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })
}