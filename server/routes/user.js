import { UserSignUp, LoginUser } from "../controller/user.controller.js";

import express from "express";
const router = express.Router();

router.post("/signup", UserSignUp);

router.post("/login", LoginUser);

router.post("/logout", (req, res) => {
    res.json({
        message: "Logout User",
        status: 200
    });
});

export const userRouter = router;
