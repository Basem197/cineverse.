<?php
// Path: cineverse/app/Controllers/AuthController.php

require_once __DIR__ . '/../Services/AuthService.php';
require_once __DIR__ . '/../../core/Response.php';

class AuthController {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    // Endpoint: POST /api/auth/register
    public function register() {
        try {
            // قراءة البيانات المبعوتة سواء كـ JSON أو Form-Data
            $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
            
            $name = trim($data['name'] ?? '');
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($name) || empty($email) || empty($password)) {
                Response::json(false, null, "Name, email, and password are required", 400);
            }

            $this->authService->register($name, $email, $password);
            Response::json(true, null, "User registered successfully", 201);
            
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 400);
        }
    }

    // Endpoint: POST /api/auth/login
    public function login() {
        try {
            $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
            
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($email) || empty($password)) {
                Response::json(false, null, "Email and password are required", 400);
            }

            $this->authService->login($email, $password);
            Response::json(true, null, "Login successful");
            
        } catch (Exception $e) {
            Response::json(false, null, $e->getMessage(), 401);
        }
    }
}