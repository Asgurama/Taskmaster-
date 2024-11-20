// Mock user data
let currentUser = null;

// Task data
let tasks = [];

// Check if a user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Show the register page
function showRegisterPage() {
    document.getElementById('registerPage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
}

// Show the login page
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('registerPage').style.display = 'none';
}

// Handle user registration
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const user = { username, password };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Registration successful!');
    showLoginPage();
});

// Handle user login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username === username && storedUser.password === password) {
        currentUser = storedUser;
        loadTasks();
        showTaskPage();
    } else {
        alert('Invalid login credentials');
    }
});

// Show task management page
function showTaskPage() {
    document.getElementById('taskPage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
}

// Load tasks from localStorage
function loadTasks() {
    const tasksData = localStorage.getItem('tasks');
    tasks = tasksData ? JSON.parse(tasksData) : [];
    displayTasks();
}

// Display tasks
function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <button class="edit" onclick="editTask(${index})">Edit</button>
            <button class="delete" onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(taskDiv);
    });
}

// Create new task
function showCreateTaskModal() {
    document.getElementById('createTaskModal').style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('createTaskModal').style.display = 'none';
}

document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;

    const task = { title, description, deadline, priority };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks();
    closeTaskModal();
});

// Edit task
function editTask(index) {
    const task = tasks[index];
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDeadline').value = task.deadline;
    document.getElementById('taskPriority').value = task.priority;

    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    showCreateTaskModal();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Search tasks
function searchTasks() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery) || 
        task.description.toLowerCase().includes(searchQuery)
    );
    displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(filteredTasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <button class="edit" onclick="editTask(${index})">Edit</button>
            <button class="delete" onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(taskDiv);
    });
}
