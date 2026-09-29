<?php
// Path: cineverse/app/Controllers/AffiliateController.php

require_once __DIR__ . '/../Services/AffiliateService.php';
require_once __DIR__ . '/../../core/Response.php';

class AffiliateController {
    private $affiliateService;

    public function __construct() {
        $this->affiliateService = new AffiliateService();
    }

    // Endpoint: POST /api/affiliate/track
    public function track() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $this->affiliateService->trackClick($input ?? []);
            Response::json(true, null, 'Click tracked successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}