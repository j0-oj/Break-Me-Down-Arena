CREATE TABLE user (
    userID       INT AUTO_INCREMENT,
    username     VARCHAR(255),
    firstName    VARCHAR(255),
    lastName     VARCHAR(255),
    email        VARCHAR(255),
    userPassword VARCHAR(255),
    PRIMARY KEY (userID)
);

CREATE TABLE room (
    roomID          INT AUTO_INCREMENT,
    title           VARCHAR(255),
    flagDescription TEXT,
    flagAnswer      VARCHAR(255),
    nameOfFile      VARCHAR(255),
    roomCompletion  TINYINT(1),
    PRIMARY KEY (roomID)
);

CREATE TABLE arena (
    channelID           CHAR(36),
    defenderPts         TINYINT,
    attackerPts         TINYINT,
    defenderPlayerLimit TINYINT,
    attackerPlayerLimit TINYINT,
    hasGameStarted      TINYINT(1),
    hasGameFinished     TINYINT(1),
    timeStarted         TIMESTAMP,
    timeLimit           INT,
    dateOfGame          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (channelID)
);

CREATE TABLE arena_room (
    arenaRoomID INT AUTO_INCREMENT,
    channelID   CHAR(36),
    roomID      INT,
    PRIMARY KEY (arenaRoomID),
    FOREIGN KEY (channelID) REFERENCES arena(channelID),
    FOREIGN KEY (roomID) REFERENCES room(roomID)
);

CREATE TABLE arena_player (
    arenaPlayerID INT AUTO_INCREMENT,
    channelID     CHAR(36),
    userID        INT,
    playerStatus  ENUM("DEFENDER", "KING-DEFENDER", "ATTACKER", "NIL"),
    PRIMARY KEY (arenaPlayerID),
    FOREIGN KEY (channelID) REFERENCES arena(channelID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

CREATE TABLE history (
    historyID    INT AUTO_INCREMENT,
    channelID    CHAR(36),
    userID       INT,
    gameRole     VARCHAR(255),
    pointsEarned TINYINT,
    dateOfGame   VARCHAR(255),
    PRIMARY KEY (historyID),
    FOREIGN KEY (channelID) REFERENCES arena(channelID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

CREATE TABLE session (
    sessionID   INT AUTO_INCREMENT,
    userID      INT,
    UUID        CHAR(36),
    timeOfLogin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ipAddress   BIGINT,
    PRIMARY KEY (sessionID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

