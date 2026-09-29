<?php
// Path: cineverse/app/Controllers/ProfileController.php

require_once __DIR__ . '/../Services/ProfileService.php';
require_once __DIR__ . '/../../core/AuthMiddleware.php';
require_once __DIR__ . '/../../core/Response.php';

class ProfileController {
    private $profileService;

    public function __construct() {
        $this->profileService = new ProfileService();
    }

    // Endpoint: GET /api/profile (محمي - يتطلب Token)
    public function show() {
        try {
            // حارس الأمن بيتأكد إن اليوزر مسجل دخول ويستخرج الـ ID الخاص به
            $userId = AuthMiddleware::protect();

            $profileData = $this->profileService->getUserProfile($userId);

            Response::json(true, $profileData, 'User profile retrieved successfully');
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }
}