const {dbPool, executeQuery} = require('../config/db.js');
const userModel = require('../models/userModel.js');


module.exports = class userDAO {

    static async create(user) {
        try {
            // checking for username and email uniqueness on database level
            const sql = 'INSERT INTO users (username, hashed_password, email, role, region) VALUES (?, ?, ?, ?, ?)';
            const result = await executeQuery(sql, [user.username, user.hashedPassword, user.email, 'user', user.region]);
            return new userModel({
                ...user,
                id: result.insertId
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async read() {
        try {
            const sql = 'SELECT * FROM users';
            const rows = await executeQuery(sql, []);
            return rows.map(row =>
                new userModel({
                    id: row.user_id,
                    username: row.username,
                    hashedPassword: row.hashed_password,
                    email: row.email,
                    role: row.role,
                    region: row.region
                })
            );
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async #readOne(sql, params) {
        try {
            const rows = await executeQuery(sql, params);
            if (rows.length === 0) {
                return null;
            }
            const row = rows[0];
            return new userModel({
                id: row.user_id,
                username: row.username,
                hashedPassword: row.hashed_password,
                email: row.email,
                role: row.role,
                region: row.region
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async readOneById(id) {
        return this.#readOne('SELECT * FROM users WHERE user_id = ?', [id]);
    }

    static async readOneByUsernameOrEmail(usernameEmail) {
        return this.#readOne('SELECT * FROM users WHERE username = ? OR email = ?', [usernameEmail, usernameEmail]);
    }

    static async update(user) {
        try {
            const sql = 'UPDATE users SET username = ?, hashed_password = ?, email = ?, role = ?, region = ? WHERE user_id = ?';
            const result = await executeQuery(sql, [user.username, user.hashedPassword, user.email, user.role, user.region, user.id]);
            return user;
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async #delete(sql, params) {
        try {
            const result = await executeQuery(sql, params);
            return true;
        } catch (err) {
            console.log('Database error: ', err)
            return false;
        }
    }

    static async deleteById(id) {
        return this.#delete('DELETE FROM users WHERE user_id = ?', [id]);
    }

    static async deleteByUsernameOrEmail(usernameEmail) {
        return this.#delete('DELETE FROM users WHERE username = ? OR email = ?', [usernameEmail, usernameEmail]);
    }
}