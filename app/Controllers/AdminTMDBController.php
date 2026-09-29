<?php
// Path: cineverse/app/Controllers/AdminTMDBController.php

require_once __DIR__ . '/../Services/TMDBSyncService.php';
require_once __DIR__ . '/../../core/AdminMiddleware.php';
require_once __DIR__ . '/../../core/Response.php';

class AdminTMDBController {
    private $syncService;

    public function __construct() {
        $this->syncService = new TMDBSyncService();
    }

    // Endpoint: POST /api/admin/sync/tmdb (محمي - يتطلب صلاحيات Admin)
    public function sync() {
        try {
            // حارس الإدارة يتحقق من التوكن وصلاحية الـ admin
            AdminMiddleware::protect();

            $input = json_decode(file_get_contents('php://input'), true);
            $pages = isset($input['pages']) ? (int)$input['pages'] : 1;

            $result = $this->syncService->syncPopularMovies($pages);

            Response::json(true, $result, 'TMDB synchronization executed successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}