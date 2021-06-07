import {setAppStatusAC, setAppStatusActionType} from "./appReducer";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";


const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const loginTC = (data: LoginParamsType): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    authAPI.login(data)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(setAppStatusAC("succeeded"));
                dispatch(setIsLoggedInAC(true));
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

type ActionsType = ReturnType<typeof setIsLoggedInAC> | setAppStatusActionType