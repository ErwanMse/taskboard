<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../src/TaskRepository.php';

header('Content-Type: application/json');

$repo = new TaskRepository();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        echo json_encode($repo->getAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $title = $data['title'] ?? '';
        $tag   = $data['tag'] ?? 'none'; 

        $repo->create($title, $tag);       

        echo json_encode(['status' => 'ok']);
        break;
}
