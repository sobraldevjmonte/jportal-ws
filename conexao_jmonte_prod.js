const dotenv = require('dotenv');
//require('dotenv').config()
dotenv.config({ path: `${__dirname}/config.env` });


const { Pool } = require('pg');
const pool = new Pool({
    "connectionLimit": 10000,
    "host": process.env.POSTGRES_HOST_PROD,
    "user": process.env.POSTGRES_USER_PROD,
    "password": process.env.POSTGRES_PASSWORD_PROD,
    "database": process.env.POSTGRES_DATABASE_JMONTE_PROD,
    "port": process.env.POSTGRES_PORT
});

exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

exports.pool = pool;