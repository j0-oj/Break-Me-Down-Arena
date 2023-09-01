<?php
    function validateGETData($parameterName) {
        return (
            (isset($_GET[$parameterName])) && 
            (filter_has_var(INPUT_GET, $parameterName)) && 
            ($_GET[$parameterName] !== "")
        );
    }

    function sanitizeGETData($parameterName) {
        $data = trim($_GET[$parameterName]);
        $data = htmlspecialchars($data, ENT_QUOTES);
        $data = stripslashes($data);
        $data = strip_tags($data);

        return $data;
    }

    // If a POST request is not made throw "Forbidden"
    if($_SERVER["REQUEST_METHOD"] === "GET") {
        // Setup PDO connection with MySQL server
        $pdoPHPscriptPath = __DIR__ . "/../../config/pdo_connection.php";
        require_once($pdoPHPscriptPath);

        if(validateGETData("userID")) {
            // Sanitize GET information
            $userID = sanitizeGETData("userID");

            $stmt = $pdo->prepare(
                "SELECT history.dateOfGame, history.gameRole, history.pointsEarned, arena.defenderPts, arena.attackerPts
                 FROM history 
                 LEFT JOIN arena ON history.channelID = arena.channelID 
                 WHERE history.userID = ?
                 ORDER BY history.historyID DESC
                 LIMIT 5;"
            );
            $stmt->execute([$userID]);

        }

        $resultArray = $stmt->fetchAll();

        if($resultArray) {

            $jsonResult = array();

            for($index = 0; $index < count($resultArray); $index++) {
                
                $historyDetails = [];

                $dateOfGame   = $resultArray[$index]["dateOfGame"];
                $gameRole     = $resultArray[$index]["gameRole"];
                $pointsEarned = $resultArray[$index]["pointsEarned"];
                $defenderPts  = $resultArray[$index]["defenderPts"];
                $attackerPts  = $resultArray[$index]["attackerPts"];
                $result       = "";

                if(($gameRole === "DEFENDER") || ($gameRole === "KING-DEFENDER")) {
                    if($defenderPts > $attackerPts) {
                        $result = "WINNER";
                    }
                    elseif($defenderPts < $attackerPts) {
                        $result = "LOSER";
                    }
                    else {
                        $result = "STALEMATE";
                    }
                }
                if($gameRole === "ATTACKER") {
                    if($attackerPts > $defenderPts) {
                        $result = "WINNER";
                    }
                    elseif($attackerPts < $defenderPts) {
                        $result = "LOSER";
                    }
                    else {
                        $result = "STALEMATE";
                    }
                }

                $historyDetails["dateOfGame"]   = $dateOfGame;
                $historyDetails["gameRole"]     = $gameRole;
                $historyDetails["pointsEarned"] = $pointsEarned;
                $historyDetails["result"]       = $result;

                array_push($jsonResult, $historyDetails);
            }

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