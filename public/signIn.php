<?php

if (isset($_POST['username']) && isset($_POST['password'])) {
    function validate($data)
    {

        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    $username = validate($_POST['username']);
    $password = validate($_POST['password']);

    if (empty($username)) {

        header("Location: index.php?error=Username is required");
        exit();

    } elseif (empty($password)) {

        header("Location: index.php?error=Password is required");
        exit();

    } elseif (empty($username) && empty($password)) {

        header("Location: index.php?error=Username and Password is required");
        exit();

    } else {

        echo "Valid input";
    }

} else {
    header("Location: index.php");
    exit();
}



?>