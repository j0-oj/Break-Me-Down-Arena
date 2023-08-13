<?php
    // If a POST request is not made throw "Forbidden"
    if($_SERVER["REQUEST_METHOD"] === "POST") {

        // Retrieve information from POST form
        $username        = "";
        $firstName       = "";
        $lastName        = "";
        $email           = "";
        $userPassword    = "";
        $confirmPassword = "";

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
            $username = strip_tags(htmlspecialchars($_POST["username"], ENT_QUOTES));

            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Username field is missing");

        }

        // Check if firstname exists & not empty in POST request
        if((isset($_POST["firstName"])) && 
           (filter_has_var(INPUT_POST, "firstName")) &&
           ($_POST["firstName"] !== "")) {

            // Sanitize POST information
            $firstName = strip_tags(htmlspecialchars($_POST["firstName"], ENT_QUOTES));

             // No issue occured
             array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "First Name field is missing");

        }

        // Check if lastName exists & not empty in POST request
        if((isset($_POST["lastName"])) && 
           (filter_has_var(INPUT_POST, "lastName")) &&
           ($_POST["lastName"] !== "")) {

            // Sanitize POST information
            $lastName = strip_tags(htmlspecialchars($_POST["lastName"], ENT_QUOTES));
            
            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Last Name field is missing");

        }

        // Check if email exists & not empty in POST request
        if((isset($_POST["email"])) && 
           (filter_has_var(INPUT_POST, "email")) &&
           ($_POST["email"] !== "")) {

            // Sanitize POST information
            $email = strip_tags(htmlspecialchars($_POST["email"], ENT_QUOTES));

            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Email field is missing");

        }

        // Check if userPassword exists & not empty in POST request
        if((isset($_POST["userPassword"])) && 
           (filter_has_var(INPUT_POST, "userPassword")) &&
           ($_POST["userPassword"] !== "")) {

            // Sanitize POST information
            $userPassword = strip_tags(htmlspecialchars($_POST["userPassword"], ENT_QUOTES));

            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Password field is missing");

        }

        // Check if confirmPassword exists & not empty in POST request
        if((isset($_POST["confirmPassword"])) && 
           (filter_has_var(INPUT_POST, "confirmPassword")) &&
           ($_POST["confirmPassword"] !== "")) {

            // Sanitize POST information
            $confirmPassword = strip_tags(htmlspecialchars($_POST["confirmPassword"], ENT_QUOTES));

            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Confirm Password field is missing");

        }

        // Check if both password and confirm password are the same
        if(strcmp($userPassword, $confirmPassword) === 0) {

            // No issue occured
            array_push($didAnErrorOccurArray, True);

        }
        else {

            // An error occured
            array_push($didAnErrorOccurArray, False);

            // Add error remark
            array_push($remarkArray, "Both passwords are not the same");

        }

        // Query to insert user details if no error is found
        if(!in_array(False, $didAnErrorOccurArray)) {

            // Hash password
            $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);

            // Setup PDO connection with MySQL server
            $pdoPHPscriptPath = __DIR__ . "/../../config/pdo_connection.php";
            require_once($pdoPHPscriptPath);

            try {

                $stmt = $pdo->prepare(
                    "INSERT INTO user (username, firstName, lastName, email, userPassword) VALUES (?, ?, ?, ?, ?)"
                );
    
                $stmt->execute([$username, $firstName, $lastName, $email, $hashedPassword]);
    
                $stmt = null;

                // No issue occured
                array_push($didAnErrorOccurArray, True);

            } catch (PDOException $error) {

                // An error occured
                array_push($didAnErrorOccurArray, False);

                // Add error remark
                array_push($remarkArray, "Error occured creating Account");

            }

        }

        // An error was found
        if(in_array(False, $didAnErrorOccurArray)) {

            $state = "Error";

        }
        else {

            $state = "Successful";

            // Add successful remark
            array_push($remarkArray, "Successfully registered user");

        }

        $jsonResult = array(
            "state"  => $state,
            "remark" => $remarkArray
        );
        
        http_response_code(200);

        echo json_encode($jsonResult);

    }
    else {

        http_response_code(404);
        exit();

    }
?>