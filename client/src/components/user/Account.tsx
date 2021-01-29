import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {BsUpload} from 'react-icons/bs';
import {mainServer} from "../../config";
import {setUser, updateUser} from "../../redux/authorization/authorizationActions";

import {AppState} from "../../redux/rootReducer";
import {User} from "../../models/User";



type MapStateToPropsType = {
    user: User,
    avatar: string,
}

type MapDispatchToPropsType = {
    setUser(user: User): any,
    updateUser(user: User): any,
}

type AccountProps = MapStateToPropsType & MapDispatchToPropsType;


type StateType = {
    user: User,
    changeAvatarBtn: boolean,
    previewSrc: string | null,
    file: any,
    confirmChanges: boolean,
}


const Account: React.FC<AccountProps> = (props) => {
    const input = useRef<HTMLInputElement>(null);

    const [state, setState] = useState<StateType>({
        user: {
            id: props.user.id,
            username: props.user.username,
            bio: props.user.bio,
        },
        changeAvatarBtn: false,
        previewSrc: null,
        file: null,
        confirmChanges: false,
    })

    useEffect(() => {

    }, [])

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let changes: boolean;
        // if(event.target.value !== props.user[event.target.name]) {
        //     changes = true;
        // } else changes = false;
        setState(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                [event.target.name]: event.target.value
            },
            confirmChanges: changes,
        }));
    }

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const img = event.target.files![0];

        const reader = new FileReader();


        reader.readAsDataURL(img);
        reader.onload = () => {
            setState({
                ...state,
                file: img,
                previewSrc: reader.result!.toString(),
                changeAvatarBtn: true,
            })
        };

    }

    const changeAvatar = async () => {
        const formData = new FormData();
        formData.append(
            "avatar",
            state.file,
            state.file.name,
        );
        try {
            const response = await fetch(`${mainServer}/user/avatar/${props.user.id}`, {
                method: 'POST',
                body: formData,
            });

            if(response) {

            } else {
                alert('Something went wrong, try again');
            }
        } catch (e) {
            console.log(e);
        }
    }

    const submitChanges = () => {
        try{
            props.updateUser(state.user);
            setState({
                ...state,
                confirmChanges: false,
            });

        }catch (e) {
            alert('Smth went wrong')
        }
    }

    const loadPhoto = () => {
        input.current!.click();
    }

    return (

        <div>
            <div>
                { state.previewSrc || props.avatar ? <img className="rounded" style={{maxHeight: '200px'}}
                                                          src={state.previewSrc ? state.previewSrc : props.avatar} alt="no avatar"/> :
                    <span>You don`t have avatar</span>
                }
                <input ref={input} type="file" onChange={onChange} hidden={true}/>
                <button className='btn-primary btn' onClick={loadPhoto}><BsUpload fontSize={30} style={{margin: 'auto'}}/></button>
                { state.changeAvatarBtn ? <button className="btn btn-success mx-3" onClick={changeAvatar}>Change avatar</button> : null}

            </div>
            <div className="mb-3">
                <label htmlFor="inputUsername" className="form-label">Your username</label>
                <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    id="inputUsername"
                    name="username"
                    value={state.user.username!}
                    onChange={inputHandler}/>
            </div>
            <div className="mb-3">
                <label htmlFor="inputBIO" className="form-label">BIO</label>
                <input
                    placeholder="Write something about you"
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    id="inputBIO"
                    name="bio"
                    value={state.user.bio!}
                    onChange={inputHandler}/>
            </div>
            {state.confirmChanges ? <button onClick={submitChanges} className="btn btn-primary">Confirm Changes</button> : null}
        </div>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    user: state.auth.user,
    avatar: state.users.avatarSrc,
});

const mapDispatchToProps: MapDispatchToPropsType = {
    setUser,
    updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);