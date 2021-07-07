import { setAppErrorAC, setAppErrorActionType, setAppStatusAC, setAppStatusActionType } from '../state/appReducer';
import { Dispatch } from 'redux';
import {ResponseType} from "../api/todolist-api";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC( {error: error.message ? error.message : 'Some error occurred'}));
    dispatch(setAppStatusAC({status: 'failed'}));
}

type ErrorUtilsDispatchType = Dispatch<setAppErrorActionType | setAppStatusActionType>