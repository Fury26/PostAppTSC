import React, { useState, useRef} from "react";
import {GrFormNext, GrFormPrevious} from 'react-icons/gr';

import {Post} from "../../models/Post";



type PostViewProps = {
    post: Post,
    images: string[],
    sendComment(text: string): any,
}


const PostView: React.FC<PostViewProps> = (props) => {

    const [text, setText] = useState('');
    const [imgIndex, setIndex] = useState(0);

    const commentInput = useRef<HTMLInputElement>(null)!;


    const sendComment = async (event: React.KeyboardEvent) => {
        if(event.key === "Enter") {
            props.sendComment(text);
            setText('');
        }
    }

    const convertToTime = (str: string) => {
        const date = new Date(str);
        return date.toLocaleString('gb', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }


    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    const nextImage = () => {
        if(imgIndex >= props.images.length - 1) {
            return;
        }

        setIndex(imgIndex + 1);

    }

    const prevImage = () => {
        if(imgIndex <= 0) {
            return;
        }

        setIndex(imgIndex - 1);

    }

    console.log('images length', props.images.length)
    return (
        <>
            <div className="d-flex post-view-images my-auto">
                {
                    (props.images.length > 1 && imgIndex !== 0) ?
                        <div className="my-auto post-view-arrows" style={{left: '0px'}} onClick={prevImage}>
                            <GrFormPrevious size='2rem'/>
                        </div> : null
                }
                <div><img  src={props.images[imgIndex]} className="post-view-image" alt="post" /></div>
                {
                    (props.post.folder.length > 1 && imgIndex !== props.images.length - 1) ?
                        <div className="my-auto  post-view-arrows" style={{right: '0px'}} onClick={nextImage}>
                            <GrFormNext size='2rem'/>
                        </div> : null
                }
            </div>
            <div className="card-body">
                <h5 className="card-title">Post #{props.post.id}</h5>
                <p className="card-text">{props.post.text}</p>
                <span className="card-footer" >{convertToTime(props.post.datetime!)}</span>
            </div>
            <div className="mb-3 px-2">
                <input
                    className="form-control"
                    type="text"
                    value={text}
                    placeholder="Write your comment"
                    name="comment"
                    ref={commentInput}
                    onKeyPress={sendComment}
                    onChange={inputHandler}
                />
            </div>
        </>
    )
}

export default PostView;