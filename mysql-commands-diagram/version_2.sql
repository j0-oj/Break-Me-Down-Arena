CREATE TABLE User (
    userID       INT AUTO_INCREMENT,
    username     VARCHAR(255),
    firstName    VARCHAR(255),
    lastName     VARCHAR(255),
    email        VARCHAR(255),
    userPassword VARCHAR(255),
    PRIMARY KEY (userID)
);

CREATE TABLE Room (
    roomID          INT AUTO_INCREMENT,
    title           VARCHAR(255),
    flagDescription TEXT,
    flagAnswer      VARCHAR(255),
    nameOfFile      VARCHAR(255),
    roomCompletion  TINYINT(1),
    PRIMARY KEY (roomID)
);

CREATE TABLE Arena (
    channelID           CHAR(36),
    defenderPts         TINYINT,
    attackerPts         TINYINT,
    defenderPlayerLimit TINYINT,
    attackerPlayerLimit TINYINT,
    hasGameStarted      TINYINT(1),
    hasGameFinished     TINYINT(1),
    timeStarted         VARCHAR(255),
    timeLimit           INT,
    dateOfGame          VARCHAR(255),
    PRIMARY KEY (channelID)
);

CREATE TABLE ArenaRoom (
    arenaRoomID INT AUTO_INCREMENT,
    channelID   CHAR(36),
    roomID      INT,
    PRIMARY KEY (arenaRoomID),
    FOREIGN KEY (channelID) REFERENCES Arena(channelID),
    FOREIGN KEY (roomID) REFERENCES Room(roomID)
);

CREATE TABLE DefenderRole (
    defenderID INT AUTO_INCREMENT,
    channelID  CHAR(36),
    userID     INT,
    PRIMARY KEY (defenderID),
    FOREIGN KEY (channelID) REFERENCES Arena(channelID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE AttackerRole (
    attackerID INT AUTO_INCREMENT,
    channelID  CHAR(36),
    userID     INT,
    PRIMARY KEY (attackerID),
    FOREIGN KEY (channelID) REFERENCES Arena(channelID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE History (
    historyID    INT AUTO_INCREMENT,
    channelID    CHAR(36),
    userID       INT,
    gameRole     VARCHAR(255),
    pointsEarned TINYINT,
    dateOfGame   VARCHAR(255),
    PRIMARY KEY (historyID),
    FOREIGN KEY (channelID) REFERENCES Arena(channelID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Session (
    sessionID   INT AUTO_INCREMENT,
    userID      INT,
    UUID        CHAR(36),
    timeOfLogin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ipAddress   BIGINT,
    PRIMARY KEY (sessionID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);