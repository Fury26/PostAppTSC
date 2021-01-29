import {pool} from './db';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import {Comment, Post} from "./Interfaces";
import {UserController} from "./UserController";

const root = path.dirname(require.main!.filename);


class PostController {
    static async createPost(post: Post): Promise<number | boolean> {

        try {
            await pool.query(`insert into posts(text, hashtags, datetime, user_id) values('${post.text}', '${post.hashtags}', '${post.datetime}', ${post.userId});`);

            const postId  = (await pool.query(`select id from posts where user_id = ${post.userId} order by id desc limit 1;`)).rows[0].id;

            if(post.folder === null ) {
                return true;
            }
            fs.mkdirSync(path.join(root, post.folder!, `/post_${postId}`));
            await pool.query(`update posts set folder = '${post.folder}/post_${postId}' where id = ${postId};`);


            return postId;

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getPost(id: number): Promise<Post | null> {
        try {
            const response = (await pool.query(`select p.* from posts p left join users u on p.user_id = u.id where p.id = ${id};`)).rows[0];
            const user = await UserController.getUserById(response.user_id!);
            if(user) {
                response.user = user;
                response.userId = response.user_id!;
            }

            return response;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }


    static async deletePost(id: number): Promise<boolean> {
        try {
            const folder = (await pool.query(`select folder from posts where id = ${id}`)).rows[0].folder;
            await pool.query(`delete from posts where id = ${id};`);

            rimraf(path.join(root, folder), (err: any) =>{
                if(err) {
                    console.log(err);
                    return false;
                }
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getFollowingPosts(id: number, offset: number, count: number): Promise<Post[] | null> {
        try {
            const posts = <Post[]>(await pool.query(`select p.* from posts p left join followers f on p.user_id = f.user_id and f.follower_id = ${id} left join users u on u.id = f.user_id
            order by p.datetime desc offset ${offset} limit ${count};`)).rows;
            for (const post of posts) {
                const user = await UserController.getUserById(post.user_id!);

                if(user) {
                    post.user = user;
                    post.userId = post.user_id!;
                }
            }

            console.log('sending post', posts);

            return posts;
        }catch (e) {
            console.log(e.message);
            return null;
        }
    }

    static async addComment(comment: Comment): Promise<boolean> {
        try {
            await pool.query(`insert into comments(text, user_id, post_id) values('${comment.text}', '${comment.userId}', '${comment.postId}');`);
            return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    static async deleteComment(id: number): Promise<boolean>
    {
        try {
            await pool.query(`delete from comments where id = ${id};`);
            return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }


    static async getPostComments(postId: number): Promise<Comment[] | null> {
        try{
            const comments: Comment[] = (await pool.query(`select * from comments where post_id = ${postId}`)).rows;
            for (const comment of comments) {
                const user = await UserController.getUserById(comment.user_id!);
                if(user) {
                    comment.user = user;
                }
            }
            return comments;
        }catch (e) {
            console.log(e.message);
            return null;
        }
    }

}

export {
    PostController,
}