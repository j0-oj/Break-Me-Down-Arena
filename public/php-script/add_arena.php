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
        if(validatePOSTData("channelID")) {
            // Sanitize GET information
            $channelID = sanitizePOSTData("channelID");
            $stmt = $pdo->prepare(
                "INSERT INTO arena (channelID) VALUES (?);"
            );
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetch();

        $jsonResult = array(
            "state" => "success"
        );

        http_response_code(200);
        echo json_encode($jsonResult);
    }
    else {
        http_response_code(404);
        exit();
    }
?>