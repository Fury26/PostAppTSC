import React, {useState} from "react";
import {connect} from 'react-redux'
import {setUser, login} from "../../redux/authorization/authorizationActions";
import {NavLink} from "react-router-dom";
import {actionType} from "../../redux/types";
import {AppState} from "../../redux/rootReducer";
import {User} from "../../models/User";

type MapDispatchToPropsType = {
    setUser(user: User): actionType,
    login(user: User): any
}

type MapStateToPropsType = {
    logined: boolean,
}

type LoginProps = MapDispatchToPropsType & MapStateToPropsType;

const Login: React.FC<LoginProps> = (props) => {

    const [state, setState] = useState({
        email: '',
        password: '',
    });

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const loginHandler = () => {
        const logUser: User = {
            username: null,
            bio: null,
            id: null,
            email: state.email,
            password: state.password

        }
        props.login(logUser);

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
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" name="remember" />
                <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
            </div>
            <button type="submit" className="btn btn-success" onClick={loginHandler}>Login</button>
            <NavLink to={{pathname:"/auth/register"}}>
                <button className="btn btn-primary ms-3" >Or create new account</button>
            </NavLink>
        </div>
    )
};

const mapDispatchToProps = {
    setUser,
    login,

};

const mapStateToProps = (state: AppState) => ({
    logined: state.auth.logined,
});

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppState>(mapStateToProps, mapDispatchToProps)(Login);