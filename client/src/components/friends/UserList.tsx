import React from "react";
import UserListItem from "./UserListItem";
import {User} from "../../models/User";



type OwnProps = {
    users: User[],
}

const UserList: React.FC<OwnProps> = (props) => {

    const usersToJSX = () => {
        return props.users.map((user, ind) => {
            return (
                <UserListItem user={user} key={ind}/>
            )
        });
    }

    if(!props.users || props.users.length === 0) {
        return (
            <h5>Nothing Found</h5>
        )
    }

    return (

        <ul className="list-group">
            {usersToJSX()}
        </ul>
    )
}

export default UserList;