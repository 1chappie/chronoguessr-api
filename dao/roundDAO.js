const {dbPool, executeQuery} = require('../config/db.js');
const roundModel = require('../models/roundModel.js');

module.exports = class roundDAO {
        static async create(round) {
            try {
                // check if a round with the same round number already exists in the session
                const existingRounds = await this.readAllBySessionId(round.sessionId);
                if (existingRounds.some(r => r.roundNumber === round.roundNumber)) {
                    throw new Error("Round with the same round number already exists in the session");
                }

                const sql = 'INSERT INTO rounds (session_id, round_number, start_time, end_time, expected_year, answered_year, rr_link, score) VALUES (?,?,?,?,?,?,?,?)';
                const result = await executeQuery(sql, [
                    round.sessionId,
                    round.roundNumber,
                    round.startTime,
                    round.endTime,
                    round.expectedYear,
                    round.answeredYear,
                    round.rrLink,
                    round.score
                ]);
                return new roundModel({
                    ...round,
                    id: result.insertId
                });
            } catch (err) {
                console.log('Database error: ', err)
                return null;
            }
        }

        static async #readMultiple(sql, params) {
            try {
                const rows = await executeQuery(sql, params);
                return rows.map(row => new roundModel({
                    id: row.round_id,
                    sessionId: row.session_id,
                    roundNumber: row.round_number,
                    startTime: row.start_time,
                    endTime: row.end_time,
                    expectedYear: row.expected_year,
                    answeredYear: row.answered_year,
                    rrLink: row.rr_link,
                    score: row.score
                }));
            } catch (err) {
                console.log('Database error: ', err)
                return null;
            }
        }

        static async read() {
            const sql = 'SELECT * FROM rounds';
            return await this.#readMultiple(sql, []);
        }

        static async readAllBySessionId(sessionId) {
            const sql = 'SELECT * FROM rounds WHERE session_id = ?';
            return await this.#readMultiple(sql, [sessionId]);
        }

        static async #readOne(sql, params) {
            try {
                const rows = await executeQuery(sql, params);
                if (rows.length === 0) return null;
                const row = rows[0];
                return new roundModel({
                    id: row.round_id,
                    sessionId: row.session_id,
                    roundNumber: row.round_number,
                    startTime: row.start_time,
                    endTime: row.end_time,
                    expectedYear: row.expected_year,
                    answeredYear: row.answered_year,
                    rrLink: row.rr_link,
                    score: row.score
                });
            } catch (err) {
                console.log('Database error: ', err)
                return null;
            }
        }

        static async readOneById(id) {
            const sql = 'SELECT * FROM rounds WHERE round_id = ?';
            return await this.#readOne(sql, [id]);
        }

        static async readOneBySessionId(sessionId) {
            const sql = 'SELECT * FROM rounds WHERE session_id = ?';
            return await this.#readOne(sql, [sessionId]);
        }

        static async update(round) {
            try {
                const sql = 'UPDATE rounds SET start_time = ?, end_time = ?, expected_year = ?, answered_year = ?, rr_link = ?, score = ? WHERE round_id = ?';
                await executeQuery(sql, [
                    round.startTime,
                    round.endTime,
                    round.expectedYear,
                    round.answeredYear,
                    round.rrLink,
                    round.score,
                    round.id
                ]);
                return true;
            } catch (err) {
                console.log('Database error: ', err)
                return false;
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
            const sql = 'DELETE FROM rounds WHERE round_id = ?';
            return await this.#delete(sql, [id]);
        }

        static async deleteAllBySessionId(sessionId) {
            const sql = 'DELETE FROM rounds WHERE session_id = ?';
            return await this.#delete(sql, [sessionId]);
        }

}