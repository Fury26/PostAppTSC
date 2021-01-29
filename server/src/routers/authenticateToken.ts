import {Response, Request, NextFunction} from "express";

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];


    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {

        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = {
            id: user.id,
        }
        next();
    })
}

export {
    authenticateToken
}