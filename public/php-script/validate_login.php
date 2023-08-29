<?php
    function validatePOSTData($parameterName) {
        return (
            (isset($_POST[$parameterName])) && 
            (filter_has_var(INPUT_POST, $parameterName)) && 
            ($_POST[$parameterName] !== "")
        );
    }

    function sanitizePOSTData($parameterName) {
        $data = trim($_POST[$parameterName]);
        $data = htmlspecialchars($data, ENT_QUOTES);
        $data = stripslashes($data);
        $data = strip_tags($data);

        return $data;
    }

    function clientIPAddress() {
        if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $clientIP = ip2long($_SERVER['HTTP_CLIENT_IP']);
        } 
        elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $clientIP = ip2long($_SERVER['HTTP_X_FORWARDED_FOR']);
        } 
        else {
            $clientIP = ip2long($_SERVER['REMOTE_ADDR']);
        }

        return $clientIP;
    }

    // If a POST request is not made throw "Forbidden"
    if($_SERVER["REQUEST_METHOD"] === "POST") {

        // Retrieve information from POST form
        $username = "";
        $password = "";

        // UserID of user
        $userID = 0;

        // UUID of user
        $generatedUUID = "NIL";

        // Aid in checking if error occured
        $didAnErrorOccurArray = [];

        // Add remarks
        $remarkArray = [];

        // State of request
        $state = "";

        // Check if username exists & not empty in POST request
        if(validatePOSTData("username")) {
            // Sanitize POST information
            $username = sanitizePOSTData("username");
            // No issue occured
            array_push($didAnErrorOccurArray, True);
        }
        else {
            // An error occured
            array_push($didAnErrorOccurArray, False);
            // Add error remark
            array_push($remarkArray, "Username field is missing");
        }

        // Check if userPassword exists & not empty in POST request
        if(validatePOSTData("password")) {
            // Sanitize POST information
            $password = sanitizePOSTData("password");
            // No issue occured
            array_push($didAnErrorOccurArray, True);
        }
        else {
            // An error occured
            array_push($didAnErrorOccurArray, False);
            // Add error remark
            array_push($remarkArray, "Password field is missing");

        }

        // Continue only if form has all information
        if(!in_array(False, $didAnErrorOccurArray)) {
            // Setup PDO connection with MySQL server
            $pdoPHPscriptPath = __DIR__ . "/../../config/pdo_connection.php";
            require_once($pdoPHPscriptPath);

            try {
                // Check if credential exist
                $stmt = $pdo->prepare(
                    "SELECT userID, userPassword FROM user WHERE username = ?;"
                );
                $stmt->execute([$username]);
                $resultArray = $stmt->fetch();

                if($resultArray) {
                    // Check if password is correct
                    $hashedPasswordFromDatabase = $resultArray["userPassword"];
                    $verify = password_verify($password, $hashedPasswordFromDatabase);

                    if($verify) {
                        // Store userID
                        $userID = $resultArray["userID"];

                        // Check if user exist in session table
                        $stmt = $pdo->prepare(
                            "SELECT * FROM session WHERE userID = ?;"
                        );
                        $stmt->execute([$userID]);
                        $sessionResult = $stmt->fetch();
                        
                        if($sessionResult) {
                            // Delete record of user in session table
                            $stmt = $pdo->prepare(
                                "DELETE FROM session WHERE userID = ?;"
                            );
                            $stmt->execute([$userID]);
                        }

                        // Insert a new session and replace cookie UUID of client
                        // Generate UUID
                        require_once __DIR__ . "/generate_uuid.php";
                        $generatedUUID = guidv4();

                        // Capture IP Address of client
                        $clientIP = clientIPAddress();

                        // Insert a new session
                        $stmt = $pdo->prepare(
                            "INSERT INTO session (userID, UUID, ipAddress) VALUES (?, ?, ?)"
                        );
                        $stmt->execute([$userID, $generatedUUID, $clientIP]);
                        $stmt = null;
        
                        // No issue occured
                        array_push($didAnErrorOccurArray, True);
                    }
                    else {
                        // An error occured
                        array_push($didAnErrorOccurArray, False);
                        // Add error remark
                        array_push($remarkArray, "Credentials does not match");
                    }
                }
                else {
                    // An error occured
                    array_push($didAnErrorOccurArray, False);
                    // Add error remark
                    array_push($remarkArray, "Credentials does not exist");
                }
            } catch (PDOException $error) {
                // An error occured
                array_push($didAnErrorOccurArray, False);
                // Add error remark
                array_push($remarkArray, "Error occured during process");
            }
        }

        // An error was found
        if(in_array(False, $didAnErrorOccurArray)) {
            $state = "Error";
        }
        else {
            $state = "Successful";
            // Add successful remark
            array_push($remarkArray, "Credential is found");
        }

        $jsonResult = array(
            "state"  => $state,
            "remark" => $remarkArray,
            "UUID"   => $generatedUUID
        );
        
        http_response_code(200);
        echo json_encode($jsonResult);
        exit();
    }
    else {
        http_response_code(404);
        exit();
    }
?>