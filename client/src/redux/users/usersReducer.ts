import {actionType, FOLLOW, SET_AVATAR, SET_FOLLOWING, UNFOLLOW} from "../types";
import {User} from "../../models/User";


export interface usersState {
    following: User[],
    avatarSrc: string,
}

const initialState: usersState = {
    following: [],
    avatarSrc: '',
}

export const usersReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case FOLLOW: return {
            ...state,
            following: [...state.following, action.payload],
        };
        case SET_FOLLOWING: return {
            ...state,
            following: action.payload,
        };
        case UNFOLLOW: return {
            ...state,
            following: state.following.filter(user => user.id !== action.payload),
        }
        case SET_AVATAR: return {
            ...state,
            avatarSrc: action.payload,
        }
        default: return state;
    }
}