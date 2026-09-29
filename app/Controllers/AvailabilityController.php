<?php
// Path: cineverse/app/Controllers/AvailabilityController.php

require_once __DIR__ . '/../Services/AvailabilityService.php';
require_once __DIR__ . '/../../core/Response.php';

class AvailabilityController {
    private $availabilityService;

    public function __construct() {
        $this->availabilityService = new AvailabilityService();
    }

    // Endpoint: GET /api/titles/{id}/availability?country=EG
    public function show($id) {
        try {
            $country = isset($_GET['country']) ? trim($_GET['country']) : 'EG';
            $availability = $this->availabilityService->getTitleAvailability($id, $country);
            Response::json(true, $availability, 'Availability retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}