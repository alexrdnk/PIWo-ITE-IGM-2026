"use strict";

const state = {
  tasks: [],
  trashLast: null,
  pendingDelete: null
};

const refs = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  tasksContainer: document.getElementById("tasksContainer"),
  undoBtn: document.getElementById("undoBtn"),
  trashInfo: document.getElementById("trashInfo"),
  confirmDialog: document.getElementById("confirmDialog"),
  confirmText: document.getElementById("confirmText")
};

function formatDate(dateIso) {
  if (!dateIso) {
    return "";
  }

  const date = new Date(dateIso);
  return date.toLocaleString("pl-PL");
}

function render() {
  refs.tasksContainer.innerHTML = "";

  if (state.tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "hint";
    empty.textContent = "Brak zadań.";
    refs.tasksContainer.appendChild(empty);
  } else {
    state.tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = `task-item ${task.done ? "done" : ""}`;

      const left = document.createElement("div");
      left.className = "task-left";

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const date = document.createElement("span");
      date.className = "task-date";
      date.textContent = task.doneAt ? `(zrobione: ${formatDate(task.doneAt)})` : "";

      left.appendChild(text);
      left.appendChild(date);

      left.addEventListener("click", () => {
        task.done = !task.done;
        task.doneAt = task.done ? new Date().toISOString() : null;
        render();
      });

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.textContent = "X";
      delBtn.addEventListener("click", () => {
        state.pendingDelete = { taskId: task.id, text: task.text };
        refs.confirmText.textContent =
          `Czy na pewno chcesz usunąć zadanie o treści: "${task.text}"?`;
        refs.confirmDialog.showModal();
      });

      taskItem.appendChild(left);
      taskItem.appendChild(delBtn);
      refs.tasksContainer.appendChild(taskItem);
    });
  }

  refs.undoBtn.disabled = state.trashLast === null;
  refs.trashInfo.textContent = state.trashLast
    ? `Ostatnio usunięto: "${state.trashLast.task.text}".`
    : "Brak elementów do przywrócenia.";
}

function addTask() {
  const text = refs.taskInput.value.trim();

  if (text.length === 0) {
    alert("Treść zadania nie może być pusta.");
    return;
  }

  state.tasks.push({
    id: crypto.randomUUID(),
    text,
    done: false,
    doneAt: null
  });

  refs.taskInput.value = "";
  render();
}

function confirmDelete(result) {
  if (result !== "confirm" || !state.pendingDelete) {
    state.pendingDelete = null;
    return;
  }

  const { taskId } = state.pendingDelete;
  const index = state.tasks.findIndex((task) => task.id === taskId);
  if (index === -1) {
    state.pendingDelete = null;
    return;
  }

  const [removedTask] = state.tasks.splice(index, 1);

  state.trashLast = {
    task: removedTask,
    index
  };

  state.pendingDelete = null;
  render();
}

function undoDelete() {
  if (!state.trashLast) {
    return;
  }

  const { task, index } = state.trashLast;
  const safeIndex = Math.min(index, state.tasks.length);
  state.tasks.splice(safeIndex, 0, task);
  state.trashLast = null;
  render();
}

function setupEvents() {
  refs.addTaskBtn.addEventListener("click", addTask);

  refs.taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  refs.undoBtn.addEventListener("click", undoDelete);

  refs.confirmDialog.addEventListener("close", () => {
    confirmDelete(refs.confirmDialog.returnValue);
  });

  document.addEventListener("keydown", (event) => {
    const isCtrlZ = event.ctrlKey && (event.key === "z" || event.key === "Z");
    if (isCtrlZ) {
      event.preventDefault();
      undoDelete();
    }
  });
}

function init() {
  setupEvents();
  render();
}

init();
