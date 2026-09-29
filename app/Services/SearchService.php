<?php
// Path: cineverse/app/Services/SearchService.php

require_once __DIR__ . '/../Repositories/TitleRepository.php';
require_once __DIR__ . '/TmdbService.php';

class SearchService {
    private $titleRepo;
    private $tmdbService;

    public function __construct() {
        $this->titleRepo = new TitleRepository();
        $this->tmdbService = new TmdbService();
    }

    public function performSearch($query) {
        // 1. البحث في الداتا بيز المحلية
        $localResults = [];

        if (method_exists($this->titleRepo, 'searchLocal')) {
            $localResults = $this->titleRepo->searchLocal($query);
        } elseif (method_exists($this->titleRepo, 'search')) {
            $localResults = $this->titleRepo->search($query);
        }

        // 2. إذا لم نجد نتائج محلية، نبحث في TMDB
        if (empty($localResults)) {
            $remoteResults = method_exists($this->tmdbService, 'searchRemote')
                ? $this->tmdbService->searchRemote($query)
                : [];

            return [
                'source' => 'TMDB',
                'results' => $remoteResults
            ];
        }

        return [
            'source' => 'Local Database',
            'results' => $localResults
        ];
    }
}