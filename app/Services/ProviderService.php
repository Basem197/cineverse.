<?php
// Path: cineverse/app/Services/ProviderService.php

require_once __DIR__ . '/../Repositories/ProviderRepository.php';
require_once __DIR__ . '/../Repositories/AvailabilityRepository.php';

class ProviderService {
    private $providerRepo;
    private $availabilityRepo;

    public function __construct() {
        $this->providerRepo = new ProviderRepository();
        $this->availabilityRepo = new AvailabilityRepository();
    }

    public function getAllProviders() {
        return $this->providerRepo->getAll();
    }

    public function getTitleAvailability($titleId, $countryCode) {
        // يمكننا هنا مستقبلاً تنظيم البيانات (مثلاً فصل الـ Stream عن الـ Rent)
        $methodNames = [
            'getByTitleId',
            'getByTitleAndCountry',
            'getByTitleIdAndCountryCode',
        ];

        foreach ($methodNames as $methodName) {
            if (method_exists($this->availabilityRepo, $methodName)) {
                return $this->availabilityRepo->$methodName($titleId, $countryCode);
            }
        }

        return [];
    }
}