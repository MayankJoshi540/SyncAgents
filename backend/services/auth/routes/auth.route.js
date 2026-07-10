import express from "express";

import {
    login,
    logOut,
    getCurrentUser,
    deductCredits
} from "../controllers/auth.controller.js";

const router =
express.Router();

router.post("/login",login);
router.post("/logout",logOut);
router.get("/currentuser",getCurrentUser);      
router.patch("/internal/deduct-credits",deductCredits);


export default router;