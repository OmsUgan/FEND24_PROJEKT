//Skapar en tom array
let habitsDataList = [];

//Sparar habits i localstorage
function saveHabitsToLocalStorage() {
    localStorage.setItem("HabitsData", JSON.stringify(habitsDataList));
}

//Updaterar det som vi har i localstorage
function updateHabitInLocalStorage(updatedHabit) {
    // Här letar vi efter en specifik habit genom sin ID
    let habit = habitsDataList.find(habit => habit.id === updatedHabit.id);

    //Och om vi hittar den, uppdaterar vi deras värden
    if (habit) {
 
        habit.title = updatedHabit.title;
        habit.priority = updatedHabit.priority;
        habit.count = updatedHabit.count;
        
        saveHabitsToLocalStorage();
    }
}
//Här skapar vi en ny habit där vi sparar rubriken, prioriteringen och vi ger den en unik ID
function saveHabit(title, priority) {
    let newHabit = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),// Stöd för macbook
        //id: crypto.randomUUID(), //Funkar bara i windows
        title: title,
        priority: priority,
        count: 0
    };
    
    //Här pushar vi den nya habit till våran array och vi sparar den
    habitsDataList.push(newHabit);
    saveHabitsToLocalStorage();

    //Vi kallar funktionen som visar habit i dokumentet
    createHabitElement(newHabit);
}

function createHabitElement(habit) {

    //Vi anropar den diven som kommer att visa alla habits för att sen skapa den huvudviden som ska innehålla hela informationen
    const habitList = document.getElementById('habit-list');
    const habitItem = document.createElement('div');

    //Här ger vi den en class och en unik ID
    habitItem.classList.add('habit-item');
    habitItem.setAttribute('data-id', habit.id);

    //Här rensar vi först det som finns i diven och sen skriver vi ut den nya habit med sina knappar
    habitItem.innerHTML = `
        <h2>${habit.title}</h2>
        <p>${habit.priority}</p>
        <div class="habit-controls">
            <button class="decrease">-</button>
            <p class="counter">${habit.count}</p>
            <button class="increase">+</button>
        </div>
        <div class="habit-actions">
            <button class="reset">Reset</button>
            <button class="delete">Delete</button>
        </div>
    `;

 //Här beroende på vilken knapp man trycker minskar, ökar eller återställs counter.
function whenPressingTheButton(action) {
    const counter = habitItem.querySelector('.counter');
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
const decreaseBtn = habitItem.querySelector('.decrease');
const increaseBtn = habitItem.querySelector('.increase');
const resetBtn = habitItem.querySelector('.reset');
const deleteBtn = habitItem.querySelector('.delete');

//Efter att ha hittat de måste vi definiera vad kommer att hända när knapparna trycks ner
decreaseBtn.addEventListener('click', () => whenPressingTheButton('decrease'));
increaseBtn.addEventListener('click', () => whenPressingTheButton('increase'));
resetBtn.addEventListener('click', () => whenPressingTheButton('reset'));
deleteBtn.addEventListener('click', () => deleteHabit(habit.id));

habitList.append(habitItem);

}

//Raderar habit och uppdaterar dokumentet
function deleteHabit(id) {
    //Filtrerar listan för att radera den habit som matchar ID
    habitsDataList = habitsDataList.filter(habit => habit.id !== id);
    saveHabitsToLocalStorage();
    renderHabits();
}

//Uppdaterar och skriver i diven den data som är sparad i localstorage
function renderHabits() {
    const habitList = document.getElementById('habit-list');
    
    //Här raderas det som finns i diven och lägst till igen varje habit som finns i vår array
    habitList.innerHTML = '';
    habitsDataList.forEach(habit => createHabitElement(habit));
}

//Den här kommer att köras efter att hela sidan har laddats
document.addEventListener('DOMContentLoaded', () => {
    const habitsFromStorage = localStorage.getItem("HabitsData");
    
    //Om vi ​​hittar nånting sparad i localStorage kommer vi att försöka konvertera det till en array; om inte, initierar vi en tom array
    try {
        habitsDataList = habitsFromStorage ? JSON.parse(habitsFromStorage) : [];
    } catch (e) {
        console.error("Det gick inte att hämta data från localStorage:", e);
        habitsDataList = [];
    }

    //Här anropar vi våra knappar, dialog och imputs i dokumenten 
    const addHabitBtn = document.querySelector('.add-habit');
    const habitDialog = document.getElementById('habit-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');
    const saveHabitBtn = document.getElementById('save-habit');
    const habitTitleInput = document.getElementById('habit-title');
    const habitPriorityInput = document.getElementById('habit-priority');

    //Event för att öppna dialog
    addHabitBtn.addEventListener('click', () => {
        habitDialog.showModal();
    });
    //Event för att stänga dialog
    closeDialogBtn.addEventListener('click', () => {
        habitDialog.close();
    });

    //Event för att spara informationen
    saveHabitBtn.addEventListener('click', () => {

        //Här får vi den data som fins på båda input och vi ta bort utrymmen som finns i början och i slutet på rubriken
        const title = habitTitleInput.value.trim();
        const priority = habitPriorityInput.value;

        //Om input är inte tom sparas title och priority, efter det rensas input och dialog stängs
        if (title !== "") {
            saveHabit(title, priority);
            habitTitleInput.value = "";
            habitDialog.close();
        }
    });

    renderHabits();
});