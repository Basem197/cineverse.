<?php
// Path: cineverse/app/Controllers/WatchlistController.php

require_once __DIR__ . '/../Services/WatchlistService.php';
require_once __DIR__ . '/../../core/AuthMiddleware.php';
require_once __DIR__ . '/../../core/Response.php';

class WatchlistController {
    private $watchlistService;

    public function __construct() {
        $this->watchlistService = new WatchlistService();
    }

    // Endpoint: GET /api/watchlist
    public function index() {
        try {
            // حارس الأمن: لو مفيش توكن هيوقف السكريبت هنا
            $userId = AuthMiddleware::protect();
            
            $this->watchlistService->getList($userId);
            Response::json(true, null, 'Watchlist retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 500);
        }
    }

    // Endpoint: POST /api/watchlist
    public function add() {
        try {
            // حارس الأمن
            $userId = AuthMiddleware::protect();
            
            $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
            $titleId = $data['title_id'] ?? null;

            $this->watchlistService->addToWatchlist($userId, $titleId);
            
            Response::json(true, null, 'Title added to watchlist successfully', 201);
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}