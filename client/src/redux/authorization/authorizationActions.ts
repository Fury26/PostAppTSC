import {
    dispatchType,
    SET_ALL_AUTH,
    SET_ID,
    SET_LOGINED,
    SET_REGISTER,
    SET_TOKENS,
    SET_USER,
    SET_USERNAME
} from "../types";
import {authServer, mainServer, storageName} from "../../config";
import {User} from "../../models/User";
import {tokens} from "../../models/Tokens";


export const setUsername = (username: string) => ({
    type: SET_USERNAME,
    payload: username,
})

export const setId = (id: number) => ({
    type: SET_ID,
    payload: id,
})

export const setUser = (user: User) => ({
    type: SET_USER,
    payload: user,
})

export const setLogined = (payload: boolean) => ({
    type: SET_LOGINED,
    payload,
})

export const setTokens = (payload: tokens) => ({
    type: SET_TOKENS,
    payload,
})

export const setAll = (payload: any) => ({
    type: SET_ALL_AUTH,
    payload,
});


export const login = (user: User) => {
    try {
        return async (dispatch: dispatchType) => {

            const response = await fetch(`${authServer}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if(response.status !== 200) {
                throw new Error('Bad Request');
            }

            const json = await response.json();
            dispatch({
                type: SET_USER,
                payload: json.user,
            });
            dispatch({
                type: SET_LOGINED,
                payload: true,
            });
            dispatch(setTokens(json.tokens));
            localStorage.setItem(storageName, JSON.stringify({
                user: {
                    ...json.user,
                },
                tokens: {
                    ...json.tokens,
                }

            }));

            return user;

        }
    } catch (e) {
        console.log(e.message);
        return e;
    }
}
export const register = (user: User) => {
    try {
        return async (dispatch: dispatchType) => {
            const response = await fetch(`${authServer}/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user),
            });
            if (response.status !== 200) {
                throw new Error('Bad request');
            }
            dispatch({
                type: SET_REGISTER,
                payload: false,
            });

            return user;
        }
    } catch (e) {
        console.log(e.message);
        return e;
    }
}

export const updateUser = (user: User) => {
    return async (dispatch: dispatchType) => {
        const response = await fetch(`${mainServer}/user/${user.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user),
        });
        if(response.status === 200) {
            dispatch(setUser(user));
        }
    }
}