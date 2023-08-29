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
                "SELECT room.roomID ,room.title, room.flagDescription, room.nameOfFile 
                 FROM room 
                 LEFT JOIN arena_room ON room.roomID = arena_room.roomID 
                 WHERE arena_room.channelID = ?;"
            );
            $stmt->execute([$channelID]);

        }

        $resultArray = $stmt->fetchAll();

        if($resultArray) {

            $jsonResult = array();

            for($index = 0; $index < count($resultArray); $index++) {
                
                $roomDetails = [];

                $roomID          = $resultArray[$index]["roomID"];
                $title           = $resultArray[$index]["title"];
                $flagDescription = $resultArray[$index]["flagDescription"];
                $nameOfFile      = $resultArray[$index]["nameOfFile"];

                $roomDetails["roomID"]          = $roomID;
                $roomDetails["title"]           = $title;
                $roomDetails["flagDescription"] = $flagDescription;
                $roomDetails["nameOfFile"]      = $nameOfFile;

                array_push($jsonResult, $roomDetails);
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
    }
    else {
        http_response_code(404);
        exit();
    }
?>