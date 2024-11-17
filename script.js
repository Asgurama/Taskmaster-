let authToken = '';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterButton = document.getElementById('show-register');
    const showLoginButton = document.getElementById('show-login');
    const taskContainer = document.getElementById('task-container');
    const authContainer = document.getElementById('auth-container');
    const createTaskBtn = document.getElementById('create-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeTaskModal = document.getElementById('close-task-modal');
    const taskList = document.getElementById('task-list');
    const logoutButton = document.getElementById('logout');
    const searchBar = document.getElementById('search-bar');
    const taskForm = document.getElementById('task-form');

    // Show register form
    showRegisterButton.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.getElementById('auth-header').textContent = 'Register';
    });

    // Show login form
    showLoginButton.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('auth-header').textContent = 'Login';
    });

    // Register a new user
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            showLoginButton.click();
        }
    });

    // Login the user
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            authToken = data.token;
            authContainer.style.display = 'none';
            taskContainer.style.display = 'block';
            loadTasks();
        } else {
            alert(data.message);
        }
    });

    // Create new task
    createTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'block';
    });

    // Close task modal
    closeTaskModal.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('task-name').value;
        const description = document.getElementById('task-description').value;
        const deadline = document.getElementById('task-deadline').value;
        const priority = document.getElementById('task-priority').value;

        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, description, deadline, priority })
        });

        const data = await response.json();
        if (response.ok) {
            loadTasks();
            taskModal.style.display = 'none';
        } else {
            alert(data.message);
        }
    });

    // Logout the user
    logoutButton.addEventListener('click', () => {
        authToken = '';
        taskContainer.style.display = 'none';
        authContainer.style.display = 'block';
    });

    // Load tasks
    const loadTasks = async () => {
        const response = await fetch('http://localhost:5000/api/tasks', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const tasks = await response.json();
        displayTasks(tasks);
    };

    const displayTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            taskElement.innerHTML = `
                <div>
                    <strong>${task.name}</strong><br>
                    <span>${task.description}</span><br>
                    <span>Deadline: ${task.deadline}</span><br>
                    <span>Priority: ${task.priority}</span>
                </div>
                <div>
                    <button onclick="deleteTask('${task._id}')">Delete</button>
                    <button onclick="editTask('${task._id}')">Edit</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    };

    // Delete task
    window.deleteTask = async (taskId) => {
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            loadTasks();
        } else {
            alert(data.message);
        }
    };
});
