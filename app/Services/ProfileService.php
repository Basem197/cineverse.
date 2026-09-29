<?php
// Path: cineverse/app/Services/ProfileService.php

require_once __DIR__ . '/../Repositories/UserRepository.php';
require_once __DIR__ . '/../Repositories/WatchlistRepository.php';
require_once __DIR__ . '/../Repositories/ReviewRepository.php';

class ProfileService {
    private $userRepo;
    private $watchlistRepo;
    private $reviewRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
        $this->watchlistRepo = new WatchlistRepository();
        $this->reviewRepo = new ReviewRepository();
    }

    public function getUserProfile($userId) {
        if (empty($userId)) {
            throw new Exception("User ID is required.");
        }

        // 1. جلب بيانات المستخدم الأساسية
        $user = $this->userRepo->findById($userId);
        if (!$user) {
            throw new Exception("User not found.");
        }

        // 2. جلب قائمة المشاهدة (Watchlist)
        $watchlist = $this->watchlistRepo->getUserWatchlist($userId);

        // 3. جلب تقييمات ومراجعات المستخدم
        $reviews = $this->reviewRepo->getReviewsByUserId($userId);

        return [
            'user' => $user,
            'watchlist' => $watchlist,
            'reviews' => $reviews
        ];
    }
}