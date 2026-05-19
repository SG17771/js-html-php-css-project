<?php
$conn = new mysqli("localhost", "root", "", "chess");

$data = json_decode(file_get_contents("php://input"), true);

$turn_number = $data['turn_number'];
$turn_color  = $data['turn_color'];
$score       = $data['score'];

$squares = ["a1","b1","c1","d1","e1","f1","g1","h1",
            "a2","b2","c2","d2","e2","f2","g2","h2",
            "a3","b3","c3","d3","e3","f3","g3","h3",
            "a4","b4","c4","d4","e4","f4","g4","h4",
            "a5","b5","c5","d5","e5","f5","g5","h5",
            "a6","b6","c6","d6","e6","f6","g6","h6",
            "a7","b7","c7","d7","e7","f7","g7","h7",
            "a8","b8","c8","d8","e8","f8","g8","h8"];

$col_names = "turn_number, turn_color, score";

$col_values = "'$turn_number', '$turn_color', '$score'";

foreach ($squares as $sq) {
    $piece = $conn->real_escape_string($data[$sq] ?? "");
    $color = $conn->real_escape_string($data[$sq . "_color"] ?? "");

    $col_names  .= ", `$sq`, `{$sq}_color`";
    $col_values .= ", '$piece', '$color'";
}

$sql = "INSERT INTO chess_games ($col_names) VALUES ($col_values)";
$conn->query($sql);
?>