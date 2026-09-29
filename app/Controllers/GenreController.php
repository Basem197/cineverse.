<?php
// Path: cineverse/app/Controllers/GenreController.php

require_once __DIR__ . '/../Repositories/GenreRepository.php';
require_once __DIR__ . '/../../core/Response.php';

class GenreController {
    private $genreRepo;

    public function __construct() {
        $this->genreRepo = new GenreRepository();
    }

    // Endpoint: GET /api/genres
    public function index() {
        try {
            $genres = $this->genreRepo->getAll();
            Response::json(true, $genres, 'Genres retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}