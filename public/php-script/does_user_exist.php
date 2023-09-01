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

        // Check if UUID exists & not empty in POST request
        if(validateGETData("UUID")) {
            // Sanitize GET information
            $UUID = sanitizeGETData("UUID");
            $stmt = $pdo->prepare(
                "SELECT user.userID
                 FROM user
                 LEFT JOIN session
                 ON user.userID = session.userID
                 WHERE session.UUID = ?;"
            );
            $stmt->execute([$UUID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {
            $jsonResult = array(
                "state" => "success"
            );

            http_response_code(200);
            echo json_encode($jsonResult);
            $stmt = null;
            exit();
        }
        else {
            $jsonResult = array(
                "state" => "error"
            );

            http_response_code(200);
            echo json_encode($jsonResult);
            $stmt = null;
            exit();
        }
    }
    else {
        http_response_code(404);
        exit();
    }
?>