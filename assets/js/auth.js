import { getFromStorage, hashPassword } from "../js/services.js";
import { User } from "../js/classes.js"

const usersList = getFromStorage("Users");
console.log(usersList);

// Login
const login = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const error = document.getElementById("error");

    if (!email || !password) {
        error.textContent = "Fyll i både e-postadress och lösenord.";
        return;
    }

    const hashedPassword = await hashPassword(password);

    const user = usersList.find(user => user.email === email && user.password === hashedPassword);

    if (user) {
        sessionStorage.setItem("loggedUser", JSON.stringify(new User(user.id, user.firstName, user.lastName, user.email)));

        error.textContent = "";
        window.location.href = "/dashboard/index.html";
    } else {
        error.textContent = "Felaktig e-postadress eller lösenord, försök igen!";
    }
}

document.getElementById("btn-login").addEventListener("click", login);

