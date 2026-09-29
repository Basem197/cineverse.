<?php
// Path: cineverse/core/Response.php

class Response {
    public static function json($success, $data = null, $message = null, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        
        echo json_encode([
            'success' => $success,
            'data'    => $data,
            'message' => $message
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}