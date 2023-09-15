const { Volunteer } = require("./volunteer");
const { Task } = require("./task");
const { getVolunteerSatisfactionScore } = require("./util");

/**
 * A set of simple tests that you can use to help verify that your code is working
 * correctly.
 * 
 * These tests are not exhaustive and do not guarantee that your solutions are
 * fully correct. If you have time, add some tests of your own to help verify your
 * solutions.
 * 
 * @param {AssignmentServer} server
 */
function runTests(server) {
    console.log("\n~~~~~~~~~~~~~~~~~\n| Running Tests |\n~~~~~~~~~~~~~~~~~");

    // If you have time, add some tests of your own to help verify your solutions.

    // Task 1 tests
    console.log("\n~~~ Task 1 - INTEREST ROSTER ~~~\n");
    testInterestRoster(server);
    testTaskDesirabilityScore();

    // Task 2 tests
    console.log("\n~~~ Task 2 - TASKS BY DESIRABILITY ~~~\n");
    testTasksByDesirability(server);

    // Task 3 tests
    console.log("\n~~~ Task 3 - IMPROVED TASK ASSIGNMENTS ~~~\n");
    testImprovedTaskAssignment(server);
}

/**
 * Tests getInterestedVolunteers() based on the data in volunteers.csv.
 * 
 * @param {AssignmentServer} server
 */
function testInterestRoster(server) {
    console.log("\n*** Task Interest Roster ***\n");
    for (const task of server.tasks.values()) {
        const interestedVolunteers = server.getInterestedVolunteers(task);
        console.log(`${task} (${interestedVolunteers.length}): ${interestedVolunteers}`);
    }
}

/**
 * Tests getTaskDesirabilityScore() with two tasks that the volunteer is
 * interested in, and one task that the candidate is not interested in.
 */
function testTaskDesirabilityScore() {
    console.log("\n*** Desirability Score ***\n");
    const volunteer = new Volunteer("Test Volunteer");
    const taskA = new Task(1, "A", false, "");
    const taskB = new Task(2, "B", false, "");
    const taskC = new Task(3, "C", false, "");

    volunteer.addInterestedTask(taskA);
    volunteer.addInterestedTask(taskB);

    const tasksToExpectedScores = new Map([[taskA, 1], [taskB, 0.5], [taskC, 0]]);

    for (const [task, expectedScore] of tasksToExpectedScores) {
        const score = volunteer.getTaskDesirabilityScore(task);
        var emoji = "";
        if (score == expectedScore) {
            emoji = "✅";
        } else {
            emoji = "❌";
        }
        console.log(`Task ${task.getName()} Desirability: ${score} ${emoji}`);
    }
}

/**
 * Tests getTasksByDesirability() based on the data in volunteers.csv.
 * The volunteer satisfaction score should be 12, given the current list of
 * tasks and volunteers.
 * 
 * @param {AssignmentServer} server
 */
function testTasksByDesirability(server) {
    const sortedTasks = server.getTasksByDesirability();
    if (sortedTasks.length > 0) {
        console.log("\n*** Tasks Stats ***\n");
        console.log("Most popular task:", sortedTasks[0].toString());
        console.log("Least popular task:", sortedTasks[sortedTasks.length - 1].toString());
    }

    server.assignTasks();
    console.log("\n*** Task Assignments ***\n");
    displayAssignments(server.assignments);

    const satisfactionScore = getVolunteerSatisfactionScore(
        server.assignments, server.volunteers, server.tasks.size);
    console.log(`Volunteer Satisfaction Score: ${satisfactionScore}`);
}

/**
 * Tests assignTasksImproved() based on the data in volunteers.csv.
 * 
 * @param {AssignmentServer} server
 */
function testImprovedTaskAssignment(server) {
    server.assignments.clear();
    server.assignTasksImproved();
    console.log("\n*** Improved Task Assignments ***\n");
    displayAssignments(server.assignments);

    const satisfactionScore = getVolunteerSatisfactionScore(
        server.assignments, server.volunteers, server.tasks.size);
    console.log(`Improved Volunteer Satisfaction Score: ${satisfactionScore}`);
}

/**
 * A helper function to print task assignments.
 * 
 * @param {!Map<Volunteer, Set<Task>>} assignments
 */
function displayAssignments(assignments) {
    for (const [volunteer, tasks] of assignments) {
        console.log(`Tasks assigned to ${volunteer}`);
        for (const task of tasks) {
            console.log(`\t${task}`);
        }
        console.log();
    }
}

module.exports = { runTests };