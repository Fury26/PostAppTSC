import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux'

import {AppState} from "./redux/rootReducer";
import {setAll, setTokens, setUser, setLogined} from "./redux/authorization/authorizationActions";
import {loadAvatar, setFollowing} from "./redux/users/usersAction";
import {checkToken} from "./checkToken";
import {mainServer, storageName} from "./config";
import {Routes} from "./components/Routes";
import {actionType} from "./redux/types";
import NavBar from "./components/NavBar";
import { BrowserRouter } from 'react-router-dom';
import {User} from "./models/User";
import {tokens} from "./models/Tokens";
import {a} from "./models/Types";


// type MapDispatchToPropsType = typeof mapDispatchToProps;

type MapDispatchToPropsType = {
    setUser(user: User): actionType,
    setFollowing(payload: User[]): actionType,
    loadAvatar(id: number): any,
    setTokens(payload: tokens): actionType,
    setAll(payload: any): actionType,
    setLogined(log: boolean): any,
}

type MapStateToPropsType = {
    logined: boolean,
    username: string | null,
    id: number | null,
    jwt: tokens,
}


type AppProps = MapStateToPropsType & MapDispatchToPropsType;

const App: React.FC<AppProps> = (props) => {
    const [ready, setReady] = useState(false);

    const getFollowing = async (tokens: tokens) => {
        try{

            const actualJwt = await checkToken(tokens);
            if(!actualJwt) {
                return;
            }

            const response = await fetch(`${mainServer}/user/following`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${actualJwt.accessToken}`,
                }
            });
            if(actualJwt.accessToken !== tokens.accessToken) {
                setTokens(actualJwt);
            }
            const json = await response.json();
            console.log('following', json);

            setFollowing(json);
        }catch (e) {
            console.log(e.message);
        }
    }

    const init = (userData: any) => {
        console.log('aaaa', userData);
        // setAll({
        //     user: userData.user,
        //     logined: true,
        //     tokens: userData.tokens,
        // });
        props.setUser({
            bio: userData.user.bio,
            id: userData.user.id,
            username: userData.user.username,
        })
        props.setLogined(true);
        props.setTokens(userData.tokens);
        console.log('after')
        getFollowing(userData.tokens).then();
        loadAvatar(userData.user.id);
    }

    useEffect(() => {
        console.log('app use effect');
        const userData = JSON.parse(localStorage.getItem(storageName)!);
        if(userData) {
            init(userData);
        }
        setReady(true);

    }, []);




    const routes = Routes({
        isAuthorized: props.logined,
        userId: props.id,
    });

    if(!ready) {
        return <h5>Loading</h5>
    }

    return (
        <>
            {props.logined ? <NavBar/> : null}
            <div className="container">
                <BrowserRouter>
                    {routes}
                </BrowserRouter>
            </div>
        </>
    );
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    logined: state.auth.logined,
    username: state.auth.user.username,
    id: state.auth.user.id,
    jwt: state.auth.tokens,
});

const mapDispatchToProps: MapDispatchToPropsType = {
    setUser,
    setFollowing,
    loadAvatar,
    setTokens,
    setAll,
    setLogined,

}

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppState>(mapStateToProps, mapDispatchToProps)(App);
