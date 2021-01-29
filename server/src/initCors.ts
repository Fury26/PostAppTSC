import cors from 'cors';

const corsOpt = {
    origin: ['http://192.168.0.20:3000', 'http://192.168.0.20:4000', 'http://192.168.0.20:5000', 'http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000'],
    credentials: true,
}

const corsPolicy = cors(corsOpt);

export {
    corsPolicy,
}