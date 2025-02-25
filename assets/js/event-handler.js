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