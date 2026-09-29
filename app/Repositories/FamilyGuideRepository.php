<?php
// Path: cineverse/app/Repositories/FamilyGuideRepository.php

require_once __DIR__ . '/../../core/Database.php';

class FamilyGuideRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getByTitleId($titleId) {
        $stmt = $this->db->prepare("
            SELECT age_recommendation, violence, language, sexual_content, drugs, fear, nudity, parent_note, overall_level
            FROM family_guides
            WHERE title_id = :title_id
            LIMIT 1
        ");
        $stmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }
}