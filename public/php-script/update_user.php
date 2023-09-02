<?php
function validatePOSTData($parameterName)
{
    return (
        (isset($_POST[$parameterName])) &&
        (filter_has_var(INPUT_POST, $parameterName))
    );
}

function sanitizePOSTData($parameterName)
{
    $data = trim($_POST[$parameterName]);
    $data = htmlspecialchars($data, ENT_QUOTES);
    $data = stripslashes($data);
    $data = strip_tags($data);

    return $data;
}

// If a POST request is not made throw "Forbidden"
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Setup PDO connection with MySQL server
    $pdoPHPscriptPath = __DIR__ . "/../../config/pdo_connection.php";
    require_once($pdoPHPscriptPath);

    if (validatePOSTData("username") && validatePOSTData("userID")) {
        $username = sanitizePOSTData("username");
        $userID = sanitizePOSTData("userID");
        $stmt = $pdo->prepare(
            "UPDATE user
             SET username = ?
             WHERE userID = ?;"
        );
        $stmt->execute([$username, $userID]);
    }

    if (validatePOSTData("firstName") && validatePOSTData("userID")) {
        $firstName = sanitizePOSTData("firstName");
        $userID = sanitizePOSTData("userID");
        $stmt = $pdo->prepare(
            "UPDATE user
             SET firstName = ?
             WHERE userID = ?;"
        );
        $stmt->execute([$firstName, $userID]);
    }

    if (validatePOSTData("lastName") && validatePOSTData("userID")) {
        $lastName = sanitizePOSTData("lastName");
        $userID = sanitizePOSTData("userID");
        $stmt = $pdo->prepare(
            "UPDATE user
             SET lastName = ?
             WHERE userID = ?;"
        );
        $stmt->execute([$lastName, $userID]);
    }

    if (validatePOSTData("email") && validatePOSTData("userID")) {
        $email = sanitizePOSTData("email");
        $userID = sanitizePOSTData("userID");
        $stmt = $pdo->prepare(
            "UPDATE user
             SET email = ?
             WHERE userID = ?;"
        );
        $stmt->execute([$email, $userID]);
    }

    if (validatePOSTData("userPassword") && validatePOSTData("userID")) {
        $userPassword = sanitizePOSTData("userPassword");
        $userID = sanitizePOSTData("userID");
        $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare(
            "UPDATE user
             SET userPassword = ?
             WHERE userID = ?;"
        );
        $stmt->execute([$hashedPassword, $userID]);
    }

    $jsonResult = array(
        "state" => "success"
    );
    http_response_code(200);
    echo json_encode($jsonResult);
    $stmt = null;
    exit();
} else {
    http_response_code(404);
    exit();
}
?>