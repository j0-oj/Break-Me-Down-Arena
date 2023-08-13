<?php
    // If a POST request is not made throw "Forbidden"
    if($_SERVER["REQUEST_METHOD"] === "POST") {

        // Retrieve information from POST form
        $username = "";
        $password = "";

        // UUID of user
        $generatedUUID = "";

        // Aid in checking if error occured
        $didAnErrorOccurArray = [];

        // Add remarks
        $remarkArray = [];

        // State of request
        $state = "";

        // Check if username exists & not empty in POST request
        if((isset($_POST["username"])) && 
           (filter_has_var(INPUT_POST, "username")) &&
           ($_POST["username"] !== "")) {

            // Sanitize POST information
            $username = trim($_POST["username"]);
            $username = htmlspecialchars($username, ENT_QUOTES);
            $username = stripslashes($username);
            $username = strip_tags($username);

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
        if((isset($_POST["password"])) && 
           (filter_has_var(INPUT_POST, "password")) &&
           ($_POST["password"] !== "")) {

            // Sanitize POST information
            $password = trim($_POST["password"]);
            $password = htmlspecialchars($password, ENT_QUOTES);
            $password = stripslashes($password);
            $password = strip_tags($password);

            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Password field is missing");

        }

        // Query to insert user details if no error is found
        if(!in_array(False, $didAnErrorOccurArray)) {

            // Setup PDO connection with MySQL server
            $pdoPHPscriptPath = __DIR__ . "/../../config/pdo_connection.php";
            require_once($pdoPHPscriptPath);

            try {

                $stmt = $pdo->prepare(
                    "SELECT username, userPassword FROM user WHERE username = ?;"
                );
    
                $stmt->execute([$username]);

                $resultArray = $stmt->fetch();

                // Check if any result is found
                if(!$resultArray) {

                    // An error occured
                    array_push($didAnErrorOccurArray, False);

                    // Add error remark
                    array_push($remarkArray, "Credentials does not exist");

                }
                else {

                    // No issue occured
                    array_push($didAnErrorOccurArray, True);

                    // Check if password is correct
                    $hashedPasswordFromDatabase = $resultArray["userPassword"];
                    $verify = password_verify($password, $hashedPasswordFromDatabase);

                    if($verify) {

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
    
                $stmt = null;

                // No issue occured
                array_push($didAnErrorOccurArray, True);

            } catch (PDOException $error) {

                // An error occured
                array_push($didAnErrorOccurArray, False);

                // Add error remark
                array_push($remarkArray, "Error occured during connection");

            }

        }

        // Credentials is found proceed to UID creation (No error has occured)
        if(!in_array(False, $didAnErrorOccurArray)) {

            require_once __DIR__ . "/generate_uuid.php";
            $generatedUUID = guidv4();

        }
        else {
            $generatedUUID = "NIL";
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

    }
    else {

        http_response_code(404);
        exit();

    }
?>