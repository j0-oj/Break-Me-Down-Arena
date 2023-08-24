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
                "SELECT user.username 
                 FROM arena_player
                 LEFT JOIN user
                 ON arena_player.userID = user.userID
                 WHERE arena_player.channelID = ?;"
            );
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetchAll();

        if($resultArray) {

            // print_r($resultArray);

            $jsonResult = array();

            for($index = 0; $index < count($resultArray); $index++) {
                $username = [];
                $playerUsername = $resultArray[$index]["username"];
                $username["username"] = $playerUsername;
                array_push($jsonResult, $username);
            }

            // print_r($jsonResult);
            http_response_code(200);
            echo json_encode($jsonResult);

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