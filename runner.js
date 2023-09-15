const { AssignmentServer } = require("./assignmentServer");
const { runTests } = require("./tests");


async function main() {
    printIntro("Assignment Server");

    // Initialize AssignmentServer instance.
    const server = new AssignmentServer();
    await server.importTasksFromCSV("tasks.csv");
    await server.importVolunteersFromCSV("volunteers.csv");

    runTests(server);
}

/**
 * Prints a brief intro to the codebase.
 * 
 * @param {string} codebaseTitle 
 */
function printIntro(codebaseTitle) {
    console.log("\nWelcome to the " + codebaseTitle + " codebase!")
    console.log("Start by reading through the README file for your instructions,")
    console.log("then familiarize yourself with the rest of the files in the codebase.")
    console.log("When you're ready, start tackling the TODOs in the codebase.\n")
}

main();