import React from 'react';
import {IComment} from "../../models/Comment";
import {Post} from "../../models/Post";

type CommentViewProps = {
    comment: IComment,
    post?: Post,
}

const CommentView: React.FC<CommentViewProps> = (props) => {

    const comment = props.comment;
    return (

        <div className="p-2">
            <h3 className="pb-1">{comment.user!.username}</h3>
            <span >{comment.text}</span>
        </div>
    )
}

export default CommentView;