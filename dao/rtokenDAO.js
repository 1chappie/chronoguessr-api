const {dbPool, executeQuery} = require('../config/db.js');
const rtokenModel = require('../models/rtokenModel');

module.exports = class rtokenDAO {
    static async create(rtoken) {
        // checking for username and email uniqueness on database level
        try {
            const sql = 'INSERT INTO rtokens (user_id, token, expires_at) VALUES (?,?,?)';
            const result = await executeQuery(sql, [rtoken.userId, rtoken.token, rtoken.expiresAt]);
            return new rtokenModel({
                ...rtoken,
                id: result.insertId
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async read() {
        try {
            const sql = 'SELECT * FROM rtokens';
            const rows = await executeQuery(sql, []);
            return rows.map(row => new rtokenModel({
                id: row.id,
                userId: row.user_id,
                token: row.token,
                expiresAt: row.expires_at
            }));
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async #readOne(sql, params) {
        try {
            const rows = await executeQuery(sql, params);
            if (rows.length === 0) return null;
            const row = rows[0];
            return new rtokenModel({
                id: row.id,
                userId: row.user_id,
                token: row.token,
                expiresAt: row.expires_at
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async readOneById(id) {
        const sql = 'SELECT * FROM rtokens WHERE rtoken_id = ?';
        return await this.#readOne(sql, [id]);
    }

    static async readOneByUserId(userId) {
        const sql = 'SELECT * FROM rtokens WHERE user_id = ?';
        return await this.#readOne(sql, [userId]);
    }

    static async readOneByToken(token) {
        const sql = 'SELECT * FROM rtokens WHERE token = ?';
        return await this.#readOne(sql, [token]);
    }

    static async update(rtoken) {
        // checking for username and email uniqueness on database level
        try {
            const sql = 'UPDATE rtokens SET user_id = ?, token = ?, expires_at = ? WHERE rtoken_id = ?';
            const result = await executeQuery(sql, [rtoken.userId, rtoken.token, rtoken.expiresAt, rtoken.id]);
            return rtoken;
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

    static async deleteByUserId(userId) {
        const sql = 'DELETE FROM rtokens WHERE user_id = ?';
        return await this.#delete(sql, [userId]);
    }

    static async deleteByToken(token) {
        const sql = 'DELETE FROM rtokens WHERE token = ?';
        return await this.#delete(sql, [token]);
    }

    static async deleteById(id) {
        const sql = 'DELETE FROM rtokens WHERE rtoken_id = ?';
        return await this.#delete(sql, [id]);
    }

}
