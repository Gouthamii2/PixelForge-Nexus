import express from "express";
import pool from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   GET ALL PROJECTS
================================ */
router.get("/all", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM projects ORDER BY id DESC"
  );
  res.json(result.rows);
});

/* ===============================
   GET PROJECT BY ID  ✅
================================ */
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(result.rows[0]);
});

/* ===============================
   CREATE PROJECT  ✅
================================ */
router.post("/", authMiddleware, async (req, res) => {
  const { name, deadline, status } = req.body;

  const result = await pool.query(
    `INSERT INTO projects (name, deadline, status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, deadline, status || "ACTIVE"]
  );

  res.json(result.rows[0]);
});

/* ===============================
   UPDATE PROJECT STATUS (PATCH) ✅
================================ */
router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await pool.query(
    "UPDATE projects SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(result.rows[0]);
});

/* ===============================
   DELETE PROJECT  ✅
================================ */
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM projects WHERE id = $1",
    [id]
  );

  res.json({ message: "Project archived successfully" });
});

export default router;
