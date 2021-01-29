import React, {useState} from "react";
import Modal from "../Modal";
import {follow, unfollow} from '../../redux/users/usersAction'
import {connect} from "react-redux";
import {AppState} from "../../redux/rootReducer";
import {User} from "../../models/User";

type MapStateToPropsType = {
    thisUser: User,
}

type MapDispatchToPropsType = {
    follow(toFollow: User, whoFollowing: number): any,
    unfollow(toUnfollow: User, whoFollowed: number): any,
}

type OwnProps = {
    user: User,
}

type UserListItemProps = MapStateToPropsType & OwnProps & MapDispatchToPropsType;


const UserListItem: React.FC<UserListItemProps> = (props) => {

    const [modal, setModal] = useState(false);

    const followHandler = () => {
        props.follow(props.user, props.thisUser.id!);
    }

    const unFollowHandler = () => {
        props.unfollow(props.user, props.thisUser.id!);
    }

    const changeModal = () => {
        setModal(!modal);
    }

    return (
        <li className="list-group-item" >
            <span onClick={changeModal} >{props.user.username}</span>

            <Modal id={`user-view-modal-${props.user.id}`} display={modal} close={changeModal}>
                {
                    props.user.following ?
                        <button className="btn btn-primary m-3" onClick={unFollowHandler}>
                            UnFollow
                        </button> :
                        <button className="btn btn-primary" onClick={followHandler}>
                            Follow
                        </button>
                }
                <button className="btn btn-info">View Page</button>
            </Modal>
        </li>
    )
}

const mapStateToProps = (state: AppState) => ({
    thisUser: state.auth.user,
})

const mapDispatchToProps = {
    follow,
    unfollow,
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(UserListItem);