<?php
    // If a POST request is not made throw "Forbidden"
    if($_SERVER["REQUEST_METHOD"] === "GET") {
        // Generate UUID
        require_once __DIR__ . "/generate_uuid.php";
        $generatedChannelUUID = guidv4();

        $jsonResult = array(
            "channel_id"  => $generatedChannelUUID
        );
        
        http_response_code(200);
        echo json_encode($jsonResult);
    }
    else {
        http_response_code(404);
        exit();
    }
?>