<?php
// Path: cineverse/app/Controllers/TitleController.php

require_once __DIR__ . '/../Services/TitleService.php';
require_once __DIR__ . '/../../core/Response.php';

class TitleController {
    private $titleService;

    public function __construct() {
        $this->titleService = new TitleService();
    }

    // Endpoint: GET /api/titles (جلب الأفلام مع دعم الفلترة والصفحات)
    public function index() {
        try {
            $result = $this->titleService->getPaginatedTitles($_GET);
            Response::json(true, $result, 'Titles retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }

    // Endpoint: GET /api/title/{id} (جلب تفاصيل فيلم مع تقييماته)
    public function show($id) {
        try {
            $titleDetails = $this->titleService->getTitleDetails($id);
            Response::json(true, $titleDetails, 'Title details retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}