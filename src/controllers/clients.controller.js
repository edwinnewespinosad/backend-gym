import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { pool } from "../db.js";
import config from '../config/firebase.config.js';
import { initializeApp } from "firebase/app";

initializeApp(config.firebaseConfig)

const storage = getStorage();

export const getClients = async (req, res) => {
    try {

        const [rows] = await pool.query(`
        SELECT c.id,c.image, c.name, c.last_name, c.email, c.phone, c.active, c.fk_id_role_user, c.created_at, m.fk_id_membership, me.name as membership_name, me.duration as membership_duration, m.price, m.created_at AS latest_purchase_date 
        FROM client AS c 
        LEFT JOIN (
            SELECT fk_id_client, fk_id_membership, price, created_at
            FROM membership_purchase
            WHERE (fk_id_client, created_at) IN (
                SELECT fk_id_client, MAX(created_at)
                FROM membership_purchase
                GROUP BY fk_id_client
            )
        ) AS m ON c.id = m.fk_id_client
        LEFT JOIN membership as me ON me.id = m.fk_id_membership;
        `);

        res.json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getClient = async (req, res) => {
    try {

        const [row] = await pool.query("SELECT * FROM client WHERE id = ?", [req.params.id])
        if (row.length <= 0) return res.status(404).json({
            message: "No se encontró el cliente"
        })
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getMembershipClient = async (req, res) => {
    try {
        const [row] = await pool.query(`
        SELECT c.id, c.name, c.last_name, c.email, c.phone, c.active, c.fk_id_role_user, c.created_at, m.fk_id_membership, me.name as membership_name, me.duration as membership_duration, m.price, m.created_at AS latest_purchase_date 
        FROM client AS c 
        LEFT JOIN (
            SELECT fk_id_client, fk_id_membership, price, created_at
            FROM membership_purchase
            WHERE (fk_id_client, created_at) IN (
                SELECT fk_id_client, MAX(created_at)
                FROM membership_purchase
                GROUP BY fk_id_client
            )
        ) AS m ON c.id = m.fk_id_client
        LEFT JOIN membership as me ON me.id = m.fk_id_membership
        WHERE c.id = ?;
        `, [req.params.id]);
        if (row.length <= 0) return res.status(404).json({
            message: "No se encontró membresia"
        })
        res.json(row[0]);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createClient = async (req, res) => {
    try {
        // Upload to Firebase
        const ext = req.file.originalname.split('.').pop()

        const storageRef = ref(storage, `files/${Date.now()}.${ext}`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);

        const { name, last_name, email, password, phone } = req.body

        // const image = req.file.path
        const [rows] = await pool.query('INSERT INTO client (name,last_name,image,email,password,phone,fk_id_role_user) VALUES (?, ?, ?, ?, ?, ?, 2)', [name, last_name, downloadURL, email, password, phone])

        res.send({ rows, success: true })
    } catch (error) {
        if (error.sqlMessage.includes('Duplicate')) {
            return res.send({
                duplicated: true,
                message: 'Ya hay una cuenta registrada con este correo'
            })
        } else {
            return res.send({
                message: 'Algo fue mal :('
            })
        }
    }
};

export const deleteClient = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM client WHERE id = ?', [req.params.id]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: "No se encontró el usuario"
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params
        const { name, last_name, email, password, phone } = req.body
        const image = req.file !== undefined ? req.file.path : undefined
        console.log(req.body);
        console.log(req.file);
        const [result] = await pool.query(
            'UPDATE client SET name =?, last_name =?, image =IFNULL(?,image), email =?, password = IFNULL(?,password), phone=? WHERE id =?',
            [name, last_name, image, email, password, phone, id]
        )

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró el usuario"
        })

        res.send('Actualizado correctamente')
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const statusClient = async (req, res) => {
    try {

        const [user] = await pool.query('SELECT * FROM client WHERE id = ?', [req.params.id]);
        const state = user[0].active
        const [result] = await pool.query('UPDATE client SET active = ? WHERE id = ?', [!state, req.params.id]);

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró el cliente"
        })

        res.send({ message: 'Actualizado correctamente', success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createClientGoal = async (req, res) => {
    try {
        const { category, description, fk_id_client } = req.body
        const [rows] = await pool.query('INSERT INTO goals (category,description,fk_id_client) VALUES (?, ?, ?)', [category, description, fk_id_client])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getClientGoals = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM goals WHERE fk_id_client = ? ORDER BY id desc", [req.params.id]);
        if (rows.length <= 0) return res.send({
            message: "No se encontraron metas"
        })
        res.json({ rows, success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createClientRoutine = async (req, res) => {
    try {
        const { day, series, repetitions, weight, fk_id_client, fk_id_routine } = req.body
        const [rows] = await pool.query('INSERT INTO client_has_routine (day, series, repetitions, weight, fk_id_client, fk_id_routine) VALUES (?, ?, ?,?,?,?)', [day, series, repetitions, weight, fk_id_client, fk_id_routine])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getClientRoutines = async (req, res) => {
    try {
        const [rows] = await pool.query(`

        SELECT client_has_routine.id, client_has_routine.day, client_has_routine.fk_id_routine, 
        client_has_routine.fk_id_client, client_has_routine.series, client_has_routine.repetitions, client_has_routine.weight, routine.name
        from client_has_routine
        left join routine
        on client_has_routine.fk_id_routine = routine.id
        WHERE client_has_routine.fk_id_client = ?
        ORDER by client_has_routine.id DESC
        `, [req.params.id]);
        if (rows.length <= 0) return res.send({
            message: "No se encontraron rutinas"
        })
        res.json({ rows });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createPhotoClient = async (req, res) => {
    try {
        const { fk_id_client } = req.body
        // Upload to Firebase
        const ext = req.file.originalname.split('.').pop()

        const storageRef = ref(storage, `files/client/${fk_id_client}/${Date.now()}.${ext}`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);

        const [rows] = await pool.query('INSERT INTO client_has_photos (image, fk_id_client) VALUES (?, ?)', [downloadURL, fk_id_client])

        res.send({ rows, success: true })
    } catch (error) {
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const getClientPhotos = async (req, res) => {
    try {

        const [rows] = await pool.query("SELECT * FROM client_has_photos WHERE fk_id_client = ? ORDER BY id desc", [req.params.id])
        if (rows.length <= 0) return res.send({
            message: "Aún no hay imagenes"
        })
        res.json({ rows, success: true });
    } catch (error) {
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const createClientSizes = async (req, res) => {
    try {
        const { date, weight, height, chest, waist, thigh, bicep, fk_id_client } = req.body

        let imc = weight / (height * height);

        const [rows] = await pool.query('INSERT INTO client_has_sizes (date, weight, height, chest, waist, thigh, bicep, imc, fk_id_client) VALUES (?, ?, ?,?,?,?,?,?,?)', [date, weight, height, chest, waist, thigh, bicep, imc, fk_id_client])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        if (error.sqlMessage.includes('height')) {
            return res.send({
                height: true,
                message: 'Verifica la altura'
            })
        } else {
            return res.send({
                message: 'Algo fue mal :('
            })
        }
    }
};

export const getClientSizes = async (req, res) => {
    try {

        const [rows] = await pool.query("SELECT * FROM client_has_sizes WHERE fk_id_client = ? ORDER BY id desc", [req.params.id])
        if (rows.length <= 0) return res.send({
            message: "Aún no hay medidas registradas"
        })
        res.json({ rows, success: true });
    } catch (error) {
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};