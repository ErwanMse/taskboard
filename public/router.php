<?php

$uri = $_SERVER['REQUEST_URI'];

if (str_starts_with($uri, '/api/')) {
    $path = __DIR__ . '/../' . $uri . '.php';

    if (file_exists($path)) {
        require $path;
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
    return;
}

return false;
