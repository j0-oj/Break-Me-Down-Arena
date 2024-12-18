<?php
     function validatePOSTData($parameterName) {
        return (
            (isset($_POST[$parameterName])) && 
            (filter_has_var(INPUT_POST, $parameterName))
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

        // Check if channelID, UUID & role exists & not empty in POST request
        if(validatePOSTData("roomID") && validatePOSTData("answerInput") && validatePOSTData("channelID")) {
            // Sanitize POST information
            $roomID      = sanitizePOSTData("roomID");
            $answerInput = sanitizePOSTData("answerInput");
            $channelID   = sanitizePOSTData("channelID");

            // Get userID of UUID from session
            $stmt = $pdo->prepare(
                "SELECT flagAnswer FROM room WHERE roomID = ?;"
            );
            $stmt->execute([$roomID]);

            $resultArray = $stmt->fetch();
            $flagAnswer  = $resultArray["flagAnswer"];

            // Get defenderPts and attackerPts
            $stmt = $pdo->prepare(
                "SELECT defenderPts, attackerPts FROM arena WHERE channelID = ?;"
            );
            $stmt->execute([$channelID]);

            $resultArray = $stmt->fetch();
            $defenderPts = $resultArray["defenderPts"];
            $attackerPts = $resultArray["attackerPts"];

            if($flagAnswer === $answerInput) {
                // Update role of player with userID & channelID
                $stmt = $pdo->prepare(
                    "UPDATE room
                     SET roomCompletion = ?
                     WHERE roomID = ?;"
                );
                $stmt->execute([1, $roomID]);

                // Update defenderPts and attackerPts of arena
                $defenderPts = $defenderPts - 1;
                $attackerPts = $attackerPts + 1;
                $stmt = $pdo->prepare(
                    "UPDATE arena
                     SET defenderPts = ?, attackerPts = ?
                     WHERE channelID = ?;"
                );
                $stmt->execute([$defenderPts, $attackerPts, $channelID]);

                $jsonResult = array(
                    "state" => "success"
                );
            }
            else {
                $jsonResult = array(
                    "state" => "error"
                );
            }

            http_response_code(200);
            echo json_encode($jsonResult);
            $stmt = null;
        }
        exit();
    }
    else {
        http_response_code(404);
        exit();
    }
?>