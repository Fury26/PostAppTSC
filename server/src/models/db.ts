import {Pool} from 'pg';

//connecting to the local database
const pool: Pool = new Pool({
    user: "postgres",
    password: "1928sfsf",
    host: "localhost",
    port: 5432,
    database: "postapp",
});


export {
    pool
}