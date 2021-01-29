import React, {useEffect} from "react";
import {connect} from "react-redux";
import {addFriendsPosts} from "../../redux/posts/postsAction";
import {AppState} from "../../redux/rootReducer";
import PreViewPost from "./PreViewPost";
import {tokens} from "../../models/Tokens";
import {Post} from "../../models/Post";

type MapDispatchToPropsType = {
    addFriendsPosts(id: number, offset: number, count: number, jwt: tokens): any,
}

type MapStateToPropsType = {
    id: number,
    posts: Post[],
    isLoaded: boolean,
    jwt: tokens,
}


type FriendsPostsProps = MapStateToPropsType & MapDispatchToPropsType;


const FriendsPosts: React.FC<FriendsPostsProps> = (props): JSX.Element => {

    const loadPosts = (id: number, offset: number, count: number) => {
        try {
            props.addFriendsPosts(id, offset, count, props.jwt);
        }catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        if(props.posts.length === 0 && !props.isLoaded) {
            loadPosts(props.id, 0, 30);
        }
    }, []);


    return (
        <div className="posts-grid">
            {props.posts.map(post => {
                return <PreViewPost key={post.id} post={post}/>
            })}
        </div>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    id: state.auth.user.id!,
    posts: state.posts.friendsPosts,
    isLoaded: state.posts.isFriendsPostsLoaded,
    jwt: state.auth.tokens,

})

const mapDispatchToProps: MapDispatchToPropsType = {
    addFriendsPosts,
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppState>(mapStateToProps, mapDispatchToProps)(FriendsPosts);