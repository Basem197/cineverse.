<?php
// Path: cineverse/app/Controllers/SearchController.php

require_once __DIR__ . '/../Services/SearchService.php';
require_once __DIR__ . '/../../core/Response.php';

class SearchController {
    private $searchService;

    public function __construct() {
        $this->searchService = new SearchService();
    }

    // Endpoint: GET /api/search?q=batman
    public function index() {
        try {
            $query = isset($_GET['q']) ? trim($_GET['q']) : '';

            if (empty($query)) {
                Response::json(false, null, "Search query 'q' is required", 400);
            }

            $results = $this->searchService->performSearch($query);
            
            Response::json(true, $results, 'Search completed successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 500);
        }
    }
}