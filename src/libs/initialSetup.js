import { ADMIN_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE } from "../config.js";
import { pool } from "../db.js";

export const createRoles = async (req, res) => {
    try {

        const [count] = await pool.query("SELECT COUNT(*) as total FROM role_user")

        if (count[0].total > 0) {
            return
        } else {
            const [rows] = await pool.query('INSERT INTO role_user (name) VALUES (?)',
                ['Administrador'])
            const [rows1] = await pool.query('INSERT INTO role_user (name) VALUES (?)',
                ['Cliente'])
            console.log(rows);
            console.log(rows1);
        }
    } catch (error) {
        console.log(error)
    }
};

export const createUsers = async (req, res) => {
    try {

        const [count] = await pool.query("SELECT COUNT(*) as total FROM user WHERE fk_id_role_user = 1")

        if (count[0].total > 0) {
            return
        } else {
            const [rows] = await pool.query('INSERT INTO user (name,last_name,email,password,fk_id_role_user) VALUES (?, ?, ?, ?, ?)',
                [ADMIN_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE])
            console.log(rows);
        }
    } catch (error) {
        console.log(error)
    }
};

createRoles();
createUsers();