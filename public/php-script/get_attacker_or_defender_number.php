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

        // Check if channelID exists & not empty in POST request
        if(validateGETData("channelID") && validateGETData("role")) {
            // Sanitize GET information
            $channelID = sanitizeGETData("channelID");
            $role      = sanitizeGETData("role");
            if($role === "attacker") {
                $stmt = $pdo->prepare(
                    "SELECT attackerPlayerLimit 
                     FROM arena
                     WHERE channelID = ?;"
                );
            }
            if($role === "defender") {
                $stmt = $pdo->prepare(
                    "SELECT defenderPlayerLimit 
                     FROM arena
                     WHERE channelID = ?;"
                );
            }
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {
            if($role === "attacker") {
                $jsonResult = array(
                    "attackerLimit" => $resultArray["attackerPlayerLimit"]
                );
            }
            if($role === "defender") {
                $jsonResult = array(
                    "defenderLimit" => $resultArray["defenderPlayerLimit"]
                );
            }
            

            http_response_code(200);
            echo json_encode($jsonResult);
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