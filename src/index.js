import express from 'express'
import jwt from 'jsonwebtoken'
import { pool } from './db.js'
import usersRoutes from './routes/users.routes.js'
import clientsRoutes from './routes/clients.routes.js'
import membershipRoutes from './routes/membership.routes.js'
import instructorRoutes from './routes/instructor.routes.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import membershipClientRoutes from './routes/membership_client.routes.js'
import routineRoutes from './routes/routine.routes.js'
import goalRoutes from './routes/goal.routes.js'

import { PORT } from './config.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import './libs/initialSetup.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(express.json({ limit: '50mb' }))

app.use('/api', usersRoutes)
app.use('/api', clientsRoutes)
app.use('/api', membershipClientRoutes)
app.use('/api', membershipRoutes)
app.use('/api', instructorRoutes)
app.use('/api', authRoutes)
app.use('/api', dashboardRoutes)
app.use('/api', routineRoutes)
app.use('/api', goalRoutes)

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res) => {
    res.status(404).json({
        message: 'Pagina no encontrada'
    })
})

console.log(path.join(__dirname, 'public'))
app.listen(PORT)
console.log('Server running on port', PORT)