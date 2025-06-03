const express = require("express");
const db = require("./db");

const router = express.Router();

// 📝 Listar todas as tarefas
router.get("/tasks", (req, res) => {
  const query = "SELECT * FROM tasks ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ➕ Criar nova tarefa
router.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Título é obrigatório" });

  const query = "INSERT INTO tasks (title) VALUES (?)";
  db.query(query, [title], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, title, completed: false });
  });
});

// 🗑️ Deletar tarefa
router.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204); // No Content
  });
});

// ✅ Marcar tarefa como concluída
router.put("/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE tasks SET completed = NOT completed WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

module.exports = router;
