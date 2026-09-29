<?php
// Path: cineverse/app/Repositories/GenreRepository.php

require_once __DIR__ . '/../../core/Database.php';

class GenreRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // جلب كل التصنيفات مرتبة أبجدياً
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM genres ORDER BY name ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // البحث عن تصنيف بالـ ID
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM genres WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }
}