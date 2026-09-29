<?php
// Path: C:\xampp\htdocs\cineverse\public\import_tmdb.php

// 1. زيادة وقت التنفيذ لتفادي انقطاع الاتصال أثناء معالجة الصور والتفاصيل
set_time_limit(300);
header('Content-Type: text/html; charset=utf-8');

// ========================================================
// 2. مفتاح TMDB وإعدادات الاستيراد
// ========================================================
// ضع مفتاح TMDB API v3 الخاص بك هنا (مجاني من themoviedb.org)
$tmdbApiKey = "fb0f2128ccb36cd651e91bb9255f8ddb"; 
$pagesToFetch = 2; // عدد الصفحات (كل صفحة تحتوي على 20 فيلماً)

// 3. الاتصال بقاعدة بيانات cineverse_db
$host = "127.0.0.1";
$db   = "cineverse_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (\PDOException $e) {
    die("<div style='color:red; font-family:sans-serif; padding:20px;'>فشل الاتصال بقاعدة البيانات: " . $e->getMessage() . "</div>");
}

// دالة مساعدة لطلب البيانات عبر cURL
function fetchTMDB($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_USERAGENT, 'CineVerse-SyncEngine/1.0');
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// دالة تحويل تصنيف TMDB العمري إلى دليل المشاهدة العائلي
function generateFamilyGuide($cert) {
    switch (strtoupper(trim($cert))) {
        case 'G':
        case 'PG':
            return [
                'age' => 'G',
                'overall' => 'مناسب لجميع أفراد الأسرة',
                'violence' => 'منعدم',
                'fear' => 'منعدم',
                'sex' => 'منعدم',
                'lang' => 'منعدم',
                'drugs' => 'منعدم',
                'note' => 'عمل عائلي ترفيهي نظيف تماماً وخالٍ من أي مشاهد عنف أو ألفاظ غير مناسبة.'
            ];
        case 'PG-13':
        case '12':
        case '13':
            return [
                'age' => '+13',
                'overall' => 'مناسب لليافعين بمرافقة الأسرة',
                'violence' => 'متوسط',
                'fear' => 'متوسط',
                'sex' => 'خفيف',
                'lang' => 'خفيف',
                'drugs' => 'منعدم',
                'note' => 'يحتوي العمل على معارك خيال أو توتر درامي خفيف مناسب لمن هم فوق 13 سنة.'
            ];
        case 'R':
        case '16':
        case '15':
            return [
                'age' => '+16',
                'overall' => 'إشراف عائلي مطلوب ومكثف',
                'violence' => 'شديد',
                'fear' => 'شديد',
                'sex' => 'خفيف',
                'lang' => 'متوسط',
                'drugs' => 'خفيف',
                'note' => 'يتضمن مشاهد إثارة وحروب أو توتر نفسي حاد يُفضل عدم مشاهدة الأطفال له.'
            ];
        case 'NC-17':
        case '18':
            return [
                'age' => '+18',
                'overall' => 'للكبار فقط (غير عائلي)',
                'violence' => 'شديد',
                'fear' => 'حرج',
                'sex' => 'متوسط',
                'lang' => 'شديد',
                'drugs' => 'متوسط',
                'note' => 'محتوى مخصص للبالغين فقط لاحتوائه على عنف مكثف أو موضوعات نفسية معقدة.'
            ];
        default:
            return [
                'age' => '+13',
                'overall' => 'إشراف عائلي موصى به',
                'violence' => 'متوسط',
                'fear' => 'متوسط',
                'sex' => 'منعدم',
                'lang' => 'خفيف',
                'drugs' => 'منعدم',
                'note' => 'يُنصح بمرافقة الوالدين لتقييم ملاءمة المحتوى حسب المرحلة العمرية.'
            ];
    }
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>CineVerse | محرك استيراد وتزامن TMDB</title>
  <style>
    body { background-color: #07090e; color: #f3f4f6; font-family: system-ui, -apple-system, sans-serif; padding: 30px; margin: 0; }
    .container { max-width: 1000px; margin: auto; }
    h1 { color: #f59e0b; font-size: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
    .card { background: #0f141f; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 15px; }
    .poster { width: 50px; height: 75px; object-fit: cover; border-radius: 6px; background: #1e293b; }
    .info { flex: 1; }
    .info strong { font-size: 16px; color: #fff; display: block; }
    .info span { font-size: 12px; color: #9ca3af; }
    .badge { font-size: 11px; padding: 4px 8px; border-radius: 6px; font-weight: bold; background: rgba(16, 185, 129, 0.2); color: #10b981; }
  </style>
</head>
<body>
<div class="container">
  <h1>⚡ محرك مزامنة الأفلام المباشر (TMDB to CineVerse DB)</h1>

<?php
if ($tmdbApiKey === "YOUR_TMDB_API_KEY_HERE") {
    die("<div style='background:#7f1d1d; color:#fecaca; padding:15px; border-radius:10px; margin-top:20px;'>
        ⚠️ <strong>تنبيه:</strong> يرجى فتح الملف <code>public/import_tmdb.php</code> ووضع مفتاح <strong>TMDB API Key</strong> الخاص بك في السطر 12.
    </div></div></body></html>");
}

$importedCount = 0;

for ($page = 1; $page <= $pagesToFetch; $page++) {
    // 1. جلب قائمة الأفلام الرائجة باللغة العربية
    $popularUrl = "https://api.themoviedb.org/3/movie/popular?api_key={$tmdbApiKey}&language=ar-SA&page={$page}";
    $popularData = fetchTMDB($popularUrl);

    if (empty($popularData['results'])) {
        continue;
    }

    foreach ($popularData['results'] as $movie) {
        $tmdbId = (int)$movie['id'];
        $title = !empty($movie['title']) ? $movie['title'] : $movie['original_title'];
        $description = !empty($movie['overview']) ? $movie['overview'] : "لا يوجد وصف عربي متوفر حالياً لهذا العمل.";
        $releaseYear = !empty($movie['release_date']) ? (int)substr($movie['release_date'], 0, 4) : null;
        $rating = !empty($movie['vote_average']) ? round($movie['vote_average'], 1) : 7.0;
        
        $posterPath = !empty($movie['poster_path']) 
            ? "https://image.tmdb.org/t/p/w500" . $movie['poster_path'] 
            : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
            
        $backdropPath = !empty($movie['backdrop_path']) 
            ? "https://image.tmdb.org/t/p/original" . $movie['backdrop_path'] 
            : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80";

        // أ) التحقق من وجود الفيلم أو إدخاله في جدول titles
        $checkStmt = $pdo->prepare("SELECT id FROM titles WHERE tmdb_id = :tmdb_id LIMIT 1");
        $checkStmt->execute([':tmdb_id' => $tmdbId]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            $titleId = $existing['id'];
            $updateStmt = $pdo->prepare("UPDATE titles SET rating = :rating, backdrop_path = :backdrop WHERE id = :id");
            $updateStmt->execute([':rating' => $rating, ':backdrop' => $backdropPath, ':id' => $titleId]);
        } else {
            $insertStmt = $pdo->prepare("
                INSERT INTO titles (tmdb_id, title, description, release_year, poster_path, backdrop_path, rating)
                VALUES (:tmdb_id, :title, :description, :release_year, :poster_path, :backdrop_path, :rating)
            ");
            $insertStmt->execute([
                ':tmdb_id' => $tmdbId,
                ':title' => $title,
                ':description' => $description,
                ':release_year' => $releaseYear,
                ':poster_path' => $posterPath,
                ':backdrop_path' => $backdropPath,
                ':rating' => $rating
            ]);
            $titleId = (int)$pdo->lastInsertId();
        }

        // ب) جلب تصنيفات المشاهدة والشهادات العمرية (Release Dates) للدليل العائلي
        $releaseDatesUrl = "https://api.themoviedb.org/3/movie/{$tmdbId}/release_dates?api_key={$tmdbApiKey}";
        $releaseData = fetchTMDB($releaseDatesUrl);
        $extractedCert = "PG-13"; // افتراضي

        if (!empty($releaseData['results'])) {
            foreach ($releaseData['results'] as $res) {
                if (in_array($res['iso_3166_1'], ['EG', 'US', 'GB'])) {
                    foreach ($res['release_dates'] as $rd) {
                        if (!empty($rd['certification'])) {
                            $extractedCert = $rd['certification'];
                            break 2;
                        }
                    }
                }
            }
        }

        $guideData = generateFamilyGuide($extractedCert);

        // إدخال أو تحديث دليل العائلة
        $guideStmt = $pdo->prepare("
            INSERT INTO family_guides (title_id, age_recommendation, overall_level, violence, sexual_content, language, fear, drugs, parent_note)
            VALUES (:title_id, :age, :overall, :violence, :sex, :lang, :fear, :drugs, :note)
            ON DUPLICATE KEY UPDATE 
                age_recommendation = VALUES(age_recommendation),
                overall_level = VALUES(overall_level),
                parent_note = VALUES(parent_note)
        ");
        $guideStmt->execute([
            ':title_id' => $titleId,
            ':age'      => $guideData['age'],
            ':overall'  => $guideData['overall'],
            ':violence' => $guideData['violence'],
            ':sex'      => $guideData['sex'],
            ':lang'     => $guideData['lang'],
            ':fear'     => $guideData['fear'],
            ':drugs'    => $guideData['drugs'],
            ':note'     => $guideData['note']
        ]);

        // ج) جلب منصات المشاهدة القانونية المتاحة (Watch Providers)
        $providersUrl = "https://api.themoviedb.org/3/movie/{$tmdbId}/watch/providers?api_key={$tmdbApiKey}";
        $providerResults = fetchTMDB($providersUrl);

        if (!empty($providerResults['results'])) {
            $countries = ['EG' => 'مصر', 'SA' => 'المملكة العربية السعودية'];

            foreach ($countries as $cCode => $cName) {
                if (isset($providerResults['results'][$cCode])) {
                    $cData = $providerResults['results'][$cCode];
                    $streamLink = $cData['link'] ?? "https://www.themoviedb.org/movie/{$tmdbId}/watch";

                    // معالجة منصات الاشتراك (Flatrate) والإيجار (Rent)
                    $providerTypes = [
                        'subscription' => $cData['flatrate'] ?? [],
                        'rent'         => $cData['rent'] ?? []
                    ];

                    foreach ($providerTypes as $type => $pList) {
                        foreach ($pList as $pItem) {
                            $pName = trim($pItem['provider_name']);
                            $pLogo = "https://image.tmdb.org/t/p/original" . ($pItem['logo_path'] ?? '');

                            // التأكد من تسجيل المنصة في جدول providers
                            $pCheck = $pdo->prepare("SELECT id FROM providers WHERE name = :name LIMIT 1");
                            $pCheck->execute([':name' => $pName]);
                            $foundP = $pCheck->fetch();

                            if ($foundP) {
                                $providerDbId = $foundP['id'];
                            } else {
                                $pInsert = $pdo->prepare("INSERT INTO providers (name, logo_url, website_url) VALUES (:name, :logo, :web)");
                                $pInsert->execute([':name' => $pName, ':logo' => $pLogo, ':web' => $streamLink]);
                                $providerDbId = (int)$pdo->lastInsertId();
                            }

                            // إدراج توفر المنصة للفيلم في هذه الدولة
                            $availCheck = $pdo->prepare("
                                SELECT id FROM title_availabilities 
                                WHERE title_id = :t_id AND provider_id = :p_id AND country_code = :c_code LIMIT 1
                            ");
                            $availCheck->execute([':t_id' => $titleId, ':p_id' => $providerDbId, ':c_code' => $cCode]);

                            if (!$availCheck->fetch()) {
                                $availInsert = $pdo->prepare("
                                    INSERT INTO title_availabilities (title_id, provider_id, country_code, country_name, availability_type, official_url, affiliate_url)
                                    VALUES (:t_id, :p_id, :c_code, :c_name, :type, :url, :aff_url)
                                ");
                                $availInsert->execute([
                                    ':t_id'    => $titleId,
                                    ':p_id'    => $providerDbId,
                                    ':c_code'  => $cCode,
                                    ':c_name'  => $cName,
                                    ':type'    => $type,
                                    ':url'     => $streamLink,
                                    ':aff_url' => $streamLink . "?ref=cineverse"
                                ]);
                            }
                        }
                    }
                }
            }
        }

        $importedCount++;

        // إخراج بطاقة العمل فور معالجتها في الشاشة
        echo "
        <div class='card'>
            <img class='poster' src='{$posterPath}' alt='{$title}' />
            <div class='info'>
                <strong>{$title} ({$releaseYear})</strong>
                <span>تقييم: {$rating} | الدليل: {$guideData['age']} ({$guideData['overall']})</span>
            </div>
            <div class='badge'>✓ تم التخزين والربط</div>
        </div>";
        flush();
    }
}

echo "<div style='margin-top:20px; padding:15px; background:rgba(245,158,11,0.1); border:1px solid #f59e0b; border-radius:10px; text-align:center;'>
    🎉 <strong>اكتملت المزامنة بنجاح!</strong> تم إدراج وتحديث <strong>{$importedCount}</strong> عملاً سينمائياً في قاعدة البيانات.
</div>";
?>

</div>
</body>
</html>