import { pool } from "../db.js";

export const getRoutines = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM routine")
        res.json({ rows });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};