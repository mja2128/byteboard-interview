/**
 * A Task represents a duty to be assigned to a volunteer.
 * Tasks contain an id, a name, and a description, as well as a flag indicating
 * whether the task is people-facing.
 */
class Task {
    /**
     *
     * @param {number} id
     * @param {string} name
     * @param {boolean} peopleFacing
     * @param {string} description
     */
    constructor(id, name, peopleFacing, description) {
        this.id = id;
        this.name = name;
        this.peopleFacing = peopleFacing;
        this.description = description;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    isPeopleFacing() {
        return this.peopleFacing;
    }

    getDescription() {
        return this.description;
    }

    toString() {
        return `Task ${this.id}: ${this.name}`;
    }
}

module.exports = { Task };