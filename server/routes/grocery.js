import express from "express";
import { getGroceries } from "../controller/grocery.contoller.js";
const router = express.Router();

router.get("/", getGroceries);

export const groceryRouter = router;
