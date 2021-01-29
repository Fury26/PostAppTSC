export interface User {
    id: number | null,
    username: string | null,
    bio: string | null,
    password?: string,
    email?: string,
    image?: string,
    following?: boolean,
}