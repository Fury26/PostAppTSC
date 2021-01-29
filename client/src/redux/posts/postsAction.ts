import {mainServer} from "../../config";
import {ADD_COMMENTS, ADD_FRIENDS_POST, SET_TOKENS, dispatchType} from "../types";
import {checkToken} from "../../checkToken";
import {tokens} from "../../models/Tokens";
import {IComment} from "../../models/Comment";


export const addFriendsPosts = (id: number, offset: number, count: number, jwt: tokens) => {
    return async (dispatch: dispatchType) => {
        try {
            const actualJwt = await checkToken(jwt);

            if(!actualJwt) {
                return;
            }

            const response = await fetch(`${mainServer}/post/get-posts/following`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${actualJwt.accessToken}`
                },
                body: JSON.stringify({
                    offset,
                    count,
                })
            })
            if(actualJwt.accessToken !== jwt.accessToken) {
                dispatch({type: SET_TOKENS,
                    payload: actualJwt});
            }
            if(!response) {
                alert('could`t load posts');
                return;
            }
            const json = await response.json();
            console.log('posts', json);
            dispatch({
                type: ADD_FRIENDS_POST,
                payload: json,
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}


export const loadComments = (post_id: number) => {
    return async (dispatch: dispatchType) => {
        try {
            const response = await fetch(`${mainServer}/post/${post_id}/comments`, {
                method: 'GET',
            });
            const json = await response.json()
            dispatch({
                type: ADD_COMMENTS,
                payload: json,
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}

export const sendComment = (comment: IComment, token: tokens) => {
    return async (dispatch: dispatchType) => {
        try{
            if(!comment.post) {
                return;
            }
            const response = await fetch(`${mainServer}/post/${comment.post.id}/comment`, {
                method: 'POST',
                headers: {Authorization: `Bearer ${token.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: comment.text,
                })
            });


            if(response.status !== 200) {
                return;
            }

            const com: IComment = {
                id: null,
                post: comment.post,
                postId: comment.post.id!,
                text: comment.text,
                user: comment.user,
                userId: comment.userId,

            }

            dispatch({
                type: ADD_COMMENTS,
                payload: [com]
            })


        } catch (e) {
            console.log(e.message);
        }
    }
}