import React from 'react';
import {AiFillHome, AiOutlinePlusCircle} from 'react-icons/ai';
import {FaUserFriends} from 'react-icons/fa';
import {BiWrench} from 'react-icons/bi';
import {RiAccountCircleFill} from 'react-icons/ri';
import {Icon} from "./Icon";

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light " style={{backgroundColor: '#e2d9f3'}}>
            <div className="container-fluid purple-500 d-flex justify-content-around">
                <div className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/posts">
                        <div className="d-flex my-auto">
                            <Icon icon={AiFillHome} className={''}/>
                            <span className="ms-1">Home</span>
                        </div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/friends">
                        <div className="d-flex my-auto">
                            <Icon icon={FaUserFriends} className={''}/>
                            <span className="ms-1">Friends</span>
                        </div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/create">
                        <div className="d-flex my-auto">
                            <Icon icon={AiOutlinePlusCircle} className={''}/>
                            <span className="ms-1">Create</span>
                        </div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/test">
                        <div className="d-flex my-auto">
                            <Icon icon={BiWrench} className={''}/>
                            <span className="ms-1">Test</span>
                        </div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/account">
                        <div className="d-flex my-auto">
                            <Icon icon={RiAccountCircleFill} className={''}/>
                            <span className="ms-1">Account</span>
                        </div>
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;