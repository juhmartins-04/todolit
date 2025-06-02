
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const taskList = document.getElementById("task-list");
  const themeToggle = document.querySelector(".theme-toggle");
  const sortTasks = document.getElementById("sort-tasks");
  const priorityFilter = document.getElementById("filter-priority");

  let tasks = [];

  // Load saved theme
  if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-mode");
  }

  // Toggle Theme
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
  });

  // Fetch tasks from backend
  async function fetchTasks() {
    const res = await fetch("http://localhost:3000/tasks");
    tasks = await res.json();
    renderTasks();
  }

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const priority = form.priority.value;
    const dueDate = form.due.value;
    const file = form.file.files[0];

    if (title === "") return;

    const task = {
      title,
      description,
      priority,
      dueDate,
      fileName: file ? file.name : null,
      done: false,
    };

    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    fetchTasks();
    form.reset();
  });

  function renderTasks() {
    taskList.innerHTML = "";
    let filtered = [...tasks];

    if (priorityFilter.value !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter.value);
    }

    if (sortTasks.value === "date") {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortTasks.value === "priority") {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    filtered.forEach(task => {
      const div = document.createElement("div");
      div.className = `task ${task.priority} ${task.done ? "done" : ""}`;

      div.innerHTML = `
        <h3 contenteditable="true" oninput="updateTaskTitle(${task.id}, this.innerText)">${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Prazo:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleString() : "Nenhum"}</p>
        ${task.fileName ? `<p><strong>Anexo:</strong> ${task.fileName}</p>` : ""}
        <button onclick="toggleDone(${task.id})">${task.done ? "Desfazer" : "Concluir"}</button>
        <button onclick="deleteTask(${task.id})">Excluir</button>
      `;

      taskList.appendChild(div);
    });
  }

  window.toggleDone = async function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      fetchTasks();
    }
  };

  window.deleteTask = async function(id) {
    await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  window.updateTaskTitle = async function(id, newTitle) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.title = newTitle;
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
    }
  };

  fetchTasks();
});
