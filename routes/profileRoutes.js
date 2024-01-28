import express from "express";
import {
	getUserById,
	followOrUnfollowUser,
	deleteAccount,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/:id", getUserById);

router.put("/:id", followOrUnfollowUser);

router.delete("/:id", deleteAccount);

export default router;
