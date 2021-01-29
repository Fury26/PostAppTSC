import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from "./authorization/Login";
import Register from "./authorization/Register";
import FriendsPosts from "./posts/FriendsPosts";
import Friends from "./friends/Friends";
import UserPage from "./user/UserPage";
import Account from './user/Account';
import CreatePostForm from "./posts/CreatePostForm";



export const Routes: React.FC<{ isAuthorized: boolean, userId: number | null }> = ({isAuthorized, userId}) => {
    if(!isAuthorized) {
        return (
            <>
                <Switch>
                    <Route path="/auth/login">
                        <Login />
                    </Route>
                    <Route path="/auth/register">
                        <Register />
                    </Route>
                    <Redirect to={'/auth/login'} />
                </Switch>
            </>

        );
    } else {
        //socket.emit('login', userId);
        return (
            <>
                <Switch>
                    <Route path="/posts">
                        <FriendsPosts />
                    </Route>
                    <Route path="/friends">
                        <Friends />
                    </Route>
                    <Route path="/create">
                        <CreatePostForm />
                    </Route>
                    {/*<Route path="/test">*/}
                    {/*    <PreViewPost />*/}
                    {/*</Route>*/}
                    <Route path="/page/:id" exact>
                        <UserPage />
                    </Route>
                    <Route path="/account">
                        <Account />
                    </Route>
                    <Redirect to="/posts" />
                </Switch>
            </>
        );
    }
}

