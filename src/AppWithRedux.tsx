import React from 'react';
import './App.css';
import {AppBar, Button, Container, Grid, IconButton, LinearProgress, Typography} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import {Menu} from "@material-ui/icons";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {RequestStatusType} from "./state/appReducer";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";
import {TodoListContainer} from "./TodolistContainer";
import {Redirect, Route, Switch } from 'react-router-dom';
import {Login} from "./features/Login";

export function AppWithRedux() {

    const status = useSelector<AppRootStateType, RequestStatusType>( state => state.app.status)

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
                    <Button color="inherit">Login</Button>
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