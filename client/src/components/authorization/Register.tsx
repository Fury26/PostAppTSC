import React, {useState} from "react";
import {connect} from 'react-redux'
import {register, login} from "../../redux/authorization/authorizationActions";
//import {Alert} from "../Alert";
import {NavLink} from "react-router-dom";
import {AppState} from "../../redux/rootReducer";
import {User} from "../../models/User";

type MapDispatchToPropsType = {
    login(user: User): any
    register(user: User): any,
}

type MapStateToPropsType = {
    register: boolean,
}

type RegisterProps = MapStateToPropsType & MapDispatchToPropsType;

const Register: React.FC<RegisterProps> = (props) => {

    const [state, setState] = useState({
        email: '',
        password: '',
        username: '',
    });

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const registerHandler = () => {
        const newUser: User = {
            bio: null,
            id: null,
            username: state.username,
            password: state.password,
            email: state.email,

        }

        props.register(newUser).then(() => {
            props.login(newUser)
        }).catch(() => {
            setState({
                email: "", password: "", username: ""
            })
        })
    }

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    name="email"
                    value={state.email}
                    onChange={inputHandler}/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="inputPassword" value={state.password}
                    onChange={inputHandler}/>
            </div>
            <div className="mb-3">
                <label htmlFor="inputUsername" className="form-label">Username</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    id="inputUsername" value={state.username}
                    onChange={inputHandler}/>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" name="remember" />
                <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
            </div>
            <button className="btn btn-success" onClick={registerHandler}>Register</button>
            <NavLink to={{pathname:"/auth/login"}}>
                <button className="btn btn-primary ms-3" >I already have an account</button>
            </NavLink>
        </div>
    )
};

const mapDispatchToProps = {
    register,
    login,
};

const mapStateToProps = (state: AppState) => ({
    register: state.auth.register,
});

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppState>(mapStateToProps, mapDispatchToProps)(Register);