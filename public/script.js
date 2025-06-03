const API = "http://localhost:3000/api/tasks";
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

// ✅ Carrega as tarefas ao iniciar
window.addEventListener("DOMContentLoaded", loadTasks);

// ➕ Adiciona nova tarefa
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  input.value = "";
  loadTasks();
});

// 🔁 Função para carregar todas as tarefas
async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task.title;
    if (task.completed) taskText.style.textDecoration = "line-through";
    taskText.style.cursor = "pointer";

    taskText.addEventListener("click", () => toggleTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// ✅ Alternar status concluído da tarefa
async function toggleTask(id) {
  await fetch(`${API}/${id}/toggle`, { method: "PUT" });
  loadTasks();
}

// ❌ Deletar tarefa
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}
