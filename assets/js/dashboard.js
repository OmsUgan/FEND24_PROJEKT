import { swedishDateTimeFormat, ifNotAuthenticated, loggedUserName, logOutUser, getLoggedUserFromStorage, getUserActivities } from "./services.js";

ifNotAuthenticated();
loggedUserName();
document.getElementById("logout").addEventListener("click", logOutUser);

const { userEvents, userHabits, userTodos } = getUserActivities();
const activityData = { userEvents, userHabits, userTodos };

function renderDashboardCards (cardId, data) {
  const dashboardCardUl = document.getElementById(cardId);
  const optionsEventDate = { day: '2-digit', month: 'short', hour: '2-digit',  minute: '2-digit' };
  const optionsTodoDate = { year: "numeric", day: 'numeric', month: 'numeric' };
  
  dashboardCardUl.innerHTML = "";

  if (data.length === 0) {
    const li = document.createElement("li");
    li.textContent = `Du har inga ${cardId === "userEvents" ? "evenemang" : cardId === "userHabits" ? "rutiner" : "todos"} sparade!`; 
    li.classList.add("list-group-item", "d-flex", "justify-content-center", "m-0");
    dashboardCardUl.append(li);
  } else {
    data.forEach(activity => {
      const li = document.createElement("li");
      li.classList.add("list-group-item", "p-0", "my-1", "mx-3", "d-flex", "justify-content-between", "align-items-center");
  
      const pLeft = document.createElement("p");
      pLeft.classList.add("fw-semibold");
      pLeft.textContent = activity.title;
  
      const pRight = document.createElement("p");
  
      if (cardId === "userEvents") {
        pRight.textContent = `${swedishDateTimeFormat(new Date(activity.start), optionsEventDate)} — ${swedishDateTimeFormat(new Date(activity.end), optionsEventDate)}`;
      } else if (cardId === "userHabits") {
        pRight.textContent = activity.count;
      } else {
        pRight.textContent = swedishDateTimeFormat(new Date(activity.deadline), optionsTodoDate)
      }
  
      li.append(pLeft, pRight);
  
      dashboardCardUl.append(li);
    });
  }
};

function showOnDashboard(arrName, dataList) {
  console.log(arrName, "aa", dataList);
  let sortedData;

  if (arrName === "userEvents") {
    sortedData = dataList.sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 3);
  } else if (arrName === "userHabits") {
    sortedData = dataList.sort((a, b) => b.count - a.count).slice(0, 3);
  } else {
    sortedData = dataList.filter(data => data.isCompleted === false).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  }

  renderDashboardCards(arrName, sortedData);
}

Object.entries(activityData).forEach(([arrayName, dataList]) => {
  showOnDashboard(arrayName, dataList);
});

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
      return welcomeUser.textContent = `God morgon ${getLoggedUserFromStorage().firstName}!`;
    } else if (currentHour >= 12 && currentHour < 18) {
      return welcomeUser.textContent = `God eftermiddag ${getLoggedUserFromStorage().firstName}!`;
    } else {
      return welcomeUser.textContent = `God kväll ${getLoggedUserFromStorage().firstName}!`;
    }
}
getGreeting();