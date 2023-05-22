import { pool } from "../db.js";

export const statusGoal = async (req, res) => {
    try {

        const [goal] = await pool.query('SELECT * FROM goals WHERE id = ?', [req.params.id]);
        const state = goal[0].active
        const [result] = await pool.query('UPDATE goals SET active = ? WHERE id = ?', [!state, req.params.id]);

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró la meta"
        })

        res.send({ message: 'Actualizado correctamente', success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};