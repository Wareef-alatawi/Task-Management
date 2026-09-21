// ===============================
// الوصول إلى عناصر HTML
// ===============================

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const priorityInput = document.getElementById("priority");
const taskDateInput = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompletedButton = document.getElementById("clearCompleted");

// ===============================
// متغيرات التطبيق
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// ===============================
// حفظ المهام في المتصفح
// ===============================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===============================
// عرض المهام
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function (task) {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(function (task) {

        const taskItem = document.createElement("li");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskItem.classList.add("priority-" + task.priority);

        const taskInfo = document.createElement("div");

        taskInfo.className = "task-info";

        const taskTitle = document.createElement("div");

        taskTitle.className = "task-title";

        taskTitle.textContent = task.title;

        const taskMeta = document.createElement("div");

        taskMeta.className = "task-meta";

        let priorityText = "عادية";

        if (task.priority === "high") {
            priorityText = "مهمة جدًا";
        }

        if (task.priority === "low") {
            priorityText = "منخفضة";
        }

        taskMeta.textContent =
            "الأولوية: " + priorityText +
            (task.date ? " | التاريخ: " + task.date : "");

        taskInfo.appendChild(taskTitle);

        taskInfo.appendChild(taskMeta);

        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";

        const completeButton = document.createElement("button");

        completeButton.className = "complete-button";

        completeButton.textContent =
            task.completed ? "تراجع" : "إكمال";

        completeButton.addEventListener("click", function () {

            toggleTask(task.id);

        });

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.textContent = "حذف";

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });

        taskActions.appendChild(completeButton);

        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskInfo);

        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);

    });

    updateStats();

}

// ===============================
// إضافة مهمة جديدة
// ===============================

function addTask() {

    const title = taskInput.value.trim();

    const priority = priorityInput.value;

    const date = taskDateInput.value;

    if (title === "") {

        alert("اكتبي اسم المهمة أولًا");

        return;
    }

    const newTask = {

        id: Date.now(),

        title: title,

        priority: priority,

        date: date,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    priorityInput.value = "normal";

    taskDateInput.value = "";

}

addTaskButton.addEventListener("click", addTask);

// السماح بالإضافة باستخدام زر Enter

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});

// ===============================
// إكمال المهمة أو التراجع عنها
// ===============================

function toggleTask(taskId) {

    tasks = tasks.map(function (task) {

        if (task.id === taskId) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();

}

// ===============================
// حذف مهمة
// ===============================

function deleteTask(taskId) {

    const confirmed = confirm("هل أنتِ متأكدة من حذف المهمة؟");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(function (task) {

        return task.id !== taskId;

    });

    saveTasks();

    renderTasks();

}

// ===============================
// تحديث الإحصائيات
// ===============================

function updateStats() {

    const completed = tasks.filter(function (task) {

        return task.completed;

    }).length;

    const pending = tasks.length - completed;

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}

// ===============================
// فلاتر المهام
// ===============================

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (item) {

            item.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// ===============================
// حذف المهام المكتملة
// ===============================

clearCompletedButton.addEventListener("click", function () {

    const confirmed = confirm("حذف جميع المهام المكتملة؟");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(function (task) {

        return !task.completed;

    });

    saveTasks();

    renderTasks();

});

// ===============================
// الساعة والتاريخ
// ===============================

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("ar-SA", {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    });

    const date = now.toLocaleDateString("ar-SA", {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    });

    document.getElementById("clock").textContent = time;

    document.getElementById("date").textContent = date;

}

setInterval(updateClock, 1000);

updateClock();

// ===============================
// المؤقت التنازلي
// ===============================

let timerSeconds = 25 * 60;

let timerInterval = null;

const timerDisplay = document.getElementById("timerDisplay");

const startTimerButton = document.getElementById("startTimer");

const pauseTimerButton = document.getElementById("pauseTimer");

const resetTimerButton = document.getElementById("resetTimer");

function updateTimerDisplay() {

    const minutes = Math.floor(timerSeconds / 60);

    const seconds = timerSeconds % 60;

    timerDisplay.textContent =

        String(minutes).padStart(2, "0") +

        ":" +

        String(seconds).padStart(2, "0");

}

function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(function () {

        if (timerSeconds <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("انتهى وقت التركيز! خذي استراحة 🌷");

            return;

        }

        timerSeconds--;

        updateTimerDisplay();

    }, 1000);

}

function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}

function resetTimer() {

    pauseTimer();

    timerSeconds = 25 * 60;

    updateTimerDisplay();

}

startTimerButton.addEventListener("click", startTimer);

pauseTimerButton.addEventListener("click", pauseTimer);

resetTimerButton.addEventListener("click", resetTimer);

// ===============================
// تشغيل التطبيق أول مرة
// ===============================

updateTimerDisplay();

renderTasks();