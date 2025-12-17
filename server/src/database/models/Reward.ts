import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "../connection.js";

export interface RewardData {
	id: number;
	user_id: number;
	amount: number;
	from_order_id: number;
	used: boolean;
	used_on_order_id: number | null;
	created_at: Date;
}

// Calculate reward amount: £2 for every £10 spent
export function calculateRewardAmount(orderTotal: number): number {
	if (orderTotal < 10) return 0;
	return Math.floor(orderTotal / 10) * 2;
}

export async function createReward(
	userId: number,
	amount: number,
	fromOrderId: number
): Promise<number> {
	const pool = getPool();

	const [result] = await pool.query<ResultSetHeader>(
		"INSERT INTO rewards (user_id, amount, from_order_id) VALUES (?, ?, ?)",
		[userId, amount, fromOrderId]
	);

	return result.insertId;
}

export async function getUserRewards(userId: number): Promise<RewardData[]> {
	const pool = getPool();

	const [rows] = await pool.query<RowDataPacket[]>(
		"SELECT * FROM rewards WHERE user_id = ? ORDER BY created_at DESC",
		[userId]
	);

	return rows as RewardData[];
}

export async function getAvailableRewards(
	userId: number
): Promise<RewardData[]> {
	const pool = getPool();

	const [rows] = await pool.query<RowDataPacket[]>(
		"SELECT * FROM rewards WHERE user_id = ? AND used = FALSE ORDER BY created_at ASC",
		[userId]
	);

	return rows as RewardData[];
}

export async function getTotalAvailableRewards(
	userId: number
): Promise<number> {
	const pool = getPool();

	const [rows] = await pool.query<RowDataPacket[]>(
		"SELECT COALESCE(SUM(amount), 0) as total FROM rewards WHERE user_id = ? AND used = FALSE",
		[userId]
	);

	return Number(rows[0].total) || 0;
}

export async function useRewards(
	userId: number,
	amountToUse: number,
	onOrderId: number
): Promise<number> {
	const pool = getPool();

	// Get available rewards ordered by oldest first
	const available = await getAvailableRewards(userId);

	let remaining = amountToUse;
	let totalUsed = 0;

	for (const reward of available) {
		if (remaining <= 0) break;

		const useAmount = Math.min(reward.amount, remaining);

		if (useAmount === reward.amount) {
			// Use entire reward
			await pool.query<ResultSetHeader>(
				"UPDATE rewards SET used = TRUE, used_on_order_id = ? WHERE id = ?",
				[onOrderId, reward.id]
			);
		} else {
			// Partial use: mark current as used and create new reward with remainder
			await pool.query<ResultSetHeader>(
				"UPDATE rewards SET used = TRUE, used_on_order_id = ?, amount = ? WHERE id = ?",
				[onOrderId, useAmount, reward.id]
			);

			// Create new reward with remaining amount
			await pool.query<ResultSetHeader>(
				"INSERT INTO rewards (user_id, amount, from_order_id) VALUES (?, ?, ?)",
				[userId, reward.amount - useAmount, reward.from_order_id]
			);
		}

		remaining -= useAmount;
		totalUsed += useAmount;
	}

	return totalUsed;
}

export async function getRewardById(
	rewardId: number
): Promise<RewardData | null> {
	const pool = getPool();

	const [rows] = await pool.query<RowDataPacket[]>(
		"SELECT * FROM rewards WHERE id = ?",
		[rewardId]
	);

	if (rows.length === 0) return null;

	return rows[0] as RewardData;
}
