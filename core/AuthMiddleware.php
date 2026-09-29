<?php
// Path: cineverse/core/AuthMiddleware.php

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/JWT.php';

class AuthMiddleware {
    public static function protect() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization']) && !isset($headers['authorization'])) {
            Response::json(false, null, "Unauthorized: No token provided", 401);
        }

        $authHeader = $headers['Authorization'] ?? $headers['authorization'];
        
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::json(false, null, "Unauthorized: Invalid token format", 401);
        }

        $token = $matches[1];
        $jwtConfig = require __DIR__ . '/../config/jwt.php';
        
        // محاولة فك التشفير
        $jwtClass = 'JWT';
        $payload = $jwtClass::decode($token, $jwtConfig['secret']);

        if (!$payload) {
            Response::json(false, null, "Unauthorized: Invalid or expired token", 401);
        }

        // إرجاع الـ ID الحقيقي الخاص بالمستخدم
        return $payload['user_id'];
    }
}