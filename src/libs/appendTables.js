var fs = require("fs");

const subjects = ["Mathematics", "English", "Biology", "Physics", "Chemistry", "Accounting", "Economics", "Government", "Literature", "Computer", "DataProcessing"];

const usage = `
-- create the database
CREATE DATABASE IF NOT EXISTS JambDB;

-- select the database
USE JambDB;

`

subjects.forEach(subject => {
    const data = `
-- create the ${subject} table
CREATE TABLE IF NOT EXISTS ${subject} (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    questionNumber TINYINT NOT NULL,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correctAnswer CHAR (1) NOT NULL,
    year YEAR NOT NULL,
    subject VARCHAR (30) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE InnoDB;
`;

    fs.appendFile("./jambDBSchema.sql", usage+ data, (error) => {
        if (error) {
            console.log("Error writing into the file: ", error);
        } else {
            console.log("Content written successfully.")
        }
    })
})