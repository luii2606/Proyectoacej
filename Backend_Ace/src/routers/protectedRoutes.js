import express from "express";
// import { verifyToken } from "../middlewares/auth/veririfyToken.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.json({ success: true, message: "Bienvenido a la zona protegida" });
});

export default router;