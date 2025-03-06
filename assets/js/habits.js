import { Habit } from "./classes.js";
import { getFromStorage, saveToStorage, generateRandomUUID, ifNotAuthenticated, loggedUserName, logOutUser, getLoggedUserFromStorage } from "./services.js";

ifNotAuthenticated();
loggedUserName();
document.getElementById("logout").addEventListener("click", logOutUser);

//Hämtas habits från localstorage
let habitsDataList = getFromStorage("Habit");

//Renderar habit i en lista
function createHabitElement(habit) {
    const habitListDiv = document.getElementById("habit-list");

    const habitUl = document.createElement("ul");
    habitUl.classList.add("list-group");

    habitListDiv.innerHTML = "";

    if (habit.length === 0) {
        const habitList = document.createElement("li");
        habitList.textContent = "Du har inga rutiner sparade!";
        habitList.classList.add("list-group-item", "d-flex", "justify-content-center", "fw-semibold");
        habitUl.append(habitList);
    } else {
        habit.forEach(habit => {
            const habitList = document.createElement("li");
            habitList.classList.add("list-group-item");
            habitList.setAttribute('data-id', habit.id);

            const gridDivContainer = document.createElement("div");
            gridDivContainer.classList.add("container", "p-2");

            const gridRowDiv = document.createElement("div");
            gridRowDiv.classList.add("row", "d-flex", "align-items-center")

            const priorityCol = createGridCol("col-md-1");
            const titleCol = createGridCol("col-md-7");
            const counterCol = createGridCol("col-md-2");
            const actionCol = createGridCol("col-md-2");

            const spanTitle = document.createElement("span");
            spanTitle.classList.add("h6");
            spanTitle.textContent = habit.title;
            titleCol.append(spanTitle);
            
            const spanPriority = document.createElement("span");
            spanPriority.classList.add("px-2", "py-1", "fw-semibold", "rounded");

            if (habit.priority === "low") {
                spanPriority.classList.add("text-success-emphasis", "bg-success-subtle", "border", "border-success-subtle")
                spanPriority.textContent = "Låg";
            } else if (habit.priority === "medium") {
                spanPriority.classList.add("text-warning-emphasis", "bg-warning-subtle", "border", "border-warning-subtle")
                spanPriority.textContent = "Medel";
            } else {
                spanPriority.classList.add("text-danger-emphasis", "bg-danger-subtle", "border", "border-danger-subtle")
                spanPriority.textContent = "Hög";
            }
            
            priorityCol.append(spanPriority);

            counterCol.innerHTML = `
            <div class="habit-controls">
                <div class="btn-group" role="group">
                    <button class="btn btn-dark decrease fw-bold">-</button>
                    <button class="btn btn-dark counter" style="--bs-btn-disabled-bg: #212529; --bs-btn-disabled-opacity: 1;" disabled>${habit.count}</button>
                    <button class="btn btn-dark increase fw-bold">+</button>
                </div>
            </div>
            `

            actionCol.innerHTML = `
            <div class="habit-actions d-flex justify-content-end gap-3">
                <i class="fa-solid fa-rotate-right reset" style="color: #4a4e54;"></i>
                <i class="fa-solid fa-trash" style="color: #4a4e54;" data-bs-toggle="modal" data-bs-target="#delete-habit" data-habit-id="${habit.id}"></i>
            </div>
            `

            //Här beroende på vilken knapp man trycker minskar, ökar eller återställs counter.
            function whenPressingTheButton(action) {
                const counter = counterCol.querySelector('.counter');
                if (action === 'decrease' && habit.count > 0) {
                    habit.count--;
                } else if (action === 'increase') {
                    habit.count++;
                } else if (action === 'reset') {
                    habit.count = 0;
                    alert("reset")
                }
                
                //Här uppdateras det counter som visas i dokumentet efter att ha tryckt på någon knapp och samtidigt uppdateras informationen i localStorae
                counter.textContent = habit.count;
                updateHabitInLocalStorage(habit);
            }
            
            //Här anropar vi knapparna
            const decreaseBtn = counterCol.querySelector('.decrease');
            const increaseBtn = counterCol.querySelector('.increase');
            const resetBtn = actionCol.querySelector('.reset');
                
            //Efter att ha hittat de måste vi definiera vad kommer att hända när knapparna trycks ner
            decreaseBtn.addEventListener('click', () => whenPressingTheButton('decrease'));
            increaseBtn.addEventListener('click', () => whenPressingTheButton('increase'));
            resetBtn.addEventListener('click', () => whenPressingTheButton('reset'));

            gridRowDiv.append(priorityCol, titleCol, counterCol, actionCol);
            gridDivContainer.append(gridRowDiv);
            habitList.append(gridDivContainer);
            habitUl.append(habitList);
        })
    }
    habitListDiv.append(habitUl)
}

const createGridCol = (classList) => {
    const div = document.createElement("div");
    div.classList.add(classList);

    return div;
}

createHabitElement(habitsDataList);

//Här skapar vi en ny habit där vi sparar rubriken, prioriteringen och vi ger den en unik ID
function saveHabit() {
    const title = document.getElementById("title").value;
    const priority = document.getElementById("habit-priority").value;
    
    if (!title || priority === "") {
        alert("Titel måste fyllas i!");
        return;
    }

    const newHabit = new Habit(generateRandomUUID(), title, priority, 0, getLoggedUserFromStorage().id)
    
    //Här pushar vi den nya habit till våran array och vi sparar den
    habitsDataList.push(newHabit);
    saveToStorage("Habit", habitsDataList);

    document.getElementById("title").value = "";

    bootstrap.Modal.getInstance(document.getElementById("new-habit")).hide();

    //Vi kallar funktionen som visar habit i dokumentet
    createHabitElement(habitsDataList);
}
document.getElementById("save-habit").addEventListener("click", saveHabit);

//Raderar habit och uppdaterar dokumentet
document.getElementById("confirm-delete-habit").addEventListener("click", () => {
    const id = document.getElementById("id").value;
    habitsDataList = habitsDataList.filter(habit => habit.id !== id);
    saveToStorage("Habit", habitsDataList);
    
    bootstrap.Modal.getInstance(document.getElementById("delete-habit")).hide();
    createHabitElement(habitsDataList);
});

document.getElementById("delete-habit").addEventListener("show.bs.modal", (event) => {
    document.getElementById("id").value = event.relatedTarget.dataset.habitId;
});

//Uppdaterar det som vi har i localstorage
function updateHabitInLocalStorage(updatedHabit) {
    // Här letar vi efter en specifik habit genom sin ID
    let habit = habitsDataList.find(habit => habit.id === updatedHabit.id);

    //Och om vi hittar den, uppdaterar vi deras värden
    if (habit) {
 
        habit.title = updatedHabit.title;
        habit.priority = updatedHabit.priority;
        habit.count = updatedHabit.count;
        
        saveToStorage("Habit", habitsDataList)
    }
}

//Filter habits
function filterHabits() {
    const selectedPriority = document.getElementById('filter-priority').value;
    let filteredHabit = []
    
    filteredHabit = habitsDataList.filter(habit => selectedPriority === 'all' || habit.priority === selectedPriority);
    createHabitElement(filteredHabit)
}
document.getElementById('filter-priority').addEventListener('change', filterHabits);

//Sortera habits

// Sortera habits
function sortHabits() {
    const sortOption = document.getElementById('sort-options').value;
    const priorityMap = { "low": 1, "medium": 2, "high": 3 };
    
    switch (sortOption) {
        case 'priority-asc':
            habitsDataList.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
            break;
        case 'priority-desc':
            habitsDataList.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
            break;
        case 'count-asc':
            habitsDataList.sort((a, b) => a.count - b.count);
            break;
        case 'count-desc':
            habitsDataList.sort((a, b) => b.count - a.count);
            break;
        case 'name-asc':
            habitsDataList.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            habitsDataList.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
    createHabitElement(habitsDataList);
}

document.getElementById('sort-options').addEventListener('change', sortHabits);