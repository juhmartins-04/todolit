const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexão com MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456", // Coloque sua senha aqui
  database: "todolist",
  port: 3307,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

// Criação de tabela, se não existir
connection.query(`CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  priority VARCHAR(10),
  dueDate DATETIME,
  fileName VARCHAR(255),
  done BOOLEAN DEFAULT false
)`);

// Rotas REST
app.get("/tasks", (req, res) => {
  connection.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/tasks", (req, res) => {
  const { title, description, priority, dueDate, fileName, done } = req.body;
  connection.query(
    "INSERT INTO tasks (title, description, priority, dueDate, fileName, done) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, priority, dueDate, fileName, done],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const { title, description, priority, dueDate, fileName, done } = req.body;
  connection.query(
    "UPDATE tasks SET title=?, description=?, priority=?, dueDate=?, fileName=?, done=? WHERE id=?",
    [title, description, priority, dueDate, fileName, done, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  connection.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
