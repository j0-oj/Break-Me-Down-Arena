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

        $jsonResult             = array();
        $numberOfRoom           = 0;
        $numeberOfCompletedRoom = 0;

        // Check if channelID exists & not empty in POST request
        if(validateGETData("channelID")) {
            // Sanitize GET information
            $channelID = sanitizeGETData("channelID");

            $stmt = $pdo->prepare(
                "SELECT COUNT(*) 
                 FROM room
                 LEFT JOIN arena_room ON room.roomID = arena_room.roomID 
                 WHERE arena_room.channelID = ?"
            );
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {

            $numberOfRoom = $resultArray["COUNT(*)"];

        }
        else {
            http_response_code(404);
            $stmt = null;
            exit();
        }

        // Get all count of rooms that are completed

        $stmt = $pdo->prepare(
            "SELECT COUNT(*) 
             FROM room
             LEFT JOIN arena_room ON room.roomID = arena_room.roomID 
             WHERE arena_room.channelID = ? AND room.roomCompletion = 1;"
        );
        $stmt->execute([$channelID]);

        $resultArray = $stmt->fetch();

        if($resultArray) {

            $numeberOfCompletedRoom = $resultArray["COUNT(*)"];

        }
        else {
            http_response_code(404);
            $stmt = null;
            exit();
        }

        if($numberOfRoom === $numeberOfCompletedRoom) {
            $jsonResult = array(
                "state" => "True"
            );
        }
        else {
            $jsonResult = array(
                "state" => "False"
            );
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
?>