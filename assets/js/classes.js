export class ScheduledEvent {
    constructor(id, title, startDate, endDate, userId) {
        this.id = id;
        this.title = title;
        this.start = startDate;
        this.end = endDate;
        this.userId = userId;   
    }
}

export class Habit {
    constructor(id, title, priority, count, userId) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.count = count; 
        this.userId = userId;
    }
}

export class Todo {
    constructor(id, title, description, timeEstimate, category, deadline, isCompleted, createdAt, userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.timeEstimate = timeEstimate;
        this.category = category;
        this.deadline = deadline;
        this.isCompleted = isCompleted;
        this.createdAt = createdAt;
        this.userId = userId;
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