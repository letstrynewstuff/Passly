// src/routes/location.routes.js
import express from "express";
import { getStates, getCities } from "../controllers/location.controller.js";

const router = express.Router();

router.get("/states", getStates);
router.get("/cities", getCities);

export default router;
