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
        if(validateGETData("channelID")) {
            // Sanitize GET information
            $channelID = sanitizeGETData("channelID");
            $stmt = $pdo->prepare(
                "SELECT attackerPts, defenderPts
                 FROM arena
                 WHERE channelID = ?;"
            );
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {
            $jsonResult = array(
                "attackerPoints" => $resultArray["attackerPts"],
                "defenderPoints" => $resultArray["defenderPts"]
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