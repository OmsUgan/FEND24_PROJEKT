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

//Register
function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    }
}

let users = JSON.parse(localStorage.getItem("users")) || [];

document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (users.some(user => user.email === email)) {
        errorMessage.textContent = "E-postadressen finns redan! Välj en annan.";
        return;
    }
        // Kontrollera om lösenorden matchar
        if (password !== confirmPassword) {
            errorMessage.textContent = "Lösenord stämmer inte överens! Försök igen.";
            return;
        }
    
    let userId = crypto.randomUUID();

    let newUser = { id: userId, firstName, lastName, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("registerForm").reset();
    errorMessage.textContent = "Användaren har registrerats";
     errorMessage.classList.remove("text-danger");
     errorMessage.classList.add("text-success");
 
     // Återställer textfärgen efter 2 sekunder
     setTimeout(() => {
         errorMessage.textContent = "";
         errorMessage.classList.remove("text-success");
         errorMessage.classList.add("text-danger");
     }, 3000);
 });
