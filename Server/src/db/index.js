import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";
import * as schema from "../models/schema.js";

dotenv.config();

const connectionConfig = process.env.DATABASE_URL
  ? { 
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
    };

const connection = await mysql.createConnection(connectionConfig);

export const db = drizzle(connection, { schema, mode: "default" });