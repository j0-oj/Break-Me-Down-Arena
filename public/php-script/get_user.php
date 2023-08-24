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

        // Check if userID exists & not empty in POST request
        if(validateGETData("userID")) {
            // Sanitize GET information
            $userID = sanitizeGETData("userID");
            $stmt = $pdo->prepare(
                "SELECT * FROM user WHERE userID = ?;"
            );
            $stmt->execute([$userID]);
        }
        // Check if username exists & not empty in POST request
        else if(validateGETData("username")) {
            // Sanitize GET information
            $username = sanitizeGETData("username");
            $stmt = $pdo->prepare(
                "SELECT * FROM user WHERE username = ?;"
            );
            $stmt->execute([$username]);
        }
        // Check if UUID exists & not empty in POST request
        else if(validateGETData("UUID")) {
            // Sanitize GET information
            $UUID = sanitizeGETData("UUID");
            $stmt = $pdo->prepare(
                "SELECT user.userID, user.username, user.firstName, user.lastName, user.email, user.userPassword
                 FROM user
                 LEFT JOIN session
                 ON session.UUID = ?;"
            );
            $stmt->execute([$UUID]);
        }

        $resultArray = $stmt->fetch();

        if($resultArray) {
            $jsonResult = array(
                "userID"        => $resultArray["userID"],
                "username"      => $resultArray["username"],
                "firstName"     => $resultArray["firstName"],
                "lastName"      => $resultArray["lastName"],
                "email"         => $resultArray["email"],
                "userPassword"  => $resultArray["userPassword"],
            );

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