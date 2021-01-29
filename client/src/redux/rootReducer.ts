import {combineReducers} from 'redux'
import {authorizationReducer, authState} from "./authorization/authorizationReducer";
import {usersReducer, usersState} from "./users/usersReducer";
import {postsReducer, postsState} from "./posts/postsReducer";

export interface AppState {
    auth: authState,
    users: usersState,
    posts: postsState,
}

export const rootReducer = combineReducers({
    auth: authorizationReducer,
    users: usersReducer,
    posts: postsReducer,
});
