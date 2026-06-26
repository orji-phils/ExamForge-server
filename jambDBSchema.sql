
-- create the Mathematics table
CREATE TABLE Mathematics (
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

-- create the English table
CREATE TABLE English (
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

-- create the Biology table
CREATE TABLE Biology (
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

-- create the Chemistry table
CREATE TABLE Chemistry (
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

-- create the Physics table
CREATE TABLE Physics (
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

-- create the Economics table
CREATE TABLE Economics (
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

-- create the Literature table
CREATE TABLE Literature (
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

-- create the Computer table
CREATE TABLE Computer (
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

-- create the DataProcessing table
CREATE TABLE DataProcessing (
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

-- create the Accounting table
CREATE TABLE Accounting (
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

-- create the Government table
CREATE TABLE Government (
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

-- create the Mathematics table
CREATE TABLE IF NOT EXISTS Mathematics (
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

-- create the English table
CREATE TABLE IF NOT EXISTS English (
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

-- create the Physics table
CREATE TABLE IF NOT EXISTS Physics (
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

-- create the Biology table
CREATE TABLE IF NOT EXISTS Biology (
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

-- create the Accounting table
CREATE TABLE IF NOT EXISTS Accounting (
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

-- create the Government table
CREATE TABLE IF NOT EXISTS Government (
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

-- create the Chemistry table
CREATE TABLE IF NOT EXISTS Chemistry (
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

-- create the Economics table
CREATE TABLE IF NOT EXISTS Economics (
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

-- create the Literature table
CREATE TABLE IF NOT EXISTS Literature (
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

-- create the Computer table
CREATE TABLE IF NOT EXISTS Computer (
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

-- create the DataProcessing table
CREATE TABLE IF NOT EXISTS DataProcessing (
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
