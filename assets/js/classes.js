export class ScheduledEvent {
    constructor(id, title, startDate, endDate) {
        this.id = id;
        this.title = title;
        this.start = startDate;
        this.end = endDate;   
    }
}

export class Habit {
    constructor(id, title, priority, count) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.count = count;   
    }
}

export class User {
    constructor(id, firstName, lastName, email, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;   
        this.password = password;   
    }
}