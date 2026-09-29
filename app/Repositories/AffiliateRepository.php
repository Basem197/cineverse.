<?php
// Path: cineverse/app/Repositories/AffiliateRepository.php

require_once __DIR__ . '/../../core/Database.php';

class AffiliateRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function logClick($data) {
        $stmt = $this->db->prepare("
            INSERT INTO affiliate_clicks (title_id, provider_id, country_id, user_id, ip_hash, user_agent, referrer, created_at)
            VALUES (:title_id, :provider_id, :country_id, :user_id, :ip_hash, :user_agent, :referrer, NOW())
        ");
        $stmt->bindValue(':title_id', $data['title_id'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':provider_id', $data['provider_id'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':country_id', $data['country_id'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $data['user_id'] ?? null, PDO::PARAM_INT);
        $stmt->bindValue(':ip_hash', $data['ip_hash'], PDO::PARAM_STR);
        $stmt->bindValue(':user_agent', $data['user_agent'], PDO::PARAM_STR);
        $stmt->bindValue(':referrer', $data['referrer'], PDO::PARAM_STR);
        return $stmt->execute();
    }
}