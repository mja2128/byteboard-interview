const { Task } = require("./task");

class Volunteer {
    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;

        /** @private {!Array<Task>} The Tasks this Volunteer is interested in. */
        this.interestedTasks = [];
    }

    getName() {
        return this.name;
    }

    /**
     * Adds a Task to this Volunteer's interestedTasks array.
     * @param {Task} task
     */
    addInterestedTask(task) {
        this.interestedTasks.push(task);
    }

    /**
     * Removes a Task from this Volunteer's interestedTasks array.
     * @param {Task} task
     */
    removeInterestedTask(task) {
        this.interestedTasks = this.interestedTasks.filter(item => item != task);
    }

    /**
     * Returns whether this Volunteer is interested in the given Task.
     * @param {Task} task
     */
    isInterested(task) {
        return this.interestedTasks.includes(task);
    }

    /**
     * Returns a float representing how desirable the given task is to this
     * volunteer.
     * @param {Task} task
     */
    getTaskDesirabilityScore(task) {
        // TODO: Implement this method. See the README for more details.
        let desirabilityScore = 0;
        if (this.isInterested(task)) {
            const indexOfTask = this.interestedTasks.indexOf(task);
            desirabilityScore = 1 / (indexOfTask + 1);
        }
        return desirabilityScore;
    }

    toString() {
        return this.name;
    }
}

module.exports = { Volunteer };