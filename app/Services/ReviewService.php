<?php
// Path: cineverse/app/Services/ReviewService.php

require_once __DIR__ . '/../Repositories/ReviewRepository.php';

class ReviewService {
    private $reviewRepo;

    public function __construct() {
        $this->reviewRepo = new ReviewRepository();
    }

    public function getTitleReviews($titleId) {
        if (empty($titleId)) {
            throw new Exception("Title ID is required.");
        }
        return $this->reviewRepo->getReviewsByTitleId($titleId);
    }

    public function addReview($userId, $titleId, $rating, $comment) {
        if (empty($titleId) || empty($rating)) {
            throw new Exception("Title ID and rating are required.");
        }

        if ($rating < 1 || $rating > 5) {
            throw new Exception("Rating must be between 1 and 5.");
        }

        return $this->reviewRepo->saveReview($userId, $titleId, $rating, $comment);
    }
}