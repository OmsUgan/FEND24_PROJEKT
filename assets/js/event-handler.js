import { ScheduledEvent } from "./classes.js";
import { getFromStorage, saveToStorage, generateRandomUUID, swedishDateTimeFormat, createButton } from "./services.js";

let eventListFromStorage = getFromStorage("Event");

const renderEventListPage = (eventData) => {
    const eventListDiv = document.getElementById("event-list");

    const eventUl = document.createElement("ul");
    eventUl.classList.add("list-group");

    eventListDiv.innerHTML = "";
    
    if (eventData.length === 0) {
        const eventLi = document.createElement("li");
        eventLi.textContent = "Du har inga evenemang sparade!"; 
        eventLi.classList.add("list-group-item", "text-center");
        eventUl.append(eventLi);
    } else {
        eventData.sort((a, b) => new Date(a.start) - new Date(b.end));
        
        eventData.forEach(event => {
            const eventLi = document.createElement("li");
            eventLi.classList.add("list-group-item", "d-flex", "justify-content-between");
            eventLi.textContent = event.title;

            const span = document.createElement("span");
            span.classList.add("px-2", "py-1", "fw-semibold", "rounded")

            const currentDateTime = new Date();

            if (new Date(event.start) > currentDateTime) {
                span.classList.add("text-success-emphasis", "bg-success-subtle", "border", "border-success-subtle")
                span.textContent = "Kommande";
            } else if (new Date(event.end) < currentDateTime) {
                span.classList.add("text-secondary-emphasis", "bg-secondary-subtle", "border", "border-secondary-subtle")
                span.textContent = "Tidigare";
            } else {
                span.classList.add("text-warning-emphasis", "bg-warning-subtle", "border", "border-warning-subtle")
                span.textContent = "Pågående";
            }
            eventLi.prepend(span);

            const divButton = document.createElement("div");
            divButton.classList.add("d-flex", "gap-2");

            const divStartEnd = document.createElement("div");
            const pStartEnd = document.createElement("p");
            pStartEnd.textContent = `Startar: ${swedishDateTimeFormat(new Date(event.start))} - Slutar: ${swedishDateTimeFormat(new Date(event.end)).toLocaleString()}`

            const btnDelete = createButton("Ta bort", event.id, "btn btn-danger", "modal", "#deleteModal");

            new Date(event.end) >= currentDateTime ? divButton.append(createButton("Uppdatera", event.id, "btn btn-info text-white", "modal", "#updateModal")) : null;

            divStartEnd.append(pStartEnd);
            divButton.append(btnDelete)
            eventLi.append(divStartEnd, divButton);
            eventUl.append(eventLi);
        });
    }
    eventListDiv.append(eventUl);
}
renderEventListPage(eventListFromStorage);

//Spara event
const createEvent = () => {
    let eventTitle = document.getElementById("title").value;
    let eventStartDateTime = new Date(document.getElementById("start").value);
    let eventEndDateTime = new Date(document.getElementById("end").value);

    const currentDateTime = new Date();
    eventStartDateTime.setSeconds(0, 0);
    currentDateTime.setSeconds(0, 0);

    // Lägg till en mikroskopisk tolerans om jämförelsen ändå misslyckas
    const tolerance = 1; // tolerans i millisekunder

    if (!eventTitle || !eventStartDateTime || !eventEndDateTime) {
        alert("Alla fält måste fyllas i!");
        return;
    }

    if (eventStartDateTime.getTime() + tolerance <= currentDateTime.getTime()) {
        alert("Startdatum och tid för evenemanget kan inte vara tidigare än nuvarande tid!");
        return;
    }

    if (eventEndDateTime.getTime() + tolerance <= eventStartDateTime.getTime()) {
        alert("Slutdatum och tid måste vara efter startdatum!");
        return;
    }

    const newEvent = new ScheduledEvent(generateRandomUUID(), eventTitle, eventStartDateTime.toISOString(), eventEndDateTime.toISOString());
    eventListFromStorage.push(newEvent);
    saveToStorage("Event", eventListFromStorage);

    bootstrap.Modal.getInstance(document.getElementById("new-event")).hide();
    renderEventListPage(eventListFromStorage);
}
document.getElementById("save-event").addEventListener("click", createEvent);

// Ta bort event
document.getElementById("delete-event").addEventListener("click", () => {
    const id = document.getElementById("id").value;
    eventListFromStorage = eventListFromStorage.filter(event => event.id !== id);
    saveToStorage("Event", eventListFromStorage);
    
    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
    renderEventListPage(eventListFromStorage);
});

document.getElementById("deleteModal").addEventListener("show.bs.modal", (event) => {
    document.getElementById("id").value = event.relatedTarget.value;
});

//Uppdatera event
const updateInputs = document.querySelectorAll("#update input");
document.getElementById("update-event").addEventListener("click", () => {
    const eventId = document.getElementById("eventId").value;
    let eventToUpdate = eventListFromStorage.find(event => event.id === eventId);

    updateInputs.forEach(input => {
        if (input.type === 'datetime-local') {
            let datetime = new Date(input.value)
            eventToUpdate[input.name] = datetime.toISOString();
        } else {
            eventToUpdate[input.name] = input.value;
        }
    });

    const eventIndex = eventListFromStorage.findIndex(event => event.id === eventId);
    if (eventIndex !== -1) {
        eventListFromStorage[eventIndex] = eventToUpdate;
    }

    saveToStorage("Event", eventListFromStorage);

    bootstrap.Modal.getInstance(document.getElementById("updateModal")).hide();
    renderEventListPage(eventListFromStorage);
});


document.getElementById("updateModal").addEventListener("show.bs.modal", (event) => {
    const eventId = event.relatedTarget.value;
    let currentEvent = eventListFromStorage.find(event => event.id === eventId);
    console.log(currentEvent)

    updateInputs.forEach((input, index) => {
        if (input.type === 'datetime-local') {
            let date = new Date(Object.values(currentEvent)[index]);
            let convertDate = date.toISOString().slice(0, 16);
            input.value = convertDate;
        } else {
            input.value = Object.values(currentEvent)[index];
        }
    });  
});

// Filter
const filterEvent = (filterType) => {
    let filteredEvents = [];

    const currentDateTime = new Date();
    
    if (filterType === "upcoming") {
        filteredEvents = eventListFromStorage.filter(event => new Date(event.start) > currentDateTime);
    } else if (filterType === "past") {
        filteredEvents = eventListFromStorage.filter(event => new Date(event.end) < currentDateTime);
    } else if (filterType === "ongoing") {
        filteredEvents = eventListFromStorage.filter(event => new Date(event.start) <= currentDateTime && new Date(event.end) >= currentDateTime);
    } else {
        filteredEvents = eventListFromStorage;
    }
    
    document.getElementById("filter-text").textContent = filterType === "upcoming" ? "Kommande" : filterType === "past" ? "Tidigare" : filterType === "ongoing" ? "Pågående" : "Alla Evenemang";

    renderEventListPage(filteredEvents);
}
document.getElementById("standard").addEventListener("click", () => filterEvent('standard'));
document.getElementById("upcoming").addEventListener("click", () => filterEvent('upcoming'));
document.getElementById("ongoing").addEventListener("click", () => filterEvent('ongoing'));
document.getElementById("past").addEventListener("click", () => filterEvent('past'));
console.log(`Datum & tid just nu: ${new Date().toLocaleString()}`)