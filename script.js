

// === DOM Elements ===
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const categorySelect = document.getElementById("category-select");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");

// === Load Tasks from localStorage ===
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// === Save Tasks to localStorage ===
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === Render Tasks ===
function renderTasks() {
    taskList.innerHTML = "";
    const selectedCategory = categorySelect.value;

    tasks.forEach((task, index) => {
        if (selectedCategory !== "All" && task.category !== selectedCategory) return;

        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.setAttribute("data-category", task.category);
        li.draggable = true;

        // === Editable Task Text ===
        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.disabled = true;
        input.className = "task-text";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.onclick = () => {
            input.disabled = !input.disabled;
            if (input.disabled) {
                tasks[index].text = input.value;
                saveTasks();
                renderTasks();
            } else {
                input.focus();
            }
        };

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.onclick = () => toggleComplete(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.onclick = () => deleteTask(index);

        const taskInfo = document.createElement("span");
        taskInfo.textContent = `(${task.category})`;

        const controls = document.createElement("div");
        controls.append(editBtn, completeBtn, deleteBtn);

        li.append(input, taskInfo, controls);
        taskList.appendChild(li);

        // === Drag-and-Drop Events ===
        li.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", index);
        });

        li.addEventListener("dragover", (e) => {
            e.preventDefault();
            li.style.boxShadow = "0 0 10px var(--accent)";
        });

        li.addEventListener("dragleave", () => {
            li.style.boxShadow = "";
        });

        li.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedIndex = e.dataTransfer.getData("text/plain");
            const droppedIndex = index;

            const draggedTask = tasks[draggedIndex];
            tasks.splice(draggedIndex, 1);
            tasks.splice(droppedIndex, 0, draggedTask);

            saveTasks();
            renderTasks();
        });
    });
}

// === Add New Task ===
function addTask(e) {
    e.preventDefault();
    const newTask = {
        text: taskInput.value,
        category: taskCategory.value,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
}

// === Toggle Completion ===
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// === Delete Task ===
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// === Theme Toggle ===
themeToggle.addEventListener("click", () => {
    const isLight = document.body.getAttribute("data-theme") === "light";
    document.body.setAttribute("data-theme", isLight ? "dark" : "light");
    localStorage.setItem("theme", isLight ? "dark" : "light");
});

// === Load Saved Theme ===
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", savedTheme);

// === Event Listeners ===
taskForm.addEventListener("submit", addTask);
categorySelect.addEventListener("change", renderTasks);

// === Initial Render ===
renderTasks();

