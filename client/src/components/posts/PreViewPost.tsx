import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import {mainServer} from "../../config";
import {AppState} from "../../redux/rootReducer";
import PostContainer from "./PostContainer";
import {Post} from "../../models/Post";

type MapStateToPropsType = {
    id?: number,
}

type OwnProps = {
    post: Post,
}

type FriendsPostsProps = MapStateToPropsType & OwnProps;


type StateType = {
    images: string[],
    imgIndex: number,
}

//TODO:
//Pre View first image of the post
// Not all images
const PreViewPost: React.FC<FriendsPostsProps> = (props) => {
    const [state, setState] = useState<StateType>({
        images: [],
        imgIndex: 0,
    });

    useEffect(() => {
        if (state.images.length === 0) {
            getImages().then();
        }
    }, []);


    const getImages = async () => {
        try {
            let count = 0;
            let arr: string[] = [];
            for (const img of [1, 2]) {
                const response = await fetch(`${mainServer}/post/image/8/18/post-image-0_Lec.jpg`, {
                    method: 'GET',
                });
                const data = await response.blob();
                const reader = new FileReader();
                reader.onload = () => {
                    if(typeof reader.result === "string") {
                        arr.push(reader.result!);
                    }
                    count++;
                    if (count === 2) {
                        setState({
                            images: arr,
                            imgIndex: 0,
                        })
                    }
                }
                reader.readAsDataURL(data);
            }

        } catch (e) {
            console.log(e.message);
        }
    }



    return (
        <div style={{outline: 'none', border: '0px', backgroundColor: 'transparent'}} data-bs-toggle="modal" data-bs-target="#exampleModal">
            <div className="card m-auto" style={{width: '18rem'}}>
                <img src={state.images[state.imgIndex]} className="card-img-top" alt="error" />
                <div className="modal fade"  id="exampleModal"  tabIndex={-1} aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{props.post.user!.username}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                            <div className="modal-body w-100">
                                <PostContainer key={props.post.id} post={props.post}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    id: state.auth.user.id!,
})



export default connect<MapStateToPropsType, null, OwnProps, AppState>(mapStateToProps, null)(PreViewPost);