import React, {useState} from "react";

import {mainServer} from "../../config";
import {connect} from "react-redux";
// import {User} from "../../models/Interfaces";
import {AppState} from "../../redux/rootReducer";
import UserList from "./UserList";
import {User} from "../../models/User";


type MapStateToPropsType = {
    following?: User[],
}

type FriendsProps = MapStateToPropsType;

const Friends: React.FC<FriendsProps> = (props) => {

    const [state, setState] = useState({
        username: '',
    });

    const [searchUsers, setSearchUsers] = useState<User[]>([]);

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const getUsers = async (username: string) => {
        try {
            if(username.length === 0) {
                setSearchUsers([]);
                return;
            }
            const response = await fetch(`${mainServer}/user/username=${username}`, {
                method: 'GET',
            });

            const json = await response.json();
            setSearchUsers(json);

        }catch (e) {
            console.log(e.message);
        }
    }

    const searchUsersHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        inputHandler(event);
        getUsers(event.target.value).then();
    }

    return (
        <div className="friends-page d-flex justify-content-around pt-3">
            <UserList users={props.following!.map(i => ({...i, following: true}))}/>
            <div className="search-friends">
                <div className="mb-3">
                    <label htmlFor="inputUsername" className="form-label">Search users</label>
                    <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        id="inputUsername"
                        name="username"
                        style={{'overflowY': 'hidden'}}
                        value={state.username}
                        onChange={searchUsersHandler}/>
                </div>
                <UserList users={searchUsers.map(user => {
                    if(props.following!.find(item => item.id === user.id)) return {...user, following: true};
                    else return {...user, following: false};
                })}/>
            </div>
        </div>
    )
}
const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    following: state.users.following,
})


export default connect<MapStateToPropsType, null, {}, AppState>(mapStateToProps, null)(Friends);