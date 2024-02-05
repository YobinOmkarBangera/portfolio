<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost"; 
    $username = "yobin"; 
    $password = "Yrol@6445"; 
    $dbname = "portfolio_database"; 

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Check if fields are set and not empty
    if (isset($_POST['name']) && !empty($_POST['name']) &&
        isset($_POST['email']) && !empty($_POST['email']) &&
        isset($_POST['message']) && !empty($_POST['message'])) {

        // Collect post variables
        $name = $conn->real_escape_string($_POST['name']);
        $email = $conn->real_escape_string($_POST['email']);
        $subject = isset($_POST['subject']) ? $conn->real_escape_string($_POST['subject']) : ""; 
        $message = $conn->real_escape_string($_POST['message']);

        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO contact_details (name, email, subject, message) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $email, $subject, $message);

        // Execute and check
        if ($stmt->execute()) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Please fill in all required fields.";
    }

    $conn->close();
} else {
    // Display an error or redirect if accessed directly without form submission
    echo "Access denied.";
}
?>
