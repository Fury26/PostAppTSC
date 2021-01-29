import React, {useState, useEffect} from 'react';
import {connect} from "react-redux";
import {loadComments} from "../../redux/posts/postsAction";
import {AppState} from "../../redux/rootReducer";
import CommentView from "./CommentView";
import {IComment} from "../../models/Comment";
import {Post} from "../../models/Post";


type MapStateToPropsType = {
    comments: IComment[],
}

type MapDispatchToPropsType = {
    loadComments(postId: number): any,
}

type OwnProps = {
    post: Post,
}

type CommentContainerProps = MapStateToPropsType & MapDispatchToPropsType & OwnProps;


//loading post comments
const CommentContainer: React.FC<CommentContainerProps> = (props) => {

    const [ready, setReady] = useState(false);


    useEffect(() => {
        loadComments().then(() => setReady(true));
    }, []);

    const loadComments = async () => {
        try {
            props.loadComments(props.post.id!);
        } catch (e) {
            console.log(e.message);
        }
    }

    const renderComments = () => {
        return props.comments.map((comment, ind) => {
            if(comment.postId === props.post.id) {
                return <CommentView key={ind} comment={comment} post={props.post}/>
            }
        })
    }

    return (
        <div>
            {
                ready ? renderComments() :
                    <h5>No comments</h5>
            }
        </div>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    comments: state.posts.comments,
})

const mapDispatchToProps: MapDispatchToPropsType = {
    loadComments,
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppState>(mapStateToProps, mapDispatchToProps)(CommentContainer);