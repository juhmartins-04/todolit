const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

const API = 'http://localhost:3000/api/tasks';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  input.value = '';
  loadTasks();
});

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>
        ${task.title}
      </span>
      <button onclick="deleteTask(${task.id})">🗑️</button>
    `;
    list.appendChild(li);
  });
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

loadTasks();