
/* =========================
   1. SELECT HTML ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");


/* =========================
   2. CREATE TASKS ARRAY
========================= */

let tasks = [];
let currentFilter = "all";

/* =========================
   3. ADD TASK
========================= */

function addTask() {

    // Get task title
    const title = taskInput.value.trim();
    if (title.length > 100) {
    alert("Task title cannot exceed 100 characters!");
    return;
}

    // Prevent empty tasks
    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    // Create task object
    const task = {
        id: crypto.randomUUID(),
        title: title,
        priority: priorityInput.value,
        completed: false
    };

    // Add task to array
    tasks.push(task);
    saveTasks();

    // Clear input
    taskInput.value = "";

    // Display updated tasks
    displayTasks();

}


/* =========================
   4. DISPLAY TASKS
========================= */


/* =========================
   4. DISPLAY TASKS
========================= */

function displayTasks() {

    // Clear previous display
    taskList.innerHTML = "";

    // Filter tasks based on selected filter
    let filteredTasks = tasks.filter(function(task) {
        
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    // Show empty state
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.className = "empty-state";

        if (tasks.length === 0) {
            emptyMessage.textContent = "No tasks yet. Add your first task!";
        }
        else if (currentFilter === "active") {
            emptyMessage.textContent = "No active tasks. Great job!";
        }
        else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        }
        else {
            emptyMessage.textContent = "No tasks found.";
        }

        taskList.appendChild(emptyMessage);

    }

    // Display filtered tasks
    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const priority = document.createElement("span");
        priority.className = "priority " + task.priority;
        priority.textContent = task.priority;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Done";

        completeBtn.addEventListener("click", function() {
            toggleTask(task.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(title);
        li.appendChild(priority);
        li.appendChild(actions);

        taskList.appendChild(li);

    });

    // Update remaining task count
    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCounter.textContent = remainingTasks + " tasks remaining";

}



/* =========================
   5. BUTTON EVENT
========================= */

addTaskBtn.addEventListener("click", addTask);


/* =========================
   6. ENTER KEY EVENT
========================= */

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Initial display
displayTasks();
/* =========================
   7. COMPLETE / UNDO TASK
========================= */

function toggleTask(id) {

    // Find the selected task
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    // Change completion status
    task.completed = !task.completed;
    saveTasks();

    // Refresh task display
    displayTasks();

}
/* =========================
   8. DELETE TASK
========================= */

function deleteTask(id) {

    // Remove selected task from array
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    saveTasks();

    // Refresh task display
    displayTasks();

}

/* =========================
   9. FILTER BUTTONS
========================= */

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get selected filter
        currentFilter = button.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Highlight selected button
        button.classList.add("active");

        // Display filtered tasks
        displayTasks();

    });

});

/* =========================
   10. SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

/* =========================
   11. LOAD TASKS
========================= */

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks !== null) {
        try {
            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks;
            } else {
                tasks = [];
            }

        } catch (error) {
            console.error("Unable to load saved tasks:", error);
            tasks = [];
        }
    }

}
/* =========================
   12. INITIALIZE APPLICATION
========================= */

loadTasks();
displayTasks();