import { config } from "dotenv";

config()

export const PORT = process.env.PORT || 3000

export const DB_PORT = process.env.DB_PORT || 6210
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'root'
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_NAME = process.env.DB_NAME || 'gym'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const ADMIN_NAME = process.env.ADMIN_NAME
export const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME
export const ADMIN_ROLE = process.env.ADMIN_ROLE