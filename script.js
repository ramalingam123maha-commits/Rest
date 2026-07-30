// Task Manager Script
let tasks = [];
let filter = 'all';
const listEl = document.getElementById('task-list');
const inputEl = document.getElementById('new-task-input');
const addBtn = document.getElementById('add-task-btn');
const filters = document.querySelectorAll('.filter-btn');
const counterEl = document.getElementById('task-counter');
const themeToggle = document.getElementById('theme-toggle');

// Load from localStorage
function load() {
  const stored = localStorage.getItem('tasks');
  tasks = stored ? JSON.parse(stored) : [];
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark');
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  listEl.innerHTML = '';
  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-card' + (t.completed ? ' completed' : '');
    li.draggable = true;
    li.dataset.id = t.id;

    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = t.completed;
    chk.addEventListener('change', () => toggleComplete(t.id));

    const span = document.createElement('span');
    span.textContent = t.text;

    const del = document.createElement('button');
    del.textContent = '✕';
    del.className = 'delete';
    del.addEventListener('click', () => deleteTask(t.id));

    li.append(chk, span, del);
    listEl.appendChild(li);

    // Drag events
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
  });

  // Drag over container
  listEl.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const after = getDragAfter(e.clientY);
    if (after == null) listEl.appendChild(dragging);
    else listEl.insertBefore(dragging, after);
  });

  updateOrder();
  updateCounter();
}

function getDragAfter(y) {
  const items = [...listEl.querySelectorAll('.task-card:not(.dragging)')];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateOrder() {
  const newOrder = [];
  listEl.querySelectorAll('.task-card').forEach(li => {
    const id = li.dataset.id;
    const task = tasks.find(t => t.id === id);
    if (task) newOrder.push(task);
  });
  tasks = newOrder;
  save();
}

function addTask() {
  const text = inputEl.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now().toString(), text, completed: false });
  inputEl.value = '';
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save();
  render();
}

function updateCounter() {
  const left = tasks.filter(t => !t.completed).length;
  counterEl.textContent = `${left} task${left !== 1 ? 's' : ''} left`;
}

// Filter handlers
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

addBtn.addEventListener('click', addTask);
inputEl.addEventListener('keyup', e => {
  if (e.key === 'Enter') addTask();
});

// Init
load();
render();