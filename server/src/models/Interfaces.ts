interface User {
    id?: number,
    username: string,
    bio: string | null,
    password: string,
    email: string,
    image?: string,
}

interface Post {
    id?: number,
    text: string | null,
    hashtags: string | null,
    folder: string
    files?: string[] | null,
    userId: number,
    user_id?: number,
    user?: User,
    datetime: Date,
}

interface Comment {
    id?: number,
    userId: number,
    user_id: number,
    user?: User,
    postId: number,
    post_id?: number,
    post?: Post,
    text: string,
}

interface ReqUser {
    id: number,
}

export {
    User,
    Post,
    Comment,
    ReqUser,
}