import { Todo } from "./classes.js";
import { getFromStorage, saveToStorage, generateRandomUUID, ifNotAuthenticated, loggedUserName, logOutUser, getLoggedUserFromStorage, getUserActivities } from "./services.js";

ifNotAuthenticated();
loggedUserName();
document.getElementById("logout").addEventListener("click", logOutUser);

// hämta element
const todoList = document.getElementById('todoList');
const createMode = document.getElementById('todo-btn');
const dynamicBtn = document.getElementById("dynamicButton");

// hämta todos från localStorage
const { userTodos: todoDataList } = getUserActivities();


//funktion för dynamiska knappar
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
     
        const todo = new Todo(generateRandomUUID(), todoTitle, todoDescription, todoEstimate, todoCategory, todoDeadline, false, new Date().toLocaleString(), getLoggedUserFromStorage().id);
    
        // spara till localStorage
        todoDataList.push(todo);
        saveToStorage("Todo", todoDataList);
        bootstrap.Modal.getInstance(document.getElementById("taskModal")).hide();
    
        // uppdatera visningen
        displayTodos();

    } else if (dynamicBtn.dataset.mode === "update") {
        const currentTodoId = document.querySelector(".edit-todo").dataset.id;

        // hämta todo att uppdatera
        let todoIndex = todoDataList.findIndex(todo => todo.id === currentTodoId);

        if (todoIndex !== -1) {
            // uppdatera todo med nya värden från inputfälten
            todoDataList[todoIndex].title = document.getElementById('taskTitle').value;
            todoDataList[todoIndex].description = document.getElementById('taskDescription').value;
            todoDataList[todoIndex].timeEstimate = document.getElementById('timeEstimate').value;
            todoDataList[todoIndex].category = document.getElementById('taskCategory').value;
            todoDataList[todoIndex].deadline = document.getElementById('taskDeadline').value;

            // spara uppdaterad lista till localStorage
            saveToStorage("Todo", todoDataList);
    
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

// hämta todos
function displayTodos(todos = todoDataList) {
    todoList.innerHTML = "";
    if (todos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = "<td colspan='8' class='py-4'>Du har inga todos</td>";
        tr.classList.add("text-center", "py-2", "fw-bold");
        todoList.append(tr);
    } else {
        todos.forEach(todo => {
            const tr = document.createElement('tr');
            tr.id = todo.id;
    
            tr.innerHTML = `
                <td> <div class="form-check form-switch form-switch-md"><input class="form-check-input" type="checkbox" role="switch" data-id="${todo.id}" ${todo.isCompleted ? "checked" : ""}></div></td>
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${todo.isCompleted ? "<span class='text-success fw-bold'>Färdig</span>" : "<span class='text-danger fw-bold'>Ej färdig</span>"}</td>
                <td>${todo.timeEstimate}</td>
                <td>${todo.category}</td>
                <td>${todo.deadline}</td>
                <td class="text-end">
                    <i class="fa-solid fa-pen me-2 edit-todo" style="color: #4a4e54;" data-id="${todo.id}"></i>
                    <i class="fa-solid fa-trash delete-todo" style="color: #4a4e54;" data-id="${todo.id}"></i>
                </td>
            `;
            todoList.append(tr);
        });
    
        //eventlistener på alla checkboxar
        document.querySelectorAll(".form-check-input").forEach(checkbox => {
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
        
}

// Sätt todo som slutförd/ej slutförd
let toggleTodoCompletion = (todoId) => {
    let todo = todoDataList.find(todo => todo.id === todoId);
    
    if (todo) {
        todo.isCompleted = !todo.isCompleted;
        saveToStorage("Todo", todoDataList);
        displayTodos(); 
    }
};

// delete function
function deleteTodo(id){
    todoDataList = todoDataList.filter(todo => todo.id !== id);
    saveToStorage("Todo", todoDataList);
    const row = document.getElementById(id);
    row.remove(); 
}

// edit function
function updateTodo(id){
    const todo = todoDataList.find(todo => todo.id === id);
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

// filtrera kategori
document.getElementById("filterCategory").addEventListener("change", (event) => {
    const valdKategori = event.target.value; // Hämta vald kategori
    let filteredTodos = valdKategori === "all"
    ? todoDataList
    : todoDataList.filter(todo => todo.category.toLowerCase() === valdKategori.toLowerCase());

    displayTodos(filteredTodos); // Skicka vald kategori till displayTodos
});

// filtrera status
document.getElementById("filterStatus").addEventListener("change", (event) => {
    const valdStatus = event.target.value;
    let filteredTodos = [];

    if (valdStatus === "all") {
        filteredTodos = todoDataList;
    } else if (valdStatus === "completed") {
        filteredTodos = todoDataList.filter(todo => todo.isCompleted); 
    } else if (valdStatus === "notCompleted") {
        filteredTodos = todoDataList.filter(todo => !todo.isCompleted); 
    }

    displayTodos(filteredTodos);
});

//sortera efter status/deadline/tidsestimat
document.getElementById("sortBy").addEventListener("change", sortTodos);

function sortTodos() {
    const sortValue = document.getElementById("sortBy").value;
    
    let sortedTodos = [...todoDataList]; 

    switch (sortValue) {
        case "deadlineAsc":
            sortedTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
        case "deadlineDesc":
            sortedTodos.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            break;
        case "timeAsc":
            sortedTodos.sort((a, b) => Number(a.timeEstimate) - Number(b.timeEstimate));
            break;
        case "timeDesc":
            sortedTodos.sort((a, b) => Number(b.timeEstimate) - Number(a.timeEstimate));
            break;
        case "statusAsc":
            sortedTodos.sort((a, b) => a.isCompleted - b.isCompleted); 
            break;
        case "statusDesc":
            sortedTodos.sort((a, b) => b.isCompleted - a.isCompleted); 
            break;
        default:
            displayTodos(sortedTodos);
            break;
    }

    displayTodos(sortedTodos);
}