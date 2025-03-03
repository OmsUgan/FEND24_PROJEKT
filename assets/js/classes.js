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