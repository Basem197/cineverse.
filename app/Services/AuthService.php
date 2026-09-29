<?php
// Path: cineverse/app/Services/AuthService.php

require_once __DIR__ . '/../Repositories/UserRepository.php';
require_once __DIR__ . '/../../core/JWT.php';

class AuthService {
    private $userRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
    }

    public function register($name, $email, $password) {
        if ($this->userRepo->findByEmail($email)) {
            throw new Exception("Email already exists.");
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        return $this->userRepo->create($name, $email, $passwordHash);
    }

    public function login($email, $password) {
        $user = $this->userRepo->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new Exception("Invalid email or password.");
        }

        unset($user['password_hash']);

        // جلب كلمة السر الخاصة بالتشفير
        $jwtConfig = require __DIR__ . '/../../config/jwt.php';

        // بناء محتوى التوكن (Payload)
        $payload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + (86400 * 7) // صلاحية لمدة 7 أيام
        ];

        // إصدار التوكن
        $jwtClass = null;
        foreach (['JWT', 'Core\\JWT', 'App\\JWT', 'Firebase\\JWT\\JWT'] as $candidate) {
            if (class_exists($candidate)) {
                $jwtClass = $candidate;
                break;
            }
        }

        if ($jwtClass === null) {
            throw new RuntimeException('JWT class not found.');
        }

        $token = $jwtClass::encode($payload, $jwtConfig['secret']);

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}