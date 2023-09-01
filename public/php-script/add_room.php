<?php
    function validatePOSTData($parameterName) {
        return (
            (isset($_POST[$parameterName])) && 
            (filter_has_var(INPUT_POST, $parameterName))
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

        $jsonResult = array();

        if(
            validatePOSTData("channelID") && 
            validatePOSTData("title") && 
            validatePOSTData("flagDescription") && 
            validatePOSTData("flagAnswer")
        ) {

            // Sanitize POST information
            $channelID       = sanitizePOSTData("channelID");
            $title           = sanitizePOSTData("title");
            $flagDescription = sanitizePOSTData("flagDescription");
            $flagAnswer      = sanitizePOSTData("flagAnswer");

            if(!empty($_FILES['flagFile']['tmp_name'])) {
                $uploadDirectory = __DIR__ . "/../uploads/";
                $uploadFile      = $uploadDirectory . basename($_FILES["flagFile"]["name"]);
                $nameOfFile      = "uploads/" . basename($_FILES["flagFile"]["name"]);
                
                // Only upload to table if file is saved properly
                if(move_uploaded_file($_FILES['flagFile']['tmp_name'], $uploadFile)) {

                    // Insert new room
                    $stmt = $pdo->prepare(
                        "INSERT INTO room (title, flagDescription, flagAnswer, nameOfFile) VALUES (?, ?, ?, ?);"
                    );
                    $stmt->execute([$title, $flagDescription, $flagAnswer, $nameOfFile]);

                    // Get newly created record's ID
                    $roomID = $pdo->lastInsertId();

                    // Insert newly created room record ID into arena_room with associated channelID
                    $stmt = $pdo->prepare(
                        "INSERT INTO arena_room (channelID, roomID) VALUES (?, ?);"
                    );
                    $stmt->execute([$channelID, $roomID]);

                    $jsonResult = array(
                        "state" => "success"
                    );
                }
                else {
                    $jsonResult = array(
                        "state" => "error"
                    );
                }
            }
            else {
                // Insert new room
                $stmt = $pdo->prepare(
                    "INSERT INTO room (title, flagDescription, flagAnswer, nameOfFile) VALUES (?, ?, ?, ?);"
                );
                $stmt->execute([$title, $flagDescription, $flagAnswer, ""]);

                // Get newly created record's ID
                $roomID = $pdo->lastInsertId();

                // Insert newly created room record ID into arena_room with associated channelID
                $stmt = $pdo->prepare(
                    "INSERT INTO arena_room (channelID, roomID) VALUES (?, ?);"
                );
                $stmt->execute([$channelID, $roomID]);

                $jsonResult = array(
                    "state" => "success"
                );
            }
        }

        http_response_code(200);
        echo json_encode($jsonResult);
        exit();
    }
    else {
        http_response_code(404);
        exit();
    }
?>