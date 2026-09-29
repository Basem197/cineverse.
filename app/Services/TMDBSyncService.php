<?php
// Path: cineverse/app/Services/TMDBSyncService.php

require_once __DIR__ . '/../../core/Database.php';

class TMDBSyncService {
    private $db;
    private $apiKey = 'YOUR_TMDB_API_KEY'; // ضع مفتاح TMDB الخاص بك هنا أو اجلبه من جدول الإعدادات
    private $baseUrl = 'https://api.themoviedb.org/3';

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // مزامنة الأفلام الشائعة الرائجة من TMDB إلى قاعدة بيانات CineVerse
    public function syncPopularMovies($pages = 1) {
        $syncedCount = 0;

        for ($p = 1; $p <= $pages; $p++) {
            $url = "{$this->baseUrl}/movie/popular?api_key={$this->apiKey}&language=ar-AE&page={$p}";
            
            $response = @file_get_contents($url);
            if (!$response) {
                // محاولة باللغة الإنجليزية لو العربية فشلت
                $url = "{$this->baseUrl}/movie/popular?api_key={$this->apiKey}&language=en-US&page={$p}";
                $response = @file_get_contents($url);
            }

            if (!$response) {
                throw new Exception("Failed to connect to TMDB API.");
            }

            $data = json_decode($response, true);
            if (!isset($data['results'])) {
                continue;
            }

            foreach ($data['results'] as $movie) {
                $tmdbId = $movie['id'];
                $title = $movie['title'] ?? 'Unknown Title';
                $overview = $movie['overview'] ?? '';
                $releaseDate = $movie['release_date'] ?? null;
                $releaseYear = $releaseDate ? substr($releaseDate, 0, 4) : null;
                $posterPath = $movie['poster_path'] ?? null;
                $backdropPath = $movie['backdrop_path'] ?? null;
                $voteAverage = $movie['vote_average'] ?? 0.0;

                // التحقق هل الفيلم موجود مسبقاً بناءً على الـ tmdb_id لمنع التكرار
                $checkStmt = $this->db->prepare("SELECT id FROM titles WHERE tmdb_id = :tmdb_id LIMIT 1");
                $checkStmt->bindValue(':tmdb_id', (int)$tmdbId, PDO::PARAM_INT);
                $checkStmt->execute();
                $existing = $checkStmt->fetch();

                if ($existing) {
                    // تحديث البيانات لو الفيلم موجود
                    $updateStmt = $this->db->prepare("
                        UPDATE titles 
                        SET title = :title, description = :description, release_year = :release_year, 
                            poster_path = :poster_path, backdrop_path = :backdrop_path, rating = :rating
                        WHERE tmdb_id = :tmdb_id
                    ");
                    $updateStmt->bindValue(':title', $title, PDO::PARAM_STR);
                    $updateStmt->bindValue(':description', $overview, PDO::PARAM_STR);
                    $updateStmt->bindValue(':release_year', $releaseYear, PDO::PARAM_INT);
                    $updateStmt->bindValue(':poster_path', $posterPath, PDO::PARAM_STR);
                    $updateStmt->bindValue(':backdrop_path', $backdropPath, PDO::PARAM_STR);
                    $updateStmt->bindValue(':rating', $voteAverage, PDO::PARAM_STR);
                    $updateStmt->bindValue(':tmdb_id', (int)$tmdbId, PDO::PARAM_INT);
                    $updateStmt->execute();
                } else {
                    // إدخال فيلم جديد كلياً
                    $insertStmt = $this->db->prepare("
                        INSERT INTO titles (tmdb_id, title, description, release_year, poster_path, backdrop_path, rating, created_at)
                        VALUES (:tmdb_id, :title, :description, :release_year, :poster_path, :backdrop_path, :rating, NOW())
                    ");
                    $insertStmt->bindValue(':tmdb_id', (int)$tmdbId, PDO::PARAM_INT);
                    $insertStmt->bindValue(':title', $title, PDO::PARAM_STR);
                    $insertStmt->bindValue(':description', $overview, PDO::PARAM_STR);
                    $insertStmt->bindValue(':release_year', $releaseYear, PDO::PARAM_INT);
                    $insertStmt->bindValue(':poster_path', $posterPath, PDO::PARAM_STR);
                    $insertStmt->bindValue(':backdrop_path', $backdropPath, PDO::PARAM_STR);
                    $insertStmt->bindValue(':rating', $voteAverage, PDO::PARAM_STR);
                    $insertStmt->execute();
                    $syncedCount++;
                }
            }
        }

        return [
            'status' => 'success',
            'synced_new_movies' => $syncedCount,
            'message' => "TMDB synchronization completed successfully."
        ];
    }
}