// require('dotenv').config();
import {config} from 'dotenv';
import {Router} from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
config();
import {pool} from '../models/db';
import {UserController} from '../models/UserController';

const expTime = '15m';

const addRefreshToken = async (token: string) => {
    try{
        await pool.query(`insert into refresh_tokens(token) values('${token}')`);
        return true;
    }catch (e) {
        return false;
    }
}

const isIncludes = async (token: string) => {
    try {
        const response = await pool.query(`select * from refresh_tokens where token = '${token}'`);
        return response.rowCount !== 0;
    }catch (e) {
        return e;
    }
}

const deleteRefreshToken = async (token: string) => {
    try {
        await pool.query(`delete from refresh_tokens where token = '${token}'`);
    }catch (e) {
        return e;
    }
}


router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!(await isIncludes(refreshToken))) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
        if (err !== null) return res.sendStatus(403);
        const accessToken = generateAccessToken({ id: user.id });
        res.json({ accessToken: accessToken });
    })
})

function generateAccessToken(user: any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: expTime });
}

router.delete('/logout', async (req, res) => {
    await deleteRefreshToken(req.body.token);
    res.sendStatus(204);
})


router.post('/login', async (req, res) => {

    try {

        const response = await UserController.verifyUser(req.body);
        if(!response) {
            res.status(400).json('Wrong password or email');
            return;
        }
        // response.id = await bcrypt.hash(response.id, 10);
        //
        // res.cookie('id', response.id);
        //
        // console.log('login head', req.headers);
        // console.log('login');

        const user = {id: response.id};
        const accessToken = generateAccessToken(user);

        const refreshToken = jwt.sign(
            {id: response.id},
            process.env.REFRESH_TOKEN_SECRET!,
        );
        await addRefreshToken(refreshToken);

        res.json({
            tokens: {
                accessToken,
                refreshToken,
            },
            user: {
                ...response
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json('Something went wrong, try again');
    }
})


router.post('/register', async (req, res) => {
    try {
        const response = await UserController.createUser(req.body);
        if(response) {
            res.json(response);
        } else {
            res.status(400).json(false);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(false);
    }

});

router.put('/check', async (req, res) => {
    const token = req.body.token;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any) => {
        if (err) return res.status(200).json(false);
        return res.status(200).json(true);
    });
})


export default router;