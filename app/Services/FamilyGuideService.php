<?php
// Path: cineverse/app/Services/FamilyGuideService.php

require_once __DIR__ . '/../Repositories/FamilyGuideRepository.php';

class FamilyGuideService {
    private $guideRepo;

    public function __construct() {
        $this->guideRepo = new FamilyGuideRepository();
    }

    public function getFamilyGuide($titleId) {
        if (empty($titleId)) {
            throw new Exception("Title ID is required.");
        }
        $guide = $this->guideRepo->getByTitleId($titleId);
        return $guide ? $guide : ["message" => "No family guide available for this title."];
    }
}