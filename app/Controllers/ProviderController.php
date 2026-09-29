<?php
// Path: cineverse/app/Controllers/ProviderController.php

require_once __DIR__ . '/../Services/ProviderService.php';
require_once __DIR__ . '/../../core/Response.php';

class ProviderController {
    private $providerService;

    public function __construct() {
        $this->providerService = new ProviderService();
    }

    // Endpoint: GET /api/providers
    public function index() {
        try {
            $providers = $this->providerService->getAllProviders();
            Response::json(true, $providers, 'Providers retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 500);
        }
    }

    // Endpoint: GET /api/title/{id}/providers?country=EG
    public function titleAvailability($titleId) {
        try {
            // استقبال كود الدولة من الرابط، والافتراضي مصر (EG)
            $country = isset($_GET['country']) ? $_GET['country'] : 'EG';
            
            $data = $this->providerService->getTitleAvailability($titleId, $country);
            
            Response::json(true, $data, "Availability for title ID $titleId in $country retrieved successfully");
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 500);
        }
    }
}