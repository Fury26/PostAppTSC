import {User} from "./User";


export interface Post {
    id?: number,
    text: string | null,
    hashtags: string | null,
    folder: string
    files?: string[] | null,
    userId: number,
    user?: User,
    datetime?: string,
}