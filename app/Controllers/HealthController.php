<?php
// Path: cineverse/app/Controllers/HealthController.php

class HealthController {
    public function index() {
        // أي Logic أو استدعاء لـ Services بيكون هنا مستقبلاً
        Response::json(true, [
            'status' => 'Router is working perfectly!',
            'version' => 'CineVerse V2 API'
        ], 'Health Check Passed');
    }
}