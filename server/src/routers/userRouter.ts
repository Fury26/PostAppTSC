//import node modules
import {Router} from 'express';
import fs from 'fs';
import path from 'path';

//import own components
import {UserController} from '../models/UserController';
import {authenticateToken} from './authenticateToken';

const root = path.dirname(require.main!.filename);
const router = Router();



router.get('/username=:name', async (req, res) => {
    const response = await UserController.getUsersByName(req.params.name);
    if(response === null) {
        res.status(400).json(false);
    }
    res.json(response);
})


router.post('/follow', async (req, res) => {
    try {
        const response = await UserController.follow(req.body.userId,  req.body.follower);
        if (response) {
            res.status(200).json(response);
        } else res.status(400).json(response);
    }catch (e) {
        res.status(400).json(false)
    }
})

router.post('/unfollow', async (req, res) => {
    try {
        const response = await UserController.unfollow(req.body.userId,  req.body.follower);
        if (response) {
            res.status(200).json(response);
        } else res.status(400).json(response);
    }catch (e) {
        res.status(400).json(false)
    }
})

router.get('/following', authenticateToken, async (req, res) => {
    console.log('following', req.user);
    try {
        const response = await UserController.following(req.user.id);
        res.json(response);
    }catch (e) {
        res.status(400).json(false);
    }
});

router.put('/:id', async (req, res) => {
    try{
        const response = await UserController.updateUser({id: req.params.id, ...req.body});
        res.json(response);
    }catch (e) {
        res.status(400).json(false);
    }
})

router.post('/avatar', authenticateToken, async (req, res) => {
    try {
        const id = req.user.id;
        const file = req.files!.avatar;
        if(!fs.existsSync(path.join(root, '/static', `/user_${id}`))) {
            fs.mkdirSync(path.join( root, '/static', `/user_${id}`));
        }


        if('mv' in file) {
            await file.mv(path.join(root, `static/user_${id}/avatar.jpg`), (err: any) => {
                if (err) {
                    res.status(404).json(err.message);
                } else {
                    res.json(true);
                }
            });
        }
    } catch (e) {
        res.status(400).json(false);
    }
})

router.get('/avatar/:id', async (req, res) => {
    try {
        fs.readdir(path.join(root, `static/user_${req.params.id}`), (err, filenames) => {
            if(err) {
                res.send(404).json(false);
            }
            res.sendFile(path.join(root, `static/user_${req.params.id}/${filenames[0]}`));
        });
    } catch (e) {
        res.status(400).json(false);
    }
})

export default router;