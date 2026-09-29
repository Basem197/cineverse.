<?php
// Path: cineverse/app/Repositories/WatchlistRepository.php

require_once __DIR__ . '/../../core/Database.php';

class WatchlistRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getUserWatchlist($userId) {
        // بنعمل JOIN مع جدول titles عشان نرجع بيانات الفيلم نفسه مش بس الـ ID
        $stmt = $this->db->prepare("
            SELECT w.title_id, w.created_at, t.title 
            FROM watchlist w 
            JOIN titles t ON w.title_id = t.id 
            WHERE w.user_id = :user_id 
            ORDER BY w.created_at DESC
        ");
        $stmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function addTitle($userId, $titleId) {
        // التأكد الأول إن الفيلم مش موجود في القائمة عشان نمنع التكرار
        $checkStmt = $this->db->prepare("SELECT id FROM watchlist WHERE user_id = :user_id AND title_id = :title_id");
        $checkStmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $checkStmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        $checkStmt->execute();

        if ($checkStmt->fetch()) {
            throw new Exception("Title is already in your watchlist.");
        }

        $stmt = $this->db->prepare("INSERT INTO watchlist (user_id, title_id) VALUES (:user_id, :title_id)");
        $stmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $stmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        return $stmt->execute();
    }
}