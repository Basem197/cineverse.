<?php
// Path: cineverse/app/Services/AffiliateService.php

require_once __DIR__ . '/../Repositories/AffiliateRepository.php';

class AffiliateService {
    private $affiliateRepo;

    public function __construct() {
        $this->affiliateRepo = new AffiliateRepository();
    }

    public function trackClick($data) {
        $ipHash = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $referrer = $_SERVER['HTTP_REFERER'] ?? 'Direct';

        $payload = [
            'title_id' => $data['title_id'] ?? null,
            'provider_id' => $data['provider_id'] ?? null,
            'country_id' => $data['country_id'] ?? null,
            'user_id' => $data['user_id'] ?? null,
            'ip_hash' => $ipHash,
            'user_agent' => substr($userAgent, 0, 255),
            'referrer' => substr($referrer, 0, 255)
        ];

        return $this->affiliateRepo->logClick($payload);
    }
}