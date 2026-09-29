<?php
// Path: cineverse/app/Services/AvailabilityService.php

require_once __DIR__ . '/../Repositories/AvailabilityRepository.php';

class AvailabilityService {
    private $availabilityRepo;

    public function __construct() {
        $this->availabilityRepo = new AvailabilityRepository();
    }

    public function getTitleAvailability($titleId, $countryCode) {
        if (empty($titleId)) {
            throw new Exception("Title ID is required.");
        }
        if (empty($countryCode)) {
            $countryCode = 'EG'; // Default fallback country
        }

        return $this->availabilityRepo->getAvailabilityByTitleAndCountry($titleId, $countryCode);
    }
}