<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "gebruikers";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Verbinding mislukt: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($username) || strlen($username) < 3) {
        $error_message = "Gebruikersnaam moet minimaal 3 tekens zijn.";
    } elseif (empty($password) || strlen($password) < 6) {
        $error_message = "Wachtwoord moet minimaal 6 tekens zijn.";
    } else {
        $username = htmlspecialchars($username);
        $password = htmlspecialchars($password);

        $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($hashed_password);
            $stmt->fetch();

            if (password_verify($password, $hashed_password)) {
                $_SESSION['username'] = $username;
                header("Location: ../Dashboard/");
                exit;
            } else {
                $error_message = "Ongeldig wachtwoord.";
            }
        } else {
            $error_message = "Geen gebruiker gevonden met die gebruikersnaam.";
        }

        $stmt->close();
    }
}

$conn->close();
?>
