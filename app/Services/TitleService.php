<?php
// Path: cineverse/app/Services/TitleService.php

require_once __DIR__ . '/../Repositories/TitleRepository.php';
require_once __DIR__ . '/../Repositories/ReviewRepository.php';

class TitleService {
    private $titleRepo;
    private $reviewRepo;

    public function __construct() {
        $this->titleRepo = new TitleRepository();
        $this->reviewRepo = new ReviewRepository();
    }

    // جلب لستة كل الأفلام (تقليدي)
    public function getAllTitles() {
        return $this->titleRepo->getAll();
    }

    // جلب الأفلام مع الـ Pagination والبحث والتصنيفات
    public function getPaginatedTitles($params) {
        $page = isset($params['page']) ? max(1, (int)$params['page']) : 1;
        $limit = isset($params['limit']) ? max(1, (int)$params['limit']) : 10;
        $search = isset($params['search']) ? trim($params['search']) : '';
        $genreId = isset($params['genre_id']) ? (int)$params['genre_id'] : null;
        
        $offset = ($page - 1) * $limit;

        $result = $this->titleRepo->getFilteredTitles($search, $genreId, $limit, $offset);

        return [
            'data' => $result['titles'],
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total_items' => $result['total'],
                'total_pages' => ceil($result['total'] / $limit)
            ]
        ];
    }

    // جلب تفاصيل الفيلم مع دمج التقييمات والمتوسطات من الداتا بيز
    public function getTitleDetails($titleId) {
        if (empty($titleId)) {
            throw new Exception("Title ID is required.");
        }

        $title = $this->titleRepo->findById($titleId);
        if (!$title) {
            throw new Exception("Title not found.");
        }

        $ratingStats = $this->reviewRepo->getAverageRating($titleId);
        $reviews = $this->reviewRepo->getReviewsByTitleId($titleId);

        $title['rating_stats'] = $ratingStats;
        $title['reviews'] = $reviews;

        return $title;
    }
}