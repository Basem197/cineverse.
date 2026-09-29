<?php
// Path: cineverse/app/Repositories/UserRepository.php

require_once __DIR__ . '/../../core/Database.php';

class UserRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // البحث عن مستخدم بواسطة البريد الإلكتروني (لتسجيل الدخول)
    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }

    // جلب بيانات المستخدم بواسطة الـ ID (بدون كلمة المرور - مخصصة للملف الشخصي)
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT id, name, email, created_at FROM users WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    // إنشاء مستخدم جديد (التسجيل)
    public function create($name, $email, $password) {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':password', $password, PDO::PARAM_STR);
        return $stmt->execute();
    }
}