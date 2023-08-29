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

        if(
            validatePOSTData("defenderLimit") && 
            validatePOSTData("attackerLimit") && 
            validatePOSTData("timeLimit") && 
            validatePOSTData("points") && 
            validatePOSTData("channelID")
        ) {
            // Sanitize GET information
            $defenderLimit = sanitizePOSTData("defenderLimit");
            $attackerLimit = sanitizePOSTData("attackerLimit");
            $timeLimit     = sanitizePOSTData("timeLimit");
            $points        = sanitizePOSTData("points");
            $channelID     = sanitizePOSTData("channelID");
            $stmt = $pdo->prepare(
                "UPDATE arena
                 SET
                 defenderPts = ?, 
                 attackerPts = ?, 
                 defenderPlayerLimit = ?, 
                 attackerPlayerLimit = ?,
                 hasSettingsBeenSet = ?, 
                 timeLimit = ?
                 WHERE channelID = ?;"
                
            );
            $stmt->execute([$points, 0, $defenderLimit, $attackerLimit, 1, $timeLimit, $channelID]);
        }

        $resultArray = $stmt->fetch();

        $jsonResult = array(
            "state" => "success"
        );

        http_response_code(200);
        echo json_encode($jsonResult);
        exit();
    }
    else {
        http_response_code(404);
        exit();
    }
?>