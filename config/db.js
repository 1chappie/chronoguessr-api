const mysql = require('mysql');

const dbPool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_POOL_SIZE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

dbPool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (connection) {
        console.log('Database connection successful');
        connection.release();
    }
});

const executeQuery = async (sql, params) => {
    return new Promise((resolve, reject) => {
        dbPool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            conn.query(sql, params, (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
};

module.exports = {dbPool, executeQuery};