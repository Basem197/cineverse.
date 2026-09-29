<?php
// Path: cineverse/core/AdminMiddleware.php

require_once __DIR__ . '/AuthMiddleware.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

class AdminMiddleware {
    public static function protect() {
        $userId = AuthMiddleware::protect();
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', (int)$userId, PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch();

        if (!$user || !isset($user['role']) || $user['role'] !== 'admin') {
            Response::json(false, null, 'Forbidden: Admin privileges required', 403);
            exit;
        }

        return $userId;
    }
}