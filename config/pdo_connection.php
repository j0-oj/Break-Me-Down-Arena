<?php
    $configurationPath = __DIR__ . "/config.ini";
    $config            = parse_ini_file($configurationPath);

    $db_host     = $config["db_host"];
    $db_name     = $config["db_name"];
    $db_user     = $config["db_user"];
    $db_password = $config["db_password"];
    $db_charset  = $config["db_charset"];

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false
    ];

    $dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset";

    try {

        $pdo = new PDO($dsn, $db_user, $db_password, $options);
        
    } catch (PDOException $error) {

        echo $error->getMessage();
        
    }
?>