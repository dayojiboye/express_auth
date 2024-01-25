const express = require("express");
const {
	getUserById,
	likeOrDislikeProfile,
	deleteAccount,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/:id", getUserById);

router.put("/:id", likeOrDislikeProfile);

router.delete("/:id", deleteAccount);

module.exports = router;
