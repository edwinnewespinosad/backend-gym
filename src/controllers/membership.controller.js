import { pool } from "../db.js";

export const getMemberships = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM membership")
        res.json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getMembership = async (req, res) => {
    try {

        const [row] = await pool.query("SELECT * FROM membership WHERE id = ?", [req.params.id])
        if (row.length <= 0) return res.status(404).json({
            message: "No se encontró la membership"
        })
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createMembership = async (req, res) => {
    try {
        const { name, duration, price, benefits } = req.body

        const [rows] = await pool.query('INSERT INTO membership (name,duration,price,benefits) VALUES (?, ?, ?, ?)', 
        [name, duration, price, benefits])

        res.send({ rows, success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const deleteMembership = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM membership WHERE id = ?', [req.params.id]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: "No se encontró la membership"
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const updateMembership = async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, duration, benefits } = req.body
        const [result] = await pool.query(
            'UPDATE membership SET name =?, price =?, duration =?, benefits = IFNULL(?,benefits) WHERE id =?', 
            [name, price, duration, benefits, id]
        )

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró la membership"
        })

        res.send({message:'Actualizado correctamente', success:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const statusMembership = async (req, res) => {
    try {

        const [user] = await pool.query('SELECT * FROM membership WHERE id = ?', [req.params.id]);
        const state = user[0].active
        const [result] = await pool.query('UPDATE membership SET active = ? WHERE id = ?', [!state, req.params.id]);

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró la membresia"
        })

        res.send({ message: 'Actualizado correctamente', success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};
