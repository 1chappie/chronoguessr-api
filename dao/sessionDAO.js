const {dbPool, executeQuery} = require('../config/db.js');
const sessionModel = require('../models/sessionModel.js');

module.exports = class sessionDAO {

    static async create(session) {
        try {
            // check if the user already has any other active sessions
            const existingSession = await this.readOneByUserId(session.userId);
            if (existingSession && existingSession.inProgress) {
                throw new Error("User already has an active session");
            }
            const sql = 'INSERT INTO sessions (user_id, game_mode, start_time, end_time, in_progress, final_score, round_count) VALUES (?,?,?,?,?,?,?)';
            const result = await executeQuery(sql, [
                session.userId,
                session.gameMode,
                session.startTime, // startTime is a date object
                session.endTime, // at creation, endTime is null
                session.inProgress, // in progress starts as 1
                session.finalScore, // finalScore starts as 0
                session.roundCount // roundCount is an integer, starts at 0
            ]);
            return new sessionModel({
                ...session,
                id: result.insertId
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async read() {
        try {
            const sql = 'SELECT * FROM sessions';
            const rows = await executeQuery(sql, []);
            return rows.map(row => new sessionModel({
                id: row.session_id,
                userId: row.user_id,
                gameMode: row.game_mode,
                startTime: row.start_time,
                endTime: row.end_time,
                inProgress: row.in_progress,
                finalScore: row.final_score,
                roundCount: row.round_count
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
            return new sessionModel({
                id: row.session_id,
                userId: row.user_id,
                gameMode: row.game_mode,
                startTime: row.start_time,
                endTime: row.end_time,
                inProgress: row.in_progress,
                finalScore: row.final_score,
                roundCount: row.round_count
            });
        } catch (err) {
            console.log('Database error: ', err)
            return null;
        }
    }

    static async readOneById(id) {
        const sql = 'SELECT * FROM sessions WHERE session_id = ?';
        return await this.#readOne(sql, [id]);
    }

    static async readOneByIdInProgress(id) {
        const sql = 'SELECT * FROM sessions WHERE session_id = ? AND in_progress = 1';
        return await this.#readOne(sql, [id]);
    }

    static async readOneByUserId(userId) {
        const sql = 'SELECT * FROM sessions WHERE user_id = ?';
        return await this.#readOne(sql, [userId]);
    }

    static async readOneByUserIdInProgress(userId) {
        const sql = 'SELECT * FROM sessions WHERE user_id = ? AND in_progress = 1';
        return await this.#readOne(sql, [userId]);
    }

    static async readOneByUsername(username) {
        const sql = 'SELECT * FROM sessions WHERE user_id = (SELECT user_id FROM users WHERE username = ?)';
        return await this.#readOne(sql, [username]);
    }

    static async update(session) {
        try {
            console.log(session)
            const sql = 'UPDATE sessions SET end_time = ?, in_progress = ?, final_score = ?, round_count = ? WHERE session_id = ?';
            await executeQuery(sql, [
                session.endTime,
                session.inProgress,
                session.finalScore,
                session.roundCount,
                session.id
            ]);
            return session;
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
        const sql = 'DELETE FROM sessions WHERE session_id = ?';
        return await this.#delete(sql, [id]);
    }

    static async deleteByUserId(userId) {
        const sql = 'DELETE FROM sessions WHERE user_id = ?';
        return await this.#delete(sql, [userId]);
    }

}