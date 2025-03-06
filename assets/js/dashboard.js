import { getFromStorage, swedishDateTimeFormat } from "./services.js";

let dashboardHabitsData = [];

function showOnDashboard() { 
    const habitsDataList = getFromStorage("Habit") || [];

    dashboardHabitsData = habitsDataList.map(habit => ({ ...habit }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
}

// function renderHabitsOnDashboard() {
//     showOnDashboard();
//     const dashboardDivHabit = document.getElementById("dashboard-habit-list");

//     dashboardDivHabit.innerHTML = "";

//     if (dashboardHabitsData.length === 0) {
//         const noHabitsMessage = document.createElement("p");
//         noHabitsMessage.textContent = "Du har inga rutiner.";
//         noHabitsMessage.classList.add("list-group-item", "d-flex", "justify-content-center", "fw-semibold");
//         dashboardDivHabit.append(noHabitsMessage);
//         return;
//     }

//     dashboardHabitsData.forEach(habit => {
//         const habitDiv = document.createElement("div");
//         habitDiv.classList.add("habit-item", "d-flex", "align-items-center", "border", "border-1", "p-2", "mb-3");

//         const priorityDiv = document.createElement("div");
//         priorityDiv.classList.add("habit-priority", "col-md-3");

//         const prioritySpan = document.createElement("span");
//         prioritySpan.classList.add("px-2", "py-1", "fw-semibold", "rounded");

//         if (habit.priority === "low") {
//             prioritySpan.classList.add("text-success-emphasis", "bg-success-subtle", "border", "border-success-subtle");
//             prioritySpan.textContent = "Låg";
//         } else if (habit.priority === "medium") {
//             prioritySpan.classList.add("text-warning-emphasis", "bg-warning-subtle", "border", "border-warning-subtle");
//             prioritySpan.textContent = "Medel";
//         } else {
//             prioritySpan.classList.add("text-danger-emphasis", "bg-danger-subtle", "border", "border-danger-subtle");
//             prioritySpan.textContent = "Hög";
//         }
        
//         priorityDiv.append(prioritySpan);

//         const titleDiv = document.createElement("div");
//         titleDiv.classList.add("habit-title", "col-md-4");
//         const titleSpan = document.createElement("span");
//         titleSpan.classList.add("h6");
//         titleSpan.textContent = habit.title;
//         titleDiv.append(titleSpan);

//         const countDiv = document.createElement("div");
//         countDiv.classList.add("habit-count", "col-md-3");

//         const countSpan = document.createElement("span");
//         countSpan.classList.add("h6", "fw-semibold");
//         countSpan.textContent = `Antal: ${habit.count}`;
//         countDiv.append(countSpan);

//         habitDiv.append(priorityDiv, titleDiv, countDiv);
//         dashboardDivHabit.append(habitDiv);
//     });
// }

// renderHabitsOnDashboard();

///////////

let dashboardEventsData = [];

function showUpcomingEvents() {
    const eventList = getFromStorage("Event") || [];

    dashboardEventsData = eventList
        .filter(event => new Date(event.start) > new Date())
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 3);
}

// function renderUpcomingEvents() {
//     showUpcomingEvents();
//     const dashboardEventsDiv = document.getElementById("dashboard-events-list");

//     dashboardEventsDiv.innerHTML = "";

//     if (dashboardEventsData.length === 0) {
//         const noEventsMessage = document.createElement("p");
//         noEventsMessage.textContent = "Du har inga event.";
//         noEventsMessage.classList.add("list-group-item", "d-flex", "justify-content-center", "fw-semibold");
//         dashboardEventsDiv.append(noEventsMessage);
//         return;
//     }

//     const eventUl = document.createElement("ul");
//     eventUl.classList.add("list-group");

//     dashboardEventsData.forEach(event => {
//         const eventLi = document.createElement("li");
//         eventLi.classList.add("list-group-item");

//         const eventTitle = document.createElement("strong");
//         eventTitle.textContent = event.title;

//         const eventDate = document.createElement("span");
//         eventDate.textContent = ` ${swedishDateTimeFormat(new Date(event.start))}`;

//         eventLi.append(eventTitle, document.createElement("br"), eventDate);
//         eventUl.append(eventLi);
//     });

//     dashboardEventsDiv.append(eventUl);
// }

// renderUpcomingEvents();

///////////

// let dashboardTodosData = [];

// function showLatestTodos() {
//     const todoList = getFromStorage("todos") || [];

//     dashboardTodosData = todoList
//         .filter(todo => !todo.isCompleted)
//         .slice(-3);
// }

// function renderLatestTodos() {
//     showLatestTodos();
//     const dashboardTodosDiv = document.getElementById("dashboard-todos-list");

//     dashboardTodosDiv.innerHTML = "";

//     if (dashboardTodosData.length === 0) {
//         const noTodosMessage = document.createElement("p");
//         noTodosMessage.textContent = "Du har inga todos.";
//         noTodosMessage.classList.add("list-group-item", "d-flex", "justify-content-center", "fw-semibold");
//         dashboardTodosDiv.append(noTodosMessage);
//         return;
//     }

//     const todoUl = document.createElement("ul");
//     todoUl.classList.add("list-group");

//     dashboardTodosData.forEach(todo => {
//         const todoLi = document.createElement("li");
//         todoLi.classList.add("list-group-item");

//         const todoTitle = document.createElement("strong");
//         todoTitle.textContent = todo.title;

//         const todoDeadline = document.createElement("span");
//         todoDeadline.textContent = todo.deadline ? ` - Deadline: ${swedishDateTimeFormat(new Date(todo.deadline))}` : "";

//         todoLi.append(todoTitle, todoDeadline);
//         todoUl.append(todoLi);
//     });

//     dashboardTodosDiv.append(todoUl);
// }

// renderLatestTodos();

///////////

async function getRandomQuote() {
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const api = await response.json();

        document.getElementById("quote").textContent = `"${api.quote}"`;
        document.getElementById("author").textContent = `"${api.author}"`;  //  ${api.id} - ${api.quote} - ${api.author}
    } catch (error) {
        console.error("Det uppstod ett problem när informationen skulle hämtas från API:et:", error);
    }
}

getRandomQuote();


function getGreeting() {
    const currentHour = new Date().getHours();
    const welcomeUser = document.getElementById("welcome-user");

    if (currentHour >= 5 && currentHour < 12) {
      return welcomeUser.textContent = "God morgon";
    } else if (currentHour >= 12 && currentHour < 18) {
      return welcomeUser.textContent = "God eftermiddag!";
    } else {
      return welcomeUser.textContent = "God kväll!";
    }
}
getGreeting();

// async function getRandomQuote() {
    
//     const response = await fetch("https://dummyjson.com/quotes/random");
//     const api = await response.json();

//     document.getElementById("dashboard-random-quote").textContent = `"${api.quote}"`;  //  ${api.id} - ${api.quote} - ${api.author}

// }

// getRandomQuote();