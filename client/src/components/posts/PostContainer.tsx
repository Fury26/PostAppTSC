import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import {mainServer} from "../../config";
import {sendComment} from "../../redux/posts/postsAction";
import {checkToken} from "../../checkToken";
import {setTokens} from "../../redux/authorization/authorizationActions";
import {AppState} from "../../redux/rootReducer";
import PostView from "./PostView";
import CommentContainer from "./CommentContainer";
import {IComment} from "../../models/Comment";
import {tokens} from "../../models/Tokens";
import {User} from "../../models/User";
import {Post} from "../../models/Post";
type MapDispatchToPropsType = {
    sendComment(comment: IComment, tokens: tokens): any,
    setTokens(tokens: tokens): any,

}

type MapStateToPropsType = {
    tokens: tokens,
    user: User,
}

type OwnProps = {
    post: Post,
}

type StateType = {
    images: string[],
    imgIndex: number,
    comment: '',
}


type PostContainerProps = MapStateToPropsType & MapDispatchToPropsType & OwnProps;

const PostContainer: React.FC<PostContainerProps> = (props) => {
    const [state, setState] = useState<StateType>({
        images: [],
        imgIndex: 0,
        comment: '',
    });


    const sendComment = async (text: string) => {
        try {
            const actualJwt = await checkToken(props.tokens);
            if(!actualJwt ) {
                return;
            }

            props.sendComment({
                id: null,
                postId: props.post.id!,
                userId: props.user.id!,
                text,
                user: props.user,
                post: props.post
            }, actualJwt);
            props.setTokens(actualJwt);
            setState({
                ...state,
                comment: '',
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        console.log('post cont user', props.user);
        console.log('post cont post', props.post);
        if(state.images.length === 0) {
            getImages().then();
        }
    }, []);

    const getImages = async () => {
        try {
            for (const img of props.post.files!) {
                const response = await fetch(`${mainServer}/post/image/${props.post.userId}/${props.post.id}/${img}`, {
                    method: 'GET',
                });
                const data = await response.blob();
                const reader = new FileReader();
                reader.onload = () => {
                    if(typeof reader.result === "string") {
                        setState(prevState => ({
                            ...prevState,
                            images: [...prevState.images, reader.result!.toString()]
                        }))
                    }

                }
                reader.readAsDataURL(data);
            }

        }catch (e) {
            console.log(e.message);
        }
    }


    return (
        <div className="post" >
            {
                state.images.length ===  props.post.files!.length?
                <PostView post={props.post} images={state.images} sendComment={sendComment}/>
                : <h5>Loading Post</h5>
            }
            <div>
                <CommentContainer post={props.post}/>
            </div>

        </div>
    )
}

const mapStateToProps = (state: AppState) => ({
    user: state.auth.user,
    tokens: state.auth.tokens,
})

const mapDispatchToProps = {
    sendComment,
    setTokens,
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(PostContainer);