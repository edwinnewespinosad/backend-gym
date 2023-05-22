import { pool } from "../db.js";


export const addMembershipClient = async (req, res) => {
    try {
        const { fk_id_membership, fk_id_client, price } = req.body
        const [rows] = await pool.query('INSERT INTO membership_purchase (fk_id_membership,fk_id_client,price) VALUES (?, ?, ?)', [fk_id_membership, fk_id_client, price])

        res.send({ rows, success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
}