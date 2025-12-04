import mysql from "mysql2/promise";
import chalk from "chalk";

export const DATABASE_HOST = process.env.DB_HOST || "localhost";
export const DATABASE_USER = process.env.DB_USER || "root";
export const DATABASE_PASSWORD = process.env.DB_PASSWORD || "";
export const DATABASE_NAME = process.env.DB_NAME || "restaurant_db_prz";
export const DATABASE_PORT = parseInt(process.env.DB_PORT || "3306", 10);
export const DATABASE_CONNECTION_LIMIT = parseInt(
	process.env.DB_CONNECTION_LIMIT || "10",
	10
);

let pool: mysql.Pool | null = null;

export function createPool(): mysql.Pool {
	if (!pool) {
		pool = mysql.createPool({
			host: DATABASE_HOST,
			user: DATABASE_USER,
			password: DATABASE_PASSWORD,
			database: DATABASE_NAME,
			port: DATABASE_PORT,
			connectionLimit: DATABASE_CONNECTION_LIMIT,
			waitForConnections: true,
			queueLimit: 0,
		});
		console.log(chalk.greenBright("Database pool created"));
	}
	return pool;
}

export function getPool(): mysql.Pool {
	if (!pool) {
		throw new Error(
			"Database pool not initialized. Call createPool() first."
		);
	}
	return pool;
}
