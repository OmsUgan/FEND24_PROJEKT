export const getFromStorage = (keyName) => {
    try {
        const dataList = localStorage.getItem(keyName);
        return dataList ? JSON.parse(dataList) : [];
    } catch (error) {
        console.log(`Ett problem uppstod vid hämtning av ${keyName} från din sparade data. Felmeddelande: ${error}`)
    }
}

export const saveToStorage = (keyName, data) => localStorage.setItem(keyName, JSON.stringify(data));

export const generateRandomUUID = () => crypto.randomUUID();

export const swedishDateTimeFormat = (datetime, options) => {
    return new Intl.DateTimeFormat('sv-SE', options).format(datetime);
}


// Hash password logga in/registrering
export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
}

// Kontroll om användaren är autentiserad, om inte skicka till login sidan
export const isAuthenticated = () => {
    return sessionStorage.getItem("loggedUser") !== null;
}

export const ifNotAuthenticated = () => {
    if (!isAuthenticated()) {
        window.location.href = "/auth/login.html";
        return false;
    } else {
        return true;
    }
}

// Hämta användaren från sessionStorage
export const getLoggedUserFromStorage = () => {
    const user = sessionStorage.getItem("loggedUser");
    return user ? JSON.parse(user) : null;
};

export const loggedUserName = () => {
    return document.getElementById("logged-user-name").textContent = `${getLoggedUserFromStorage().firstName} ${getLoggedUserFromStorage().lastName}`
}

export const logOutUser = () => {
    sessionStorage.clear();
    return window.location.href = "/index.html";
}

// Hämta inloggad användarens aktiviteter
export const getUserActivities = () => {
    const currentLoggedUser = getLoggedUserFromStorage();

    const eventDataList = getFromStorage("Event");
    const habitDataList = getFromStorage("Habit");
    const todoDataList = getFromStorage("Todo");

    const userEvents = eventDataList.filter(event => event.userId === currentLoggedUser.id);
    const userHabits = habitDataList.filter(habit => habit.userId === currentLoggedUser.id);
    const userTodos = todoDataList.filter(todo => todo.userId === currentLoggedUser.id);

    return { userEvents, userHabits, userTodos }
}