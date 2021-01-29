import express from 'express';

import AuthRouter from './routers/authRouter'
import {corsPolicy} from './initCors';

const app = express();



app.use(corsPolicy);
app.use(express.json());

app.use('/', AuthRouter);

const http = require('http').createServer(app);

const PORT = 4000;


http.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});