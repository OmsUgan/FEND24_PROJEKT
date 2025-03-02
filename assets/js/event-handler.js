import { ScheduledEvent } from "./classes.js";
import { getFromStorage, saveToStorage, generateRandomUUID, swedishDateTimeFormat } from "./services.js";

let eventListFromStorage = getFromStorage("Event");

const renderEventListPage = (eventData) => {
    const eventListDiv = document.getElementById("event-list");

    const eventUl = document.createElement("ul");
    eventUl.classList.add("list-group");

    eventListDiv.innerHTML = "";
    
    if (eventData.length === 0) {
        const eventLi = document.createElement("li");
        eventLi.textContent = "Du har inga evenemang sparade!"; 
        eventLi.classList.add("list-group-item", "d-flex", "justify-content-center", "fw-semibold");
        eventUl.append(eventLi);
    } else {
        eventData.sort((a, b) => new Date(a.start) - new Date(b.end));
        
        eventData.forEach(event => {
            const currentDateTime = new Date();
            
            const eventLi = document.createElement("li");
            eventLi.classList.add("list-group-item");

            const gridDivContainer = document.createElement("div");
            gridDivContainer.classList.add("container", "p-2");

            const gridRowDiv = document.createElement("div");
            gridRowDiv.classList.add("row", "d-flex", "align-items-center")
            
            const statusCol = createGridCol("col-md-2");
            const titleCol = createGridCol("col-md-4");
            const timeCol = createGridCol("col-md-3");
            const actionCol = createGridCol("col-md-3");

            const span = document.createElement("span");
            span.classList.add("px-2", "py-1", "fw-semibold", "rounded")
            
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
            statusCol.append(span);
            
            const spanTitle = document.createElement("span");
            spanTitle.classList.add("h6");
            spanTitle.textContent = event.title;
            titleCol.append(spanTitle);

            const small = document.createElement("small");
            small.textContent = `${swedishDateTimeFormat(new Date(event.start))} — ${swedishDateTimeFormat(new Date(event.end)).toLocaleString()}`;
            timeCol.append(small);

            const actionDiv = document.createElement("div");
            actionDiv.classList.add("d-flex", "justify-content-end", "gap-3");
            actionDiv.innerHTML = `<i class="fa-solid fa-pen fa-sm" style="color: #4a4e54;" data-bs-toggle="modal" data-bs-target="#updateModal" data-event-id="${event.id}"></i><i class="fa-solid fa-trash fa-sm" style="color: #4a4e54;" data-bs-toggle="modal" data-bs-target="#deleteModal" data-event-id="${event.id}"></i>`
            actionCol.append(actionDiv);

            gridRowDiv.append(statusCol, titleCol, timeCol, actionCol);
            gridDivContainer.append(gridRowDiv);
            eventLi.append(gridDivContainer);
            eventUl.append(eventLi);
        });
    }
    eventListDiv.append(eventUl);
}

const createGridCol = (classList) => {
    const div = document.createElement("div");
    div.classList.add(classList);

    return div;
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
    document.getElementById("id").value = event.relatedTarget.dataset.eventId;
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
    const eventId = event.relatedTarget.dataset.eventId;
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

// Växla vy mellan listan och kalender
document.getElementById("list-view").addEventListener("click", event => {
    console.log(event.target.id);
    
    const eventFilter = document.getElementById("filter-text");
    const eventListBtn = document.getElementById("show-event-list");
    const eventListDiv = document.getElementById("event-list");
    const eventCalendarDiv = document.getElementById("calendar-card");
    const eventCalendarBtn = document.getElementById("show-event-calendar");
    
    if (event.target.id === "show-event-list") {
        eventListDiv.style.display = "block";
        eventCalendarDiv.style.display = "none";
        eventCalendarBtn.hidden = false;
        eventListBtn.hidden = true;
        eventFilter.hidden = false;
        renderEventListPage(eventListFromStorage);
    } else if (event.target.id === "show-event-calendar") {
        eventListDiv.style.display = "none";
        eventCalendarDiv.style.display = "block";
        eventListBtn.hidden = false;
        eventCalendarBtn.hidden = true;
        eventFilter.hidden = true;

        const calendarEl = document.getElementById('calendar-list');
        if (!calendarEl.dataset.rendered) {
            var calendar = new FullCalendar.Calendar(calendarEl, {
                events: eventListFromStorage,
                initialView: 'dayGridMonth',
                timeZone: 'local',
                eventColor: '#212529',
                locale: 'sv',
                firstDay: 1,
                eventTimeFormat: { 
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                },
                eventDisplay: 'block',
                progressiveEventRendering: true,
                displayEventTime: true,
                displayEventEnd: true,
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                },
                weekNumbers: true,
            });
            calendar.setOption('height', 850);
        }
        calendar.render();
        renderEventListPage(eventListFromStorage);
    }
});
console.log(`Datum & tid just nu: ${new Date().toLocaleString()}`)