const express = require("express");
const {
	getUserById,
	followOrUnfollowUser,
	deleteAccount,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/:id", getUserById);

router.put("/:id", followOrUnfollowUser);

router.delete("/:id", deleteAccount);

module.exports = router;
