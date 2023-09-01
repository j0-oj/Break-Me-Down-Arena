<?php
    function validatePOSTData($parameterName) {
        return (
            (isset($_POST[$parameterName])) && 
            (filter_has_var(INPUT_POST, $parameterName)) && 
            ($_POST[$parameterName] !== "")
        );
    }

    function sanitizePOSTData($parameterName) {
        $data = trim($_POST[$parameterName]);
        $data = htmlspecialchars($data, ENT_QUOTES);
        $data = stripslashes($data);
        $data = strip_tags($data);

        return $data;
    }

    // If a POST request is not made throw "Forbidden"
    if($_SERVER["REQUEST_METHOD"] === "POST") {
        // Setup PDO connection with MySQL server
        $pdoPHPscriptPath = __DIR__ . "/../../config/pdo_connection.php";
        require_once($pdoPHPscriptPath);

        // Check if channelID exists & not empty in POST request
        if(validatePOSTData("UUID") && validatePOSTData("channelID")) {
            // Sanitize GET information
            $UUID = sanitizePOSTData("UUID");
            $channelID = sanitizePOSTData("channelID");

            // Get userID
            $stmt = $pdo->prepare(
                "SELECT user.userID
                 FROM user
                 LEFT JOIN session
                 ON user.userID = session.userID
                 WHERE session.UUID = ?;"
            );
            $stmt->execute([$UUID]);

            $resultArray = $stmt->fetch();
            $userID      = $resultArray["userID"];

            // Get role of player
            $stmt = $pdo->prepare(
                "SELECT playerStatus FROM arena_player WHERE userID = ? AND channelID = ?;"
            );
            $stmt->execute([$userID, $channelID]);

            $resultArray = $stmt->fetch();
            $gameRole    = $resultArray["playerStatus"];

            // Get points earned
            $pointsEarned = 0;

            if(($gameRole === "DEFENDER") || ($gameRole === "KING-DEFENDER")) {
                $stmt = $pdo->prepare(
                    "SELECT defenderPts 
                     FROM arena
                     WHERE channelID = ?;"
                );
                $stmt->execute([$channelID]);
                $resultArray  = $stmt->fetch();
                $pointsEarned = $resultArray["defenderPts"];
            }
            if($gameRole === "ATTACKER") {
                $stmt = $pdo->prepare(
                    "SELECT attackerPts 
                     FROM arena
                     WHERE channelID = ?;"
                );
                $stmt->execute([$channelID]);
                $resultArray  = $stmt->fetch();
                $pointsEarned = $resultArray["attackerPts"];
            }

            // Get date of game
            $stmt = $pdo->prepare(
                "SELECT dateOfGame 
                 FROM arena
                 WHERE channelID = ?;"
            );
            $stmt->execute([$channelID]);
            $resultArray   = $stmt->fetch();
            $data          = $resultArray["dateOfGame"];
            $timeDataArray = date_parse($data);

            $year  = str_pad(strval($timeDataArray["year"]), 4, "0", STR_PAD_LEFT);
            $month = str_pad(strval($timeDataArray["month"]), 2, "0", STR_PAD_LEFT);
            $day   = str_pad(strval($timeDataArray["day"]), 2, "0", STR_PAD_LEFT);

            $dateOfGame = $day . "/"  .$month . "/" . $year;

            // Insert history
            $stmt = $pdo->prepare(
                "INSERT INTO history (channelID, userID, gameRole, pointsEarned, dateOfGame) 
                 VALUES (?, ?, ?, ?, ?);"
            );
            $stmt->execute([$channelID, $userID, $gameRole, $pointsEarned, $dateOfGame]);

            $jsonResult = array(
                "state" => "success"
            );
    
            http_response_code(200);
            echo json_encode($jsonResult);
            $stmt = null;
            exit();
        }
        else {
            http_response_code(404);
            exit();
        }
    }
    else {
        http_response_code(404);
        exit();
    }
?>