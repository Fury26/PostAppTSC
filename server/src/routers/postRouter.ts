//import modules
import {Router} from 'express';
import fs from 'fs';
import path from 'path';

//import own components
import {PostController} from "../models/PostController";
import {Post, Comment} from "../models/Interfaces";
import {authenticateToken} from './authenticateToken';

const router = Router();
const root = path.dirname(require.main!.filename);


router.post('/:id', authenticateToken, async (req, res) => {
    try{
        const {id} = req.params;
        const files = req.files;
        if(!('data' in req.files!['post-body'])) {
            res.status(400).json(false);
            return;
        }

        // @ts-ignore
        const data = JSON.parse(req.files!['post-body'].data);


        if(data === undefined || data === null) {
            res.status(400).json(false);
            return;
        }

        const folder = path.join('./static', `/user_${id}`);

        if(!fs.existsSync(path.join(root, folder))) {
            fs.mkdirSync(path.join(root, folder));
        }

        const post: Post = {
            datetime: data.datetime,
            folder,
            text: data.text,
            hashtags: data.hashtags,
            userId: req.user.id,
        }


        const postId = await PostController.createPost(post);

        if(postId === false) {
            res.status(400).json('Something went wrong');
            return;
        }

        if(postId === true) {
            res.status(200).json(true);
            return;
        }


        // @ts-ignore
        Object.keys(files).forEach(key => {
            if(key === 'post-body') return;
            const img = files![key];
            // @ts-ignore
            img.mv(path.join(root, folder, `/post_${postId}/` ,`${key}_${img.name}`), (err) => {
                if(err) {
                    console.log(err.message);
                }
            })
        });

        res.status(200).json('created');



    }catch (e) {
        res.status(400).json(false);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const response = await PostController.deletePost(parseInt(req.params.id));
        res.json(response);
    }catch (e) {
        res.status(400).json('something went wrong');
    }
})

router.get('/:id', async (req, res) => {
    const response = await PostController.getPost(parseInt(req.params.id));
    if(response === null) {
        res.status(400).json(false);
    }
    res.json(response);
})


router.put('/get-posts/following', authenticateToken, async (req, res) => {
    try {
        const response = await PostController.getFollowingPosts(req.user.id, req.body.offset, req.body.count);
        if(response === null) {
            res.status(400).json(false);
            return;
        }

        const posts = response.map(post => {
            if(post.folder === null) return post;
            post.files = fs.readdirSync(path.join(root, post.folder));
            return post;
        });

        res.json(posts);
    }catch (e) {
        console.log(e.message);
        res.status(400);
    }
})

router.get('/:id/comments', async (req, res) => {
    try{
        const response = await PostController.getPostComments(parseInt(req.params.id));
        res.json(response);
    }catch (e) {
        res.status(400).json(false);
        console.log(e.message);
    }
})

router.get('/:id/comments', async (req, res) => {
    const response = await PostController.getPostComments(parseInt(req.params.id));
    res.json(response);
})

router.post('/:id/comment', authenticateToken, async (req, res) => {
    try {
        const comment: Comment = {
            postId: parseInt(req.params.id),
            text: req.body.text,
            userId: req.user.id,

        }

        const response = await PostController.addComment(comment);

        if(!response) {
            res.status(400).json(false);
            return;
        }
        res.status(200).json(true);
    } catch (e) {
        res.status(400);
        console.log('post comm', e.message);
    }
})


router.get('/image/:user/:post/:name',  (req, res) => {
    try {
        const {user, post, name} = req.params;
        const image = path.join(root, `./static/user_${user}/post_${post}/`, name);
        res.sendFile(image);
    }catch (e) {
        console.log(e.message);
        res.status(400);
    }
})

export default router;