import React, {useEffect} from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {initializeAppTC, RequestStatusType} from "./state/appReducer";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";
import {TodoListContainer} from "./TodolistContainer";
import {Redirect, Route, Switch } from 'react-router-dom';
import {Login} from "./features/Login";
import CircularProgress from '@material-ui/core/CircularProgress';
import {logoutTC} from "./state/authReducer";

export function AppWithRedux() {

    const status = useSelector<AppRootStateType, RequestStatusType>( state => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>( state => state.app.isInitialized);
    const isLoggedIn = useSelector<AppRootStateType, boolean>( state => state.auth.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAppTC());
    }, []);

    let logout = () => {
        dispatch(logoutTC());
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logout}>Log out</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Switch>
                    <Route exact path={'/'} render={() => <TodoListContainer/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={"*"} to={"/404"}/>
                </Switch>
            </Container>
        </div>
    );
}