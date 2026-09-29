<?php
// Path: cineverse/app/Services/TmdbService.php

class TmdbService {
    private $apiKey;
    private $baseUrl;

    public function __construct() {
        $config = require __DIR__ . '/../../config/tmdb.php';
        $this->apiKey = $config['api_key'];
        $this->baseUrl = $config['base_url'];
    }

    public function searchRemote($query) {
        if ($this->apiKey === 'YOUR_TMDB_API_KEY_HERE' || empty($this->apiKey)) {
            throw new Exception("TMDB API Key is missing. Please add it to config/tmdb.php");
        }

        $url = "{$this->baseUrl}/search/multi?api_key={$this->apiKey}&query=" . urlencode($query) . "&language=ar";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // لتفادي مشاكل الـ SSL محلياً
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception("Failed to fetch data from TMDB");
        }

        return json_decode($response, true)['results'] ?? [];
    }
}