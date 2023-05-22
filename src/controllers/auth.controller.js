import { pool } from "../db.js";
import jwt from 'jsonwebtoken';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } from '../config.js';

export const login = async (req, res) => {
    try {

        const { email, password, type } = req.body
        let row = null
        if (type == 1) {
            [row] = await pool.query("SELECT * FROM user WHERE email = ?", [email])
        } else {
            [row] = await pool.query("SELECT * FROM client WHERE email = ?", [email])
        }

        if (row.length <= 0) {
            return res.json({
                message: "No se encontró el usuario"
            })
        } else {
            if (row[0].active === 0) {
                return res.json({
                    message: "Usuario desactivado"
                })
            }
        }

        const user = row[0];
        if (user.password === password) {
            const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 6400 });
            res.status(200).json({ token, success: true, user: user.id });
        } else {
            res.json({ success: false, message: 'Credenciales de inicio de sesión inválidas' });
        }
    } catch (error) {
        console.log(DB_NAME)
        console.log(DB_PORT)
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const isLogged = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.json({ message: 'No hay token' });
    }

    try {
        const verified = jwt.verify(token, 'secret');
        req.user = verified;
        res.json({ valid: 'Valido', success: true, user: verified })
    } catch (err) {
        res.json({ success: false, message: 'Token invalido' });
    }

}