<?php
require_once __DIR__ . '/../src/TaskRepository.php';

header('Content-Type: application/json');

$repo = new TaskRepository();

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['title'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id or title']);
    exit;
}

$repo->updateTitle($data['id'], $data['title']);

echo json_encode(['status' => 'ok']);
