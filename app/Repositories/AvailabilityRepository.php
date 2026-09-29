<?php
// Path: cineverse/app/Repositories/AvailabilityRepository.php

require_once __DIR__ . '/../../core/Database.php';

class AvailabilityRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAvailabilityByTitleAndCountry($titleId, $countryCode) {
        $stmt = $this->db->prepare("
            SELECT 
                sp.name as provider_name,
                sp.logo_path as provider_logo,
                c.code as country_code,
                c.name as country_name,
                ta.availability_type,
                ta.official_url,
                pal.affiliate_url,
                ta.verified_at
            FROM title_availability ta
            JOIN streaming_providers sp ON ta.provider_id = sp.id
            JOIN countries c ON ta.country_id = c.id
            LEFT JOIN provider_affiliate_links pal ON pal.provider_id = sp.id AND pal.country_id = c.id
            WHERE ta.title_id = :title_id AND c.code = :country_code
        ");
        $stmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        $stmt->bindValue(':country_code', strtoupper($countryCode), PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}