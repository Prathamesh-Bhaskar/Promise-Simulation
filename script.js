// app.js

// Select the button, task queue, backend log container, and promise lifecycle elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskQueue = document.getElementById('taskQueue');
const logList = document.getElementById('logList');
const completedTaskList = document.getElementById('completedTaskList');
const transitionLog = document.getElementById('transitionLog');

// Promise lifecycle state elements
const pendingState = document.getElementById('pendingState');
const fulfilledState = document.getElementById('fulfilledState');
const rejectedState = document.getElementById('rejectedState');

// Example tasks for real-life scenarios
const exampleTasks = [
    { id: 1, name: "Ordering a Pizza" },
    { id: 2, name: "Booking a Flight" },
    { id: 3, name: "Downloading a File" },
    { id: 4, name: "Sending an Email" },
    { id: 5, name: "Getting a Loan Approval" }
];

let taskCounter = 0;

// Function to create a new task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task pending';
    taskElement.innerHTML = `
        <div class="header">${task.name}</div>
        <div class="status">Status: Pending...</div>
        <div class="step">Step: Task Created</div>
        <span>Pending</span>
    `;
    taskQueue.appendChild(taskElement);
    logAction(`Promise for ${task.name} created and pending resolution.`);
    return taskElement;
}

// Function to update promise lifecycle visualization
function updateLifecycle(state) {
    pendingState.style.display = state === 'pending' ? 'block' : 'none';
    fulfilledState.style.display = state === 'fulfilled' ? 'block' : 'none';
    rejectedState.style.display = state === 'rejected' ? 'block' : 'none';
}

// Function to log promise transitions
function logTransition(message) {
    transitionLog.textContent += message + '\n';
}

// Function to process a task (returns a promise)
function processTask(taskElement, task) {
    updateLifecycle('pending');
    return new Promise((resolve, reject) => {
        logAction(`Promise for ${task.name} is now processing.`);
        logTransition(`Promise for ${task.name} entered 'pending' state.`);

        // Simulate task processing time with a random delay
        const processingTime = Math.random() * 2000 + 1000; // 1 to 3 seconds

        setTimeout(() => {
            const shouldFail = Math.random() > 0.8; // 20% chance of failure

            if (shouldFail) {
                taskElement.className = 'task error';
                taskElement.querySelector('.status').innerText = 'Status: Failed';
                taskElement.querySelector('.step').innerText = `Step: Promise rejected after ${Math.round(processingTime / 1000)} seconds`;
                taskElement.querySelector('span').innerText = 'Failed';
                updateLifecycle('rejected');
                logTransition(`Promise for ${task.name} entered 'rejected' state.`);
                logAction(`Promise for ${task.name} was rejected after ${Math.round(processingTime / 1000)} seconds due to an error.`);
                reject(`Promise for ${task.name} was rejected.`);
            } else {
                taskElement.className = 'task completed';
                taskElement.querySelector('.status').innerText = 'Status: Completed';
                taskElement.querySelector('.step').innerText = `Step: Promise resolved after ${Math.round(processingTime / 1000)} seconds`;
                taskElement.querySelector('span').innerText = 'Completed';
                updateLifecycle('fulfilled');
                logTransition(`Promise for ${task.name} entered 'fulfilled' state.`);
                logAction(`Promise for ${task.name} resolved successfully after ${Math.round(processingTime / 1000)} seconds.`);
                resolve(`Promise for ${task.name} resolved.`);
            }
        }, processingTime);
    });
}

// Function to add a task
function addTask() {
    const task = exampleTasks[taskCounter % exampleTasks.length];
    taskCounter++;
    const taskElement = createTaskElement(task);
    
    processTask(taskElement, task)
        .then(result => {
            logAction(`Promise for ${task.name} entered the 'fulfilled' state.`);
            console.log(result);
            // Add the completed task to the sidebar
            const completedTaskElement = document.createElement('li');
            completedTaskElement.textContent = `Task Completed: ${task.name}`;
            completedTaskList.appendChild(completedTaskElement);
        })
        .catch(error => {
            logAction(`Promise for ${task.name} entered the 'rejected' state.`);
            console.error(error);
        });
}

// Function to log actions related to promises in the backend log
function logAction(message) {
    const logEntry = document.createElement('li');
    logEntry.innerText = message;
    logList.appendChild(logEntry);
    logList.scrollTop = logList.scrollHeight; // Auto-scroll to the latest log
}

// Add event listener to the "Add Task" button
addTaskBtn.addEventListener('click', addTask);
