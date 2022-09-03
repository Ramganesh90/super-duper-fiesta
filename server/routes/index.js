import express from "express";
import { userRouter } from "./user.js";
import { groceryRouter } from "./grocery.js";

const router = express.Router();
router.use("/user", userRouter);
router.use("/grocery", groceryRouter);

export default router;
