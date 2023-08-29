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

            // Get points of current channel from arena
            $stmt = $pdo->prepare(
                "SELECT hasSettingsBeenSet FROM arena WHERE channelID = ?;"
            );
            $stmt->execute([$channelID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {
            if($resultArray["hasSettingsBeenSet"] === 0) {
                $jsonResult = array(
                    "state" => "False"
                );
            }
            if($resultArray["hasSettingsBeenSet"] === 1) {
                $jsonResult = array(
                    "state" => "True"
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
    }
    else {
        http_response_code(404);
        exit();
    }
?>