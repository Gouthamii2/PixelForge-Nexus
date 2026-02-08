import pool from "../config/db.js";

export const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, status, deadline FROM projects ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProject = async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO projects (name, description, deadline, status) VALUES ($1,$2,$3,$4)",
      ["Demo Project", "Created from dashboard", "2026-03-01", "ACTIVE"]
    );

    res.json({ message: "Project created" });
  } catch (err) {
    console.error("❌ Create project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
