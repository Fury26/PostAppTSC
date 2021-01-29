import React, {useState, useRef} from "react";
import {RiImageAddLine} from 'react-icons/ri';
import {mainServer} from "../../config";
import {connect} from "react-redux";
import {AppState} from "../../redux/rootReducer";

const convertDate = (time: Date) => {
    let res = '';
    res += time.getFullYear().toString() + '-';
    res += (time.getMonth() + 1).toString() + '-';
    res += time.getDate().toString() + ' ';
    res += time.getHours().toString() + ':';
    res += time.getMinutes().toString() + ':';
    res += time.getSeconds().toString();
    return res;
}

type MapStateToPropsType = {
    id?: number,
}

type StateType = {
    text: string,
    hashtags: string,
    images: File[],
}

type CreatePostFormProps = MapStateToPropsType;


const CreatePostForm: React.FC<CreatePostFormProps> = (props) => {

    const input = useRef<HTMLInputElement>(null);

    const choosePhoto = () => {
        input.current!.click();
    }

    const [post, setPost] = useState<StateType>({
        text: '',
        hashtags: '',
        images: [],
    });

    const [viewImages, setViewImages] = useState<string[]>([]);

    const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

        setPost({
            ...post,
            [event.target.name]: event.target.value,
        })
    }

    const onPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await imagesToSrc(event.target.files!);

        setPost({
            ...post,
            images: [...post.images, ...event.target.files!],
        });
    }

    const imagesToSrc = async (files: FileList) => {
        const arr = [...viewImages];
        let count = 0;
        Array.from(files).forEach((img, ind) => {
            count++;
            const reader = new FileReader();
            reader.onload = () => {
                if( typeof reader.result === "string") arr.push(reader.result);
                if(count === files.length) {
                    setViewImages([...arr]);
                }
            }
            reader.readAsDataURL(img);
        });

        return arr;
    }

    const imagesToTag = () => {
        return viewImages.map((src, key) => {
            return <img key={key} alt={key.toString()} className="post-photo" src={src}/>
        });
    }

    const createPost = async () => {
        const formData = new FormData();

        post.images.forEach((file, ind) => {
            formData.append(
                `post-image-${ind}`,
                file,
                file.name,
            );
        });
        formData.append('post-body',
            new Blob([JSON.stringify({
                text: post.text,
                hashtags: post.hashtags,
                datetime: convertDate(new Date(Date.now())),
            })], {type : 'application/json'}),
            'post-body-name');

        await sendPost(formData);

    }

    const sendPost = async (formData: FormData) => {
        if(post.images.length === 0) {
            alert('Must be at least 1 image');
            return;
        }
        const response = await fetch(`${mainServer}/post/${props.id}`, {
            method: 'POST',
            headers: {
                //Authorization: `Bearer ${actualJwt.accessToken}`,
            },
            body: formData,
        });
        if(response.status !== 200) {
            alert('Something went wrong, please, try again');
        } else {
            setPost({
                text: '',
                hashtags: '',
                images: [],
            });
            setViewImages([]);
        }
    }

    return (
        <div className="w-100">
            <div className="images-div">
                <div className="add-icon-div" id="add-photo-icon" style={{width: '100px', height: '100px'}} onClick={choosePhoto}>
                    <RiImageAddLine size="100%"/>
                    <input ref={input} id={`add-photo`} type="file" onChange={onPhotoChange} hidden={true} multiple={true}/>
                </div>
                {
                    viewImages.length !== 0 ?
                        <div className="w-100 post-images">
                            {imagesToTag()}
                        </div>
                        : null
                }
            </div>
            <div className="post-body m-auto">
                <div className="mb-3">
                    <label htmlFor="inputText" className="form-label">Write a message...</label>
                    <textarea
                        className="form-control"
                        id="inputText"
                        name="text"
                        value={post.text}
                        wrap="hard"
                        style={{'overflowY': 'hidden'}}
                        onChange={inputHandler}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputHashtags" className="form-label">Write hashtags</label>
                    <textarea
                        className="form-control"
                        id="inputHashtags"
                        name="hashtags"
                        style={{'overflowY': 'hidden'}}
                        value={post.hashtags}
                        onChange={inputHandler}/>
                    <button className="btn btn-success" onClick={createPost}>Post</button>
                </div>


            </div>
        </div>
    )
}

const mapStateToProps = (state: AppState): MapStateToPropsType => ({
    id: state.auth.user.id!,
})

export default connect<MapStateToPropsType, null, {}, AppState>(mapStateToProps, null)(CreatePostForm);