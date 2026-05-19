<?php
$conn = new mysqli("localhost", "root", "", "chess");

$result = $conn->query("SELECT * FROM chess_games ORDER BY id DESC LIMIT 1");

header("Content-Type: application/json");

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(["error" => "no saved game"]);
}
?>