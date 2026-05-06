<?php
header('Content-type: application/json');

$dir = "./gif";

$files = scandir($dir);

$data = [];
foreach ($files as $file) {
    if ($file != "." && $file != "..") {
        $data[] = $file;
    }
}

echo json_encode(['success' => true, "files" => $data]);
