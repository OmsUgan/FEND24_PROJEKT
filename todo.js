class Todo {
    constructor(id, title, description, timeEstimate, category, deadline, isCompleted) {
        this.id = id;
        this.title = title;
        this.description = description;  
        this.timeEstimate = timeEstimate;  
        this.category = category;  
        this.deadline = deadline; 
        this.isCompleted = isCompleted;     
    }
}

// hämta element
const todoList = document.getElementById('todoList');
const createMode = document.getElementById('todo-btn');
const dynamicBtn = document.getElementById("dynamicButton");

// hämta todos från localStorage
let todoDataList = localStorage.getItem("todos");
let todoJsonList = [];

try {
    todoJsonList = todoDataList ? JSON.parse(todoDataList) : [];
} catch (e) {
    console.error("Fel vid parsing av todos:", e);
    todoJsonList = [];
}

// byta dynamiska Button till create mode
createMode.addEventListener("click", function(){
    setButtonMode(0);
})

dynamicBtn.addEventListener("click", function() {
    if (dynamicBtn.dataset.mode === "create") {

        const todoTitle = document.getElementById('taskTitle').value;
        const todoDescription = document.getElementById('taskDescription').value;
        const todoEstimate = document.getElementById('timeEstimate').value;
        const todoCategory = document.getElementById('taskCategory').value;
        const todoDeadline = document.getElementById('taskDeadline').value;
     
        let todo = new Todo(crypto.randomUUID(), todoTitle, todoDescription, todoEstimate, todoCategory, todoDeadline, false);
    
        // spara till localStorage
        todoJsonList.push(todo);
        localStorage.setItem("todos", JSON.stringify(todoJsonList));
        bootstrap.Modal.getInstance(document.getElementById("taskModal")).hide();
    
        // uppdatera visningen
        displayTodos();

    } else if (dynamicBtn.dataset.mode === "update") {
       
        // hämta todo att uppdatera
        let todoIndex = todoJsonList.findIndex(todo => todo.id === currentTodoId);

        if (todoIndex !== -1) {
            // uppdatera todo med nya värden från inputfälten
            todoJsonList[todoIndex].title = document.getElementById('taskTitle').value;
            todoJsonList[todoIndex].description = document.getElementById('taskDescription').value;
            todoJsonList[todoIndex].timeEstimate = document.getElementById('timeEstimate').value;
            todoJsonList[todoIndex].category = document.getElementById('taskCategory').value;
            todoJsonList[todoIndex].deadline = document.getElementById('taskDeadline').value;

            // spara uppdaterad lista till localStorage
            localStorage.setItem("todos", JSON.stringify(todoJsonList));
    
            // stäng modalen
            bootstrap.Modal.getInstance(document.getElementById("taskModal")).hide();
    
            // uppdatera visningen
            displayTodos();
        } else {
            console.error("Todo hittades inte");
        }
    }
});

displayTodos();

//funktioner
function setButtonMode(mode) {
    if (mode === 0) {
        dynamicBtn.dataset.mode = "create";
        dynamicBtn.innerText = "Skapa";
        // hitta alla inputfält och töm dem
        document.querySelectorAll("#taskModal input, #taskModal textarea").forEach(input => {
            input.value = "";
        });
    } else if (mode === 1) {
        dynamicBtn.dataset.mode = "update";
        dynamicBtn.innerText = "Uppdatera";
    }
}

// hämta todos
function displayTodos() {
    todoList.innerHTML = ""; 
    todoJsonList.forEach(todo => {
        const tr = document.createElement('tr');
        tr.id = todo.id;

        if(todo.isCompleted){
            tr.classList.add("completed");
        }

        tr.innerHTML = `
          <td><input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.isCompleted ? "checked" : ""}></td>
          <td>${todo.title}</td>
          <td>${todo.description}</td>
          <td>${todo.isCompleted ? "Färdig" : "Ej färdig"}</td>
          <td>${todo.timeEstimate}</td>
          <td>${todo.category}</td>
          <td>${todo.deadline}</td>
          <td>
             <i class="fas fa-edit text-warning edit-todo" data-id="${todo.id}"></i>
            <i class="fas fa-trash-alt text-danger delete-todo" data-id="${todo.id}"></i>
          </td>
        `;

        todoList.append(tr);
    });
     //  eventlistener på alla checkboxar
        document.querySelectorAll(".todo-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function() {
        const id = this.getAttribute("data-id");
        toggleTodoCompletion(id, this.checked);
          });
             });

    // delete eventlistener för att radera en todo
    document.querySelectorAll(".delete-todo").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            deleteTodo(id);
        });
    });
    // edit eventlistener för att ändra en todo
    document.querySelectorAll(".edit-todo").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            updateTodo(id);
        });
    });
}
// Sätt todo som slutförd/ej slutförd
let toggleTodoCompletion = (todoId) => {
    let todo = todoJsonList.find(todo => todo.id === todoId);
    
    if (todo) {
        todo.isCompleted = !todo.isCompleted;
        localStorage.setItem("todos", JSON.stringify(todoJsonList));
        displayTodos(); 
    }
};

// delete function
function deleteTodo(id){
    todoJsonList = todoJsonList.filter(todo => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(todoJsonList));
    const row = document.getElementById(id);
    row.remove(); 
}
// edit function
function updateTodo(id){
    currentTodoId = id; // id för aktuell todo
    const todo = todoJsonList.find(todo => todo.id === id);
    if (!todo) return;
    setButtonMode(1);
    openTaskModal(todo);
}
// öppna modal och fyll i todo-data
function openTaskModal(todo) {
    const modalElement = document.getElementById("taskModal");
    const modalInstance = new bootstrap.Modal(modalElement); 

    document.getElementById("taskTitle").value = todo.title || '';
    document.getElementById("taskDescription").value = todo.description || '';
    document.getElementById("timeEstimate").value = todo.timeEstimate || '';
    document.getElementById("taskCategory").value = todo.category || '';
    document.getElementById("taskDeadline").value = todo.deadline || '';
    modalInstance.show(); 
}