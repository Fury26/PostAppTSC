import {FOLLOW, SET_AVATAR, SET_FOLLOWING, UNFOLLOW, dispatchType} from "../types";
import {mainServer} from "../../config";
import {User} from "../../models/User";


export const follow = (userToFollow: User, userId: number) => {
    return async (dispatch:  dispatchType) => {
        try {
            const response = await fetch(`${mainServer}/user/follow`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: userToFollow.id,
                    follower: userId,
                }),
            });
            if(!response) {
                alert('Could not follow');
                return;
            }
            dispatch({
                type: FOLLOW,
                payload: userToFollow,
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}



export const unfollow = (userToUnfollow: User, userId: number) => {
    return async (dispatch: dispatchType) => {
        try {
            const response = await fetch(`${mainServer}/user/unfollow`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: userToUnfollow.id,
                    follower: userId,
                }),
            });
            if(!response) {
                alert('Could not unfollow');
                return;
            }
            dispatch({
                type: UNFOLLOW,
                payload: userToUnfollow.id,
            })
        } catch (e) {
            console.log(e.message);
        }
    }
}

export const loadAvatar = (id: number) => {
    return async (dispatch: dispatchType) => {
        try {
            const response = await fetch(`${mainServer}/user/avatar/${id}`, {
                method: 'GET',
            });
            if(!response) {
                alert('Could not unfollow');
                return;
            }

            const blob = await response.blob();

            const reader = new FileReader();


            reader.onload = () => {
                dispatch(setAvatar(reader.result!));
            };
            reader.readAsDataURL(blob);


        } catch (e) {
            console.log(e.message);
        }
    }
}



export const setFollowing = (payload: User[]) => ({
    type: SET_FOLLOWING,
    payload,
})


export const setAvatar = (payload: string | ArrayBuffer) => ({
    type: SET_AVATAR,
    payload,
})

