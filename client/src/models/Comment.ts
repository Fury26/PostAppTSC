import {User} from "./User";
import {Post} from "./Post";


export interface IComment {
    id: number | null,
    userId: number,
    user?: User,
    postId: number,
    post?: Post,
    text: string,
}