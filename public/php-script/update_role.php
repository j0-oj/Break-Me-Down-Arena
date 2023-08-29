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

        // Check if channelID, UUID & role exists & not empty in POST request
        if(validatePOSTData("channelID") && validatePOSTData("UUID") && validatePOSTData("role")) {
            // Sanitize POST information
            $channelID = sanitizePOSTData("channelID");
            $UUID      = sanitizePOSTData("UUID");
            $role      = sanitizePOSTData("role");

            // Get userID of UUID from session
            $stmt = $pdo->prepare(
                "SELECT userID FROM session WHERE UUID = ?;"
            );
            $stmt->execute([$UUID]);

            $resultArray = $stmt->fetch();
            $userID      = $resultArray["userID"];

            // Update role of player with userID & channelID
            $stmt = $pdo->prepare(
                "UPDATE arena_player
                 SET playerStatus = ?
                 WHERE channelID = ? AND userID = ?;"
                
            );
            $stmt->execute([$role, $channelID, $userID]);
        }

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
?>