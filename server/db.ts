require('dotenv').config();

const { Pool } = require('pg');

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        require: true,
    },
});

module.exports = {
    query: (text: string, params: any[]) => pool.query(text, params),
    getClient: () => pool.connect(),
    end: () => pool.end(),
    pool: pool
};