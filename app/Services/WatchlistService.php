<?php
// Path: cineverse/app/Services/WatchlistService.php

require_once __DIR__ . '/../Repositories/WatchlistRepository.php';

class WatchlistService {
    private $watchlistRepo;

    public function __construct() {
        $this->watchlistRepo = new WatchlistRepository();
    }

    public function getList($userId) {
        return $this->watchlistRepo->getUserWatchlist($userId);
    }

    public function addToWatchlist($userId, $titleId) {
        if (empty($titleId)) {
            throw new Exception("Title ID is required.");
        }
        return $this->watchlistRepo->addTitle($userId, $titleId);
    }
}