import {pool} from './db'
import {User} from "./Interfaces";

class UserController {

    static async createUser(user: User): Promise<User | null> {
        try {
            let response: any = await pool.query(`insert into users(email, password, username) values(\'${user.email}\', \'${user.password}\', \'${user.username}\');`);
            if (!response) {
                return null;
            }
            response = <User>await this.getUserByEmail(user.email!);
            return response;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    static async updateUser(user: User): Promise<boolean> {
        try {
            console.log('old User', user.id);
            let response = await this.getUserById(user.id!);
            if(!response) {
                return false;
            }
            const updatedUser: User = {
                ...response,
                ...user,
            }
            console.log('newUser', updatedUser);
            await pool.query(`update users set username='${updatedUser.username}', email='${updatedUser.email}', bio='${updatedUser.bio}' where id=${user.id};`);
            return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    static async verifyUser(user: User): Promise<User | null> {
        const response = <User>(await pool.query(`select * from users where email = \'${user.email}\'`)).rows[0];
        if(response.password !== user.password) {
            return null;
        }
        return {
            ...response,
        };
    }

    static  async getUserById(id: number): Promise<User | null> {
        try {
            const response = await pool.query(`select * from users where id = ${id};`);
            return <User><unknown>response.rows[0];
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    static  async getUserByEmail(email: string): Promise<User | null> {
        const response = await  pool.query(`select * from users where email = '${email}';`);
        return response.rows[0];
    }

    // static async uploadPhoto(id, imgPath) {
    //     try {
    //         const response = await pool.query(`update users set image='${imgPath}' where id=${id};`);
    //         return response.rowsCount === 0 ? null : response.rows;
    //     } catch (e) {
    //         return e;
    //     }
    // }

    static async getUsersByName(username: string): Promise<User | null> {
        try{
            const response = await pool.query(`select * from users where lower(username) LIKE lower('%${username}%');`);
            return <User>response.rows[0];
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    static async follow(userId: number, follower: number): Promise<boolean> {
        try {
            const response = await pool.query(`insert into followers(user_id, follower_id) values(${userId}, ${follower});`);
            return !!response;
        }catch (e) {
            console.log(e.message);
            return false;
        }
    }

    static async unfollow(userId: number, follower: number): Promise<boolean> {
        try {
            const response = await pool.query(`delete from followers where user_id = ${userId} and follower_id = ${follower};`);
            return !!response;
        }catch (e) {
            console.log(e.message);
            return false;
        }
    }

    static async following(id: number): Promise<User[] | null> {
        try {
            const response = await pool.query(`select u.* from followers f inner join users u on u.id = f.user_id and f.follower_id = ${id};`);
            return <User[]>response.rows;
        }catch (e) {
            console.log(e.message);
            return null;
        }
    }

}

export {
    UserController,
}