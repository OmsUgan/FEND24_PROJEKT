import { Habit } from "./classes.js";
import { getFromStorage, saveToStorage, generateRandomUUID } from "./services.js";

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

            const counterCol = createGridCol("col-md-2");
            const titleCol = createGridCol("col-md-4");
            const priorityCol = createGridCol("col-md-3");
            const actionCol = createGridCol("col-md-3");

            const spanTitle = document.createElement("span");
            spanTitle.classList.add("h6");
            spanTitle.textContent = habit.title;
            titleCol.append(spanTitle);
            
            const spanPriority = document.createElement("span");
            spanPriority.textContent = habit.priority === "low" ? "Låg" : habit.priority === "medium" ? "Medel" : habit.priority === "high" ? "Hög" : null;
            priorityCol.append(spanPriority);

            counterCol.innerHTML = `
            <div class="habit-controls">
                <button class="decrease">-</button>
                <p class="counter">${habit.count}</p>
                <button class="increase">+</button>
            </div>
            `
            actionCol.innerHTML = `
            <div class="habit-actions">
                <button class="reset">Reset</button>
                <i class="fa-solid fa-trash fa-sm" style="color: #4a4e54;" data-bs-toggle="modal" data-bs-target="#delete-habit" data-habit-id="${habit.id}"></i>
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

            gridRowDiv.append(counterCol, titleCol, priorityCol, actionCol);
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

    const newHabit = new Habit(generateRandomUUID(), title, priority, 0)
    
    //Här pushar vi den nya habit till våran array och vi sparar den
    habitsDataList.push(newHabit);
    saveToStorage("Habit", habitsDataList);

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
