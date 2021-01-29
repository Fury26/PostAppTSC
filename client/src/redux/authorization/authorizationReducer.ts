import {
    actionType,
    SET_ALL_AUTH,
    SET_ID,
    SET_LOGINED,
    SET_REGISTER,
    SET_TOKENS,
    SET_USER,
    SET_USERNAME
} from "../types";
import {User} from "../../models/User";
import { tokens } from "../../models/Tokens";

export interface authState {
    user: User,
    tokens: tokens,
    logined: boolean,
    register: boolean,
}


const initialState: authState = {
    user: {
        username: '',
        bio: '',
        id: null,
    },
    tokens: {
        accessToken: null,
        refreshToken: null,
    },
    logined: false,
    register: true,

};

export const authorizationReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case SET_ID: return {
            ...state,
            user: {
                ...state.user,
                id: action.payload
            },
        };
        case SET_USERNAME: return {
            ...state,
            user: {
                ...state.user,
                username: action.payload
            },
        };
        case SET_USER: return {
            ...state,
            user: {
                ...state.user,
                ...action.payload,
            },
        };
        case SET_TOKENS: return {
            ...state,
            tokens: {
                ...action.payload,
            }
        }
        case SET_LOGINED: return {
            ...state,
            logined: action.payload,
        };
        case SET_REGISTER: return {
            ...state,
            register: action.payload,
        };
        case SET_ALL_AUTH: return {
            ...state,
            ...action.payload,
        }
        default: return state;
    }
}

