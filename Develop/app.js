const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const inquirerAnswers = [];

function generateTeam() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What is the Team Member's role?",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
      },
      {
        type: "input",
        message: "What is Team Member's name?",
        name: "name",
      },
      {
        type: "input",
        message: "What is the Team Member's id?",
        name: "id",
      },
      {
        type: "input",
        message: "What is the Team Member's Email?",
        name: "email",
      },
      {
        type: "input",
        message: "What is the name of the school that the Team Intern attended?",
        name: "school",
        when: (answers) => {
          return answers.role === "Intern";
        },
      },
      {
        type: "input",
        message: "What is the Team Engineer's GitHub username?",
        name: "github",
        when: (answers) => {
          return answers.role === "Engineer";
        },
      },
      {
        type: "input",
        message: "What is the Team Manager's Office Number?",
        name: "officeNumber",
        when: (answers) => {
          return answers.role === "Manager";
        },
      },
      {
        type: "confirm",
        message: "Would you like to recruit another Team Member?",
        name: "recruit",
      },
    ])
    .then((answers) => {
      console.log(answers);
      inquirerAnswers.push(answers);
      console.log(inquirerAnswers);
      if (answers.recruit) {
        generateTeam();
      } else {
        const teamMembers = inquirerAnswers.map((employee) => {
          switch (employee.role) {
            case "Engineer":
              console.log(new Engineer(employee.name, employee.id, employee.email, employee.github));
              return new Engineer(employee.name, employee.id, employee.email, employee.github);
            case "Manager":
              console.log(new Manager(employee.name, employee.id, employee.email, employee.officeNumber));
              return new Manager(employee.name, employee.id, employee.email, employee.officeNumber);
            case "Intern":
              console.log(new Intern(employee.name, employee.id, employee.email, employee.school));
              return new Intern(employee.name, employee.id, employee.email, employee.school);
            default:
              console.log("Team Member is not recognized");
          }
        });
        console.log(teamMembers);
        fs.writeFile(outputPath, render(teamMembers), (err) => {
          if (err) {
            throw err;
          }
          console.log("The file has been saved!");
        });
      }
    })
    .catch((err) => {
      if (err) {
        throw ("Error: ", err);
      }
    });
}

generateTeam();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all teamMember desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!
