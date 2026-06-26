-- create practice history database
CREATE DATABASE IF NOT EXISTS PracticeHistoryDB;

-- select database
USE PracticeHistoryDB;

-- drop tables if they exist
DROP TABLE IF EXISTS PracticeSubjects;
DROP TABLE IF EXISTS PracticeAnswers;
DROP TABLE IF EXISTS Practices;

-- Create the general practice table
CREATE TABLE IF NOT EXISTS Practices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recordId BIGINT UNSIGNED NOT NULL,
    score INT UNSIGNED NOT NULL,
    userId BIGINT UNSIGNED NOT NULL,
    year YEAR NOT NULL,
    type ENUM("single", "simulation") NOT NULL,
    examType VARCHAR (10) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES UserDb.Users (id) ON DELETE CASCADE
) ENGINE InnoDB;

-- create the answers table
CREATE TABLE IF NOT EXISTS PracticeAnswers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    practiceId BIGINT UNSIGNED NOT NULL,
    questionId BIGINT UNSIGNED NOT NULL,
    userAnswer CHAR NOT NULL,
    correctAnswer CHAR NOT NULL,
    FOREIGN KEY (practiceId) REFERENCES Practices (id) ON DELETE CASCADE
) ENGINE InnoDB;

-- create the subjects table
CREATE TABLE IF NOT EXISTS PracticeSubjects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    practiceId BIGINT UNSIGNED NOT NULL,
    subject VARCHAR (20) NOT NULL,
    UNIQUE (practiceId, subject),
    FOREIGN KEY (practiceId) REFERENCES  Practices (id) ON DELETE CASCADE
) ENGINE InnoDB;
