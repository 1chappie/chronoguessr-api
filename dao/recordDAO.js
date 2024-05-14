const {dbPool, executeQuery} = require('../config/db.js');
const recordModel = require('../models/recordModel');

module.exports = class recordDAO {
    static async create(record) {
        try {
            const sql = 'SELECT * FROM records WHERE user_id = ? AND game_mode = ?';
            const rows = await executeQuery(sql, [record.userId, record.gameMode]);
            if (rows.length > 0) {
                const existingRecord = rows[0];
                if (record.score > existingRecord.score) {
                    const updateSql = 'UPDATE records SET score = ?, created_at = ? WHERE record_id = ?';
                    await executeQuery(updateSql, [record.score, record.createdAt, existingRecord.record_id]);
                    return new recordModel({
                        ...record,
                        id: existingRecord.record_id
                    });
                }
                return null;
            }else{
                const sql = 'INSERT INTO records (user_id, game_mode, score, created_at, region) VALUES (?,?,?,?,?)';
                const result = await executeQuery(sql, [
                    record.userId,
                    record.gameMode,
                    record.score,
                    record.createdAt,
                    record.region
                ]);
                return new recordModel({
                    ...record,
                    id: result.insertId
                });
            }
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async #readMultiple(sql, params) {
        try {
            const rows = await executeQuery(sql, params);
            return rows.map(row => new recordModel({
                id: row.record_id,
                userId: row.user_id,
                gameMode: row.game_mode,
                score: row.score,
                createdAt: row.created_at,
                region: row.region
            }));
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async read() {
        const sql = 'SELECT * FROM records';
        return await this.#readMultiple(sql, []);
    }

    static async readAllByUserId(userId) {
        const sql = 'SELECT * FROM records WHERE user_id = ?';
        return await this.#readMultiple(sql, [userId]);
    }

    static async readAllByRegion(region) {
        const sql = 'SELECT * FROM records WHERE region = ?';
        return await this.#readMultiple(sql, [region]);
    }

    static async #readOne(sql, params) {
        try {
            const rows = await executeQuery(sql, params);
            if (rows.length === 0) return null;
            const row = rows[0];
            return new recordModel({
                id: row.record_id,
                userId: row.user_id,
                gameMode: row.game_mode,
                score: row.score,
                createdAt: row.created_at,
                region: row.region
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async readOneById(id) {
        const sql = 'SELECT * FROM records WHERE record_id = ?';
        return await this.#readOne(sql, [id]);
    }

    static async readOneByUserIdAndGameMode(userId, gameMode) {
        const sql = 'SELECT * FROM records WHERE user_id = ? AND game_mode = ?';
        return await this.#readOne(sql, [userId, gameMode]);
    }

    static async update(record) {
        try {
            const sql = 'UPDATE records SET score = ?, created_at = ? WHERE record_id = ?';
            await executeQuery(sql, [record.score, record.createdAt, record.id]);
            return record;
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async #delete(sql, params) {
        try {
            await executeQuery(sql, params);
            return true;
        } catch (err) {
            console.log('Database error: ', err)
            return false;
        }
    }

    static async deleteById(id) {
        const sql = 'DELETE FROM records WHERE record_id = ?';
        return await this.#delete(sql, [id]);
    }

    static async deleteByUserId(userId) {
        const sql = 'DELETE FROM records WHERE user_id = ?';
        return await this.#delete(sql, [userId]);
    }

}