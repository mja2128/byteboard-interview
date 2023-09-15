const fs = require("fs");
const readline = require("readline");

const { Volunteer } = require("./volunteer");
const { Task } = require("./task");

/**
 * Returns an int representing the total satisfaction of the volunteers with the
 * current task assignments.
 *
 * Each task assigned that the volunteer listed as an interested task earns a
 * minimum of 1 point, with tasks listed as a volunteer's first, second, or third
 * choice earning 4, 3, and 2 points, respectively.  Each task assigned that the
 * volunteer expressed no interest in loses 1 point. Additionally, volunteers lose
 * satisfaction points when they are assigned more tasks than they would be if
 * tasks were evenly distributed.
 *
 * @param {!Map<Volunteer, Set<Task>>} assignments 
 * @param {!Array<Volunteer>} volunteers 
 * @param {number} numTasks
 * 
 * @return {number}
 */
 function getVolunteerSatisfactionScore(assignments, volunteers, numTasks) {
    let totalSatisfactionScore = 0;

    if (assignments.size == 0) {
        console.log("No assignments have been made yet.");
        return totalSatisfactionScore;
    }

    for (const volunteer of volunteers) {
        if (!assignments.has(volunteer)) {
            continue;
        }

        // Calculate a Volunteer's individual satisfaction score
        let volunteerScore = 0;
        for (const task of assignments.get(volunteer)) {
            if (!volunteer.isInterested(task)) {
                volunteerScore -= 1;
            } else {
                const interestRanking = volunteer.interestedTasks.indexOf(task);
                if (interestRanking < 3) {
                    volunteerScore += 4 - interestRanking;
                } else {
                    volunteerScore += 1;
                }
            }
        }

        // For every Task that a Volunteer has above the number they would
        // have if tasks were evenly distributed, we lose a point. No one
        // wants to feel like they've been asked to do all of the work!
        const totalTasksPerVolunteer = Math.ceil(numTasks / volunteers.length);
        const numberOfTasksAssigned = assignments.get(volunteer).size;
        if (numberOfTasksAssigned > totalTasksPerVolunteer) {
            volunteerScore -= numberOfTasksAssigned - totalTasksPerVolunteer;
        }

        totalSatisfactionScore += volunteerScore;
    }

    return totalSatisfactionScore;
}

        
/**
 * Loads tasks from a CSV file.
 * @param {string} csvFileName 
 * 
 * @return {!Map<number, Task>} the taskId to Task map loaded from the CSV file
 */
async function loadTasks(csvFileName) {
    // task id to task map
    const tasks = new Map();

    await new Promise(resolve => {
        const readStream = readline.createInterface({
            input: fs.createReadStream(csvFileName)
        });

        readStream.on('line', line => {
            const parsedLine = line.split(",");
            const id = parseInt(parsedLine[0]);
            const name = parsedLine[1];
            const peopleFacing = parsedLine[2].toLowerCase() == "true";
            const description = parsedLine[3];

            tasks.set(id, new Task(id, name, peopleFacing, description));
        });
        readStream.on('close', resolve);
    });

    return tasks;
}


/**
 * Loads volunteers from a CSV file.
 * @param {string} csvFileName
 * @param {!Array<Task>} tasks the Tasks in the assignment server
 * 
 * @return {!Array<Volunteer>} the Volunteers loaded from the CSV file
 */
async function loadVolunteers(csvFileName, tasks){
    const volunteers = [];

    await new Promise(resolve => {
        const readStream = readline.createInterface({
            input: fs.createReadStream(csvFileName)
        });

        readStream.on('line', line => {
            const parsedLine = line.split(",");
            const name = parsedLine[0];
            const interestedTaskIds = parsedLine[1];
            const volunteer = new Volunteer(name);

            // Load in the Volunteer's interested Tasks
            for (const taskId of interestedTaskIds.split(" ")) {
                volunteer.addInterestedTask(tasks.get(parseInt(taskId)));
            }

            volunteers.push(volunteer);
        });
        readStream.on('close', resolve);
    });

    return volunteers;
}

module.exports = { getVolunteerSatisfactionScore, loadTasks, loadVolunteers };