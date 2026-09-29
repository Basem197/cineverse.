<?php
// Path: cineverse/app/Controllers/FamilyGuideController.php

require_once __DIR__ . '/../Services/FamilyGuideService.php';
require_once __DIR__ . '/../../core/Response.php';

class FamilyGuideController {
    private $guideService;

    public function __construct() {
        $this->guideService = new FamilyGuideService();
    }

    // Endpoint: GET /api/titles/{id}/family-guide
    public function show($id) {
        try {
            $guide = $this->guideService->getFamilyGuide($id);
            Response::json(true, $guide, 'Family guide retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}