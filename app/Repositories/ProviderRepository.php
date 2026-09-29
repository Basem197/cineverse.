<?php
// Path: cineverse/app/Repositories/ProviderRepository.php

require_once __DIR__ . '/../../core/Database.php';

class ProviderRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        // افترضت أن اسم الجدول providers (عدل اسم الجدول لو مختلف عندك)
        $stmt = $this->db->query("SELECT * FROM providers ORDER BY provider_name ASC");
        return $stmt->fetchAll();
    }
}