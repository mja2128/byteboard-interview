const { loadVolunteers, loadTasks } = require("./util");
const { Volunteer } = require("./volunteer");
const { Task } = require("./task");

class AssignmentServer {
    constructor() { 
        /** @private {!Map<Volunteer, Set<Task>>} A map of Volunteers to assigned Tasks. */
        this.assignments = new Map();
        
        /** @private {!Map<number, Task>} A map of task ids to Tasks. */
        this.tasks = new Map();

        /** @private {!Array<Volunteer>} The list of all volunteers. */
        this.volunteers = [];
    }

    async importTasksFromCSV(csvFileName) {
        this.tasks = await loadTasks(csvFileName);
    }

    async importVolunteersFromCSV(csvFileName) {
        this.volunteers.push(...(await loadVolunteers(csvFileName, this.tasks)));
    }

    /**
     * Returns an Array of the volunteers who have indicated interest in the 
	 * given task.
     * @param {Task} task the task to find interested Volunteers for
     *
     * @return {!Array<Volunteer>} the volunteers
     */
    getInterestedVolunteers(task) {
        // TODO: Implement this method. See the README for more details.
        const interestedVolunteers = [];
        this.volunteers.forEach(v => {
           if (v.isInterested(task)) {
               interestedVolunteers.push(v);
           }
        });
        return interestedVolunteers;
    }

    /**
     * Returns a List of Tasks sorted by desirability.
     * 
     * @return {!Array<Task>} the tasks
     */
    getTasksByDesirability() {
        // TODO: Implement this method. See the README for more details.
        /* split up people-facing and non-people-facing tasks so we can sort them separately and list the people ones
           first */
        const peopleFacingTasks = [];
        const nonPeopleFacingTasks = [];
        this.tasks.forEach((task) => {
            if (task.isPeopleFacing()) {
                peopleFacingTasks.push(task);
            } else {
                nonPeopleFacingTasks.push(task);
            }
        });
        // create maps of tasks by their scores so we can access them this way later
        const peopleTasksByScore = this.buildTasksByScoreMap(peopleFacingTasks);
        const nonPeopleTasksByScore = this.buildTasksByScoreMap(nonPeopleFacingTasks);

        // sort the scores of each list
        const peopleTaskScoresSorted = Object.keys(peopleTasksByScore).map(k => parseFloat(k)).sort();
        const nonPeopleTaskScoresSorted = Object.keys(nonPeopleTasksByScore).map(k => parseFloat(k)).sort();

        // iterate over each list of scores in reverse order and build our final list of tasks, people ones first
        /* Note: I could have sorted these in reverse order above by passing in a function to the sort call, but this
            seemed quicker */
        const allTasksSorted = [];
        for (let i = peopleTaskScoresSorted.length - 1; i >= 0; i--) {
            const taskScore = peopleTaskScoresSorted[i];
            allTasksSorted.push(peopleTasksByScore[taskScore]);
        }
        for (let i = nonPeopleTaskScoresSorted.length - 1; i >= 0; i--) {
            const taskScore = nonPeopleTaskScoresSorted[i];
            allTasksSorted.push(nonPeopleTasksByScore[taskScore]);
        }

        return allTasksSorted;
    }

    /**
     * Helper function to take a list of tasks and build a map of desirability score => task
     */
    buildTasksByScoreMap(tasks) {
        const tasksByScore = {};
        tasks.forEach(t => {
            let taskScore = 0;
            this.volunteers.forEach(v => {
                taskScore += v.getTaskDesirabilityScore(t);
            });
            tasksByScore[taskScore] = t;
        });
        return tasksByScore;
    }

    /**
     * Assigns Tasks to Volunteers by inserting them into the assignment map,
     * in order of desirability. Tasks are assigned to the first Volunteer with
     * interest. If there are no interested Volunteers, they are assigned to the
     * first available Volunteer.
     */
    assignTasks() {
        for (const task of this.getTasksByDesirability()) {
            const interestedVolunteers = this.getInterestedVolunteers(task);
            if (interestedVolunteers.length > 0) {
                this.assignTask(task, interestedVolunteers[0]);
            } else if (this.volunteers.length > 0) {
                this.assignTask(task, this.volunteers[0]);
            }
        }
    }

    /**
     * Assigns Tasks to Volunteers based on their interests.
     *
     * This currently does not improve volunteer satisfaction :(
     * I think this would work if we perhaps assigned task by least desirability first, but I didn't have time to test
     * this theory.
     *
     * My goal was to assign by considering both desirability and current task load of each volunteer, but that alone
     * doesn't seem to work. I think if we reverse the task desirability sort, we will find the fiew folks interested
     * in undesirable tasks first, get those assigned, and then move on to the more desirable ones, while keeping the work
     * spread out. This is my theory anyway. I could be mistaken.
     */
    assignTasksImproved() {
        // TODO: Implement this method. See the README for more details.
        let taskCount = 1;
        for (const task of this.getTasksByDesirability()) {
            const interestedVolunteers = this.getInterestedVolunteers(task);
            if (interestedVolunteers.length > 0) {
                let nextVolunteerIndex = 0;
                interestedVolunteers.forEach((iv, i) => {
                    if (this.assignments.get(iv)?.size < taskCount) {
                        nextVolunteerIndex = i;
                    }
                });
                this.assignTask(task, interestedVolunteers[nextVolunteerIndex]);
            } else if (this.volunteers.length > 0) {
                let nextVolunteerIndex = 0;
                this.volunteers.forEach((v, i) => {
                    if (this.assignments.get(v)?.size < taskCount) {
                        nextVolunteerIndex = i;
                    }
                });
                this.assignTask(task, this.volunteers[nextVolunteerIndex]);
            }
            taskCount++;
        }
    }

    /**
     * Adds the given Task to the specified Volunteer's Set of assigned Tasks.
     *
     * @param {Task} task the task to assign
     * @param {Volunteer} volunteer the volunteer to assign the Task to
     */
    assignTask(task, volunteer) {
        if (!(this.assignments.has(volunteer))) {
            this.assignments.set(volunteer, new Set());
        }
        this.assignments.get(volunteer).add(task);
    }
}

module.exports = { AssignmentServer };