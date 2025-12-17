import express from "express";
import * as Reward from "../database/models/Reward.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get user's rewards summary
router.get("/rewards", requireAuth, async (req, res) => {
	try {
		const userId = req.session.userId!;

		const rewards = await Reward.getUserRewards(userId);
		const availableTotal = await Reward.getTotalAvailableRewards(userId);

		return res.json({
			rewards,
			availableTotal,
		});
	} catch (error) {
		console.error("Get rewards error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Get available reward balance only
router.get("/rewards/balance", requireAuth, async (req, res) => {
	try {
		const userId = req.session.userId!;
		const availableTotal = await Reward.getTotalAvailableRewards(userId);

		return res.json({ balance: availableTotal });
	} catch (error) {
		console.error("Get rewards balance error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
