import express, {Application} from 'express';
import upload from 'express-fileupload';
import bodyParser from 'body-parser';

import {corsPolicy} from './initCors';
import PostRouter from './routers/postRouter';
import UserRouter from './routers/userRouter';

const app: Application = express();

app.use(corsPolicy);
app.use(upload(undefined));
app.use(express.static('static'));
app.use(bodyParser.text({limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));

app.use('/post', PostRouter);
app.use('/user', UserRouter);

const http = require('http').createServer(app);



const PORT = 5000;


http.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});