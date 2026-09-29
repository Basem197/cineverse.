<?php
// Path: cineverse/app/Repositories/ReviewRepository.php

require_once __DIR__ . '/../../core/Database.php';

class ReviewRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // جلب كل مراجعات فيلم معين مع اسم المستخدم اللي كتبها
    public function getReviewsByTitleId($titleId) {
        $stmt = $this->db->prepare("
            SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.title_id = :title_id
            ORDER BY r.created_at DESC
        ");
        $stmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // جلب كل مراجعات وتقييمات يوزر معين (مضافة حديثاً للملف الشخصي)
    public function getReviewsByUserId($userId) {
        $stmt = $this->db->prepare("
            SELECT r.id, r.title_id, r.rating, r.comment, r.created_at, t.title as movie_title
            FROM reviews r
            JOIN titles t ON r.title_id = t.id
            WHERE r.user_id = :user_id
            ORDER BY r.created_at DESC
        ");
        $stmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // حساب متوسط التقييم وعدد المراجعات للفيلم
    public function getAverageRating($titleId) {
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as average_rating, COUNT(*) as reviews_count 
            FROM reviews 
            WHERE title_id = :title_id
        ");
        $stmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch();

        return [
            'average_rating' => $result['average_rating'] ? round((float)$result['average_rating'], 1) : 0.0,
            'reviews_count' => (int)$result['reviews_count']
        ];
    }

    // إضافة أو تحديث تقييم المستخدم للفيلم
    public function saveReview($userId, $titleId, $rating, $comment) {
        $check = $this->db->prepare("SELECT id FROM reviews WHERE user_id = :user_id AND title_id = :title_id");
        $check->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
        $check->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
        $check->execute();
        $existing = $check->fetch();

        if ($existing) {
            $stmt = $this->db->prepare("UPDATE reviews SET rating = :rating, comment = :comment WHERE id = :id");
            $stmt->bindValue(':rating', (int)$rating, PDO::PARAM_INT);
            $stmt->bindValue(':comment', $comment, PDO::PARAM_STR);
            $stmt->bindValue(':id', (int)$existing['id'], PDO::PARAM_INT);
            return $stmt->execute();
        } else {
            $stmt = $this->db->prepare("INSERT INTO reviews (user_id, title_id, rating, comment) VALUES (:user_id, :title_id, :rating, :comment)");
            $stmt->bindValue(':user_id', (int)$userId, PDO::PARAM_INT);
            $stmt->bindValue(':title_id', (int)$titleId, PDO::PARAM_INT);
            $stmt->bindValue(':rating', (int)$rating, PDO::PARAM_INT);
            $stmt->bindValue(':comment', $comment, PDO::PARAM_STR);
            return $stmt->execute();
        }
    }
}