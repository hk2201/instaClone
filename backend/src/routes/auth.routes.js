import express from "express";
import { signup, login, googlelogin } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/v1/auth/signup
router.post("/signup", signup);

// POST /api/v1/auth/login
router.post("/login", login);

router.post("/googlelogin", googlelogin);

export default router;
