// Get DOM element
const form = document.getElementById('todo-form'),
    input = document.getElementById('todo-input'),
    list = document.getElementById('todo-list'),
    search = document.getElementById('search-task');

// Load tasks from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Save current todos to localStorage
function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render the task list based on current todos and search query
function render() {
    const query = search.value.toLowerCase();
    list.innerHTML = '';

    todos
        .filter(t => t.text.toLowerCase().includes(query)) // filter by search
        .slice()
        .reverse() // Show newest task on the top
        .forEach((todo, index, array) => {
            const realIndex = todos.length - 1 - index;

            // Create task item
            const li = document.createElement('li');
            li.draggable = true;
            li.dataset.index = realIndex;
            if (todo.completed)
                li.classList.add('completed');

            // Task item innerHTML
            li.innerHTML = `<span class="drag-handle">&#8801</span>
                <span class="task-text" contenteditable="true">${todo.text}</span>
                <span class="action">
                    <button class="button remove">&#10007</button>
                    <button class="button checkmark">&#10003</button>
                </span>`;
            list.appendChild(li);

            // Get action buttons
            const checkmark = li.querySelector('.checkmark'),
                remove = li.querySelector('.remove'),
                taskText = li.querySelector('.task-text');

            // Toggle completion
            checkmark.onclick = () => {
                todo.completed = !todo.completed;
                save();
                render();
            };

            // Remove task
            remove.onclick = () => {
                todos.splice(realIndex, 1);
                save();
                render();
            };

            // Save changes on text edit (on blur)
            taskText.onblur = () => {
                todo.text = taskText.textContent.trim();
                save();
            };

            // Drag and drop handlers
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });
            li.addEventListener('dragover', e => e.preventDefault());
            li.addEventListener('drop', e => {
                e.preventDefault();
                const dragging = list.querySelector('.dragging');
                if (!dragging) return;
                const from = +dragging.dataset.index;
                const to = +li.dataset.index;
                if (from === to) return;
                const dragged = todos.splice(from, 1)[0];
                todos.splice(to, 0, dragged);
                save();
                render();
            });
        });
}

// Handle form submission
form.onsubmit = e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text, completed: false });
    input.value = '';
    save();
    render();
};

// Filter tasks on search input
search.oninput = render;

// Initial render
render();