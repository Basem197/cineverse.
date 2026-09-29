<?php
// Path: cineverse/app/Repositories/TitleRepository.php

require_once __DIR__ . '/../../core/Database.php';

class TitleRepository {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // جلب كل الأفلام (احتفاظ للتوافق)
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM titles ORDER BY created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // جلب الأفلام مع دعم البحث، الفلترة بالتصنيفات، والـ Pagination
    public function getFilteredTitles($search = '', $genreId = null, $limit = 10, $offset = 0) {
        $limit = (int)$limit;
        $offset = (int)$offset;

        $sql = "SELECT DISTINCT t.* FROM titles t";
        $countSql = "SELECT COUNT(DISTINCT t.id) as total FROM titles t";
        
        $joins = "";
        $whereClauses = [];
        $params = [];

        // لو المستخدم حدد تصنيف معين (Genre)
        if (!empty($genreId)) {
            $joins .= " JOIN title_genres tg ON t.id = tg.title_id";
            $whereClauses[] = "tg.genre_id = :genre_id";
            $params[':genre_id'] = (int)$genreId;
        }

        // لو المستخدم عمل بحث بالاسم أو الوصف
        if (!empty($search)) {
            $whereClauses[] = "(t.title LIKE :search1 OR t.description LIKE :search2)";
            $searchTerm = '%' . $search . '%';
            $params[':search1'] = $searchTerm;
            $params[':search2'] = $searchTerm;
        }

        $sql .= $joins;
        $countSql .= $joins;

        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
            $countSql .= " WHERE " . implode(" AND ", $whereClauses);
        }

        $sql .= " ORDER BY t.created_at DESC LIMIT $limit OFFSET $offset";

        // تنفيذ استعلام الأفلام
        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $stmt->execute();
        $titles = $stmt->fetchAll();

        // تنفيذ استعلام العد الإجمالي للـ Pagination
        $countStmt = $this->db->prepare($countSql);
        foreach ($params as $key => $val) {
            $countStmt->bindValue($key, $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $countStmt->execute();
        $totalRows = $countStmt->fetch()['total'];

        return [
            'titles' => $titles,
            'total' => (int)$totalRows
        ];
    }

    // جلب فيلم معين بواسطة الـ ID
    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM titles WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }
}