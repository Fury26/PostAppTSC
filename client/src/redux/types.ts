export interface actionType {
    type: string,
    payload?: any,
};
export type dispatchType = (arg: actionType) => void;

export const SET_USERNAME = 'AUTH/SET_USERNAME';
export const SET_ID = 'AUTH/SET_ID';
export const SET_USER = 'AUTH/SET_USER';
export const SET_LOGINED = 'AUTH/LOGINED';
export const SET_REGISTER = 'AUTH/REGISTER';
export const SET_TOKENS = 'AUTH/SET_TOKENS';
export const SET_ALL_AUTH = 'AUTH/SET_ALL';
export const FOLLOW = 'USERS/FOLLOW';
export const UNFOLLOW = 'USERS/UNFOLLOW';
export const SET_AVATAR = 'USERS/SET_AVATAR';
export const SET_FOLLOWING = 'USERS/SET_FOLLOWING';
export const SET_FRIENDS_POST = 'POSTS/SET_FRIENDS_POST';
export const ADD_FRIENDS_POST = 'POSTS/ADD_FRIENDS_POST';
export const ADD_COMMENTS = 'POSTS/ADD_COMMENTS';
