<?php
// Path: cineverse/app/Controllers/ReviewController.php

require_once __DIR__ . '/../Services/ReviewService.php';
require_once __DIR__ . '/../../core/AuthMiddleware.php';
require_once __DIR__ . '/../../core/Response.php';

class ReviewController {
    private $reviewService;

    public function __construct() {
        $this->reviewService = new \ReviewService();
    }

    // Endpoint: GET /api/title/{id}/reviews (متاح للجميع)
    public function index($id) {
        try {
            $reviews = $this->reviewService->getTitleReviews($id);
            Response::json(true, $reviews, 'Reviews retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }

    // Endpoint: POST /api/reviews (محمي - يتطلب Token)
    public function store() {
        try {
            // حارس الأمن بيتأكد إن اليوزر مسجل دخول
            $userId = AuthMiddleware::protect();

            $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
            $titleId = $data['title_id'] ?? null;
            $rating = $data['rating'] ?? null;
            $comment = $data['comment'] ?? '';

            $this->reviewService->addReview($userId, $titleId, $rating, $comment);

            Response::json(true, null, 'Review saved successfully', 201);
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}