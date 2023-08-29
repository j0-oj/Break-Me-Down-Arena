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
            if($role === "king-defender") {
                $stmt = $pdo->prepare(
                    "SELECT COUNT(*) 
                     FROM arena_player
                     WHERE channelID = ? AND playerStatus = 'KING-DEFENDER';"
                );
            }
            if($role === "attacker") {
                $stmt = $pdo->prepare(
                    "SELECT COUNT(*) 
                     FROM arena_player
                     WHERE channelID = ? AND playerStatus = 'ATTACKER';"
                );
            }
            if($role === "defender") {
                $stmt = $pdo->prepare(
                    "SELECT COUNT(*) 
                     FROM arena_player
                     WHERE channelID = ? AND playerStatus = 'DEFENDER';"
                );
            }
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {
            $jsonResult = array(
                "playerCount" => $resultArray["COUNT(*)"]
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