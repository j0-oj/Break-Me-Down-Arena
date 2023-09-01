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

        if(validatePOSTData("channelID")) {
            // Sanitize POST information
            $channelID = sanitizePOSTData("channelID");

            // Get userID of UUID from session
            $stmt = $pdo->prepare(
                "UPDATE arena
                 SET hasGameFinished = ?
                 WHERE channelID = ?;"
            );
            $stmt->execute([1, $channelID]);
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