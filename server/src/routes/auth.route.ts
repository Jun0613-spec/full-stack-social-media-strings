import express from "express";

import { login, logout, register } from "../controllers/auth.controller";
import {
  getGoogleAUthURL,
  googleCallback
} from "../controllers/oauth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google", getGoogleAUthURL);
router.get("/callback/google", googleCallback);

export default router;
