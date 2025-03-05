import { getFromStorage, saveToStorage, generateRandomUUID, hashPassword } from "../js/services.js";
import { User } from "../js/classes.js"

const usersList = getFromStorage("Users");
const error = document.getElementById("error");

// Login
const login = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

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

const loginButton = document.getElementById("btn-login");
if (loginButton) {
    loginButton.addEventListener("click", login);
}

//Register
document.querySelectorAll(".PasswordToggler").forEach((toggler) => {
    toggler.addEventListener("click", (event) => {
        event.preventDefault();
            
        const passwordField = document.getElementById(toggler.dataset.target);
        const showIcon = toggler.querySelector(".Show");
        const hideIcon = toggler.querySelector(".Hide");

        if (passwordField.type === "password") {
            passwordField.type = "text";
            hideIcon.style.display = "block";
            showIcon.style.display = "none";
        } else {
            passwordField.type = "password";
            hideIcon.style.display = "none";
            showIcon.style.display = "block";
        }
    });
});

const register = async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        error.textContent = "Alla fält måste fyllas i!";
        return;
    }

    if (!isValidEmail(email)) {
        error.textContent = "E-postadressen är ogiltig!";
        return;
    }

    if (password !== confirmPassword) {
        error.textContent = "Bekräftelselösenordet stämmer inte överens med lösenordet!";
        return;
    }

    if (password.length < 5 || confirmPassword.length < 5) {
        error.textContent = "Lösenordet måste vara minst 5 tecken!";
        return;
    }

    if (usersList.some(user => user.email === email)) {
        error.textContent = "Denna e-postadress är redan registrerad. Välj en annan!";
        return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User(generateRandomUUID(), firstName, lastName, email, hashedPassword);

    if (newUser) {
        usersList.push(newUser);
        saveToStorage("Users", usersList)
        sessionStorage.setItem("loggedUser", JSON.stringify(new User(newUser.id, newUser.firstName, newUser.lastName, newUser.email)));

        error.textContent = "";
        window.location.href = "/dashboard/index.html";
    }
}

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email)
}

const registerButton = document.getElementById("btn-register");
if (registerButton) {
    registerButton.addEventListener("click", register);
}