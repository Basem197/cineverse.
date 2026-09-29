<?php
// Path: C:\xampp\htdocs\cineverse\public\api\index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('ADMIN_SECRET_PIN', '7799');

$host    = "127.0.0.1";
$db      = "cineverse_db";
$user    = "root";
$pass    = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "فشل الاتصال بقاعدة البيانات: " . $e->getMessage(),
        "data"    => null
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$requestUri = $_SERVER['REQUEST_URI'];
$basePath   = '/cineverse/public/api';
$path       = parse_url($requestUri, PHP_URL_PATH);

if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

$path     = trim($path, '/');
$segments = $path !== '' ? explode('/', $path) : [];
$method   = $_SERVER['REQUEST_METHOD'];

function respond($data, $success = true, $message = "تمت العملية بنجاح", $code = 200) {
    http_response_code($code);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data"    => $data
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function verifyAdminAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
        if ($token === ADMIN_SECRET_PIN) {
            return true;
        }
    }
    respond(null, false, "غير مصرح بالدخول: رمز PIN غير صالح أو مفقود", 401);
}

// 1) التصنيفات: GET /genres
if ($method === 'GET' && count($segments) === 1 && $segments[0] === 'genres') {
    $stmt = $pdo->query("SELECT id, name, slug FROM genres ORDER BY name ASC");
    respond($stmt->fetchAll());
}

// 2) الكتالوج: GET /titles
if ($method === 'GET' && count($segments) === 1 && $segments[0] === 'titles') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $limit  = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 50;

    $where  = [];
    $params = [];

    if ($search !== '') {
        $where[] = "(title LIKE :search OR description LIKE :search)";
        $params[':search'] = "%$search%";
    }

    $whereSql = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";

    $query = "SELECT id, tmdb_id, title, description, release_year, poster_path, backdrop_path, rating 
              FROM titles $whereSql 
              ORDER BY id DESC 
              LIMIT $limit";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    respond($stmt->fetchAll());
}

// 3) تفاصيل عمل محدد: GET /title/{id}
if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'title') {
    $id = (int)$segments[1];
    $stmt = $pdo->prepare("SELECT * FROM titles WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $title = $stmt->fetch();

    if ($title) {
        respond($title);
    } else {
        respond(null, false, "العمل السينمائي غير موجود", 404);
    }
}

// 4) توفر المنصات: GET /titles/{id}/availability?country=EG
if ($method === 'GET' && count($segments) === 3 && $segments[0] === 'titles' && $segments[2] === 'availability') {
    $titleId = (int)$segments[1];
    $country = isset($_GET['country']) ? strtoupper(trim($_GET['country'])) : 'EG';

    $stmt = $pdo->prepare("
        SELECT 
            p.name AS provider_name,
            p.logo_url AS provider_logo,
            ta.country_code,
            ta.country_name,
            ta.availability_type,
            ta.official_url,
            ta.affiliate_url,
            ta.verified_at
        FROM title_availabilities ta
        JOIN providers p ON ta.provider_id = p.id
        WHERE ta.title_id = :title_id AND ta.country_code = :country
        ORDER BY ta.availability_type ASC
    ");
    $stmt->execute([':title_id' => $titleId, ':country' => $country]);
    respond($stmt->fetchAll());
}

// 5) دليل العائلة لفيلم: GET /titles/{id}/family-guide
if ($method === 'GET' && count($segments) === 3 && $segments[0] === 'titles' && $segments[2] === 'family-guide') {
    $titleId = (int)$segments[1];
    $stmt = $pdo->prepare("
        SELECT age_recommendation, overall_level, violence, sexual_content, language, fear, drugs, parent_note
        FROM family_guides 
        WHERE title_id = :title_id 
        LIMIT 1
    ");
    $stmt->execute([':title_id' => $titleId]);
    $guide = $stmt->fetch();

    if ($guide) {
        respond($guide);
    } else {
        respond(null, false, "لا يوجد تقرير فحص عائلي", 404);
    }
}

// 6) مجمع دليل العائلة: GET /family-guides
if ($method === 'GET' && count($segments) === 1 && $segments[0] === 'family-guides') {
    $age = isset($_GET['age']) ? trim($_GET['age']) : '';
    $where  = [];
    $params = [];

    if ($age !== '' && $age !== 'all') {
        $where[] = "fg.age_recommendation = :age";
        $params[':age'] = $age;
    }

    $whereSql = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";

    $sql = "
        SELECT 
            t.id,
            t.title,
            t.release_year,
            t.poster_path,
            fg.age_recommendation AS age,
            fg.overall_level AS overallVerdict,
            fg.violence,
            fg.fear,
            fg.sexual_content AS sexualContent,
            fg.language,
            fg.drugs,
            fg.parent_note AS parentNote
        FROM titles t
        INNER JOIN family_guides fg ON t.id = fg.title_id
        $whereSql
        ORDER BY t.id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    respond($stmt->fetchAll());
}

// 7) قائمة المنصات: GET /providers
if ($method === 'GET' && count($segments) === 1 && $segments[0] === 'providers') {
    $sql = "
        SELECT 
            p.id,
            p.name,
            p.logo_url,
            p.website_url,
            COUNT(DISTINCT ta.title_id) AS titles_count
        FROM providers p
        LEFT JOIN title_availabilities ta ON p.id = ta.provider_id
        GROUP BY p.id, p.name, p.logo_url, p.website_url
        ORDER BY titles_count DESC
    ";
    $stmt = $pdo->query($sql);
    respond($stmt->fetchAll());
}

// 8) تتبع الإحالات: POST /affiliate/track
if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'affiliate' && $segments[1] === 'track') {
    $input = json_decode(file_get_contents('php://input'), true);
    $titleId    = isset($input['title_id']) ? (int)$input['title_id'] : null;
    $providerId = isset($input['provider_id']) ? (int)$input['provider_id'] : null;
    $ip         = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
    $agent      = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN';

    $stmt = $pdo->prepare("
        INSERT INTO affiliate_clicks (title_id, provider_id, user_ip, user_agent)
        VALUES (:title_id, :provider_id, :ip, :agent)
    ");
    $stmt->execute([
        ':title_id'    => $titleId,
        ':provider_id' => $providerId,
        ':ip'          => $ip,
        ':agent'       => $agent
    ]);

    respond(null, true, "تم تسجيل النقرة بنجاح");
}

// 9) إنشاء حساب جديد: POST /auth/register
if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'auth' && $segments[1] === 'register') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name  = trim($input['name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $pass  = $input['password'] ?? '';

    if (empty($name) || empty($email) || strlen($pass) < 6) {
        respond(null, false, "يرجى ملء جميع الحقول وكلمة المرور لا تقل عن 6 أحرف", 422);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        respond(null, false, "البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول", 409);
    }

    $hash = password_hash($pass, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :hash)");
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':hash'  => $hash
    ]);

    $userId = (int)$pdo->lastInsertId();
    respond([
        "id"    => $userId,
        "name"  => $name,
        "email" => $email
    ], true, "تم إنشاء الحساب بنجاح");
}

// 10) تسجيل الدخول: POST /auth/login
if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'auth' && $segments[1] === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = strtolower(trim($input['email'] ?? ''));
    $pass  = $input['password'] ?? '';

    if (empty($email) || empty($pass)) {
        respond(null, false, "يرجى إدخال البريد الإلكتروني وكلمة المرور", 422);
    }

    $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($pass, $user['password_hash'])) {
        respond(null, false, "بيانات الدخول غير صحيحة", 401);
    }

    respond([
        "id"    => (int)$user['id'],
        "name"  => $user['name'],
        "email" => $user['email']
    ], true, "تم تسجيل الدخول بنجاح");
}

// 11) سحب قائمة مشاهدة المستخدم السحابية: GET /user/watchlist?user_id=1
if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'user' && $segments[1] === 'watchlist') {
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    if ($userId <= 0) {
        respond([], false, "معرف المستخدم غير صالح", 400);
    }

    $stmt = $pdo->prepare("
        SELECT t.id, t.tmdb_id, t.title, t.description, t.release_year, t.poster_path, t.backdrop_path, t.rating
        FROM user_watchlists uw
        JOIN titles t ON uw.title_id = t.id
        WHERE uw.user_id = :user_id
        ORDER BY uw.added_at DESC
    ");
    $stmt->execute([':user_id' => $userId]);
    respond($stmt->fetchAll());
}

// 12) مزامنة/تبديل حفظ عمل للمستخدم: POST /user/watchlist/toggle
if ($method === 'POST' && count($segments) === 3 && $segments[0] === 'user' && $segments[1] === 'watchlist' && $segments[2] === 'toggle') {
    $input   = json_decode(file_get_contents('php://input'), true);
    $userId  = isset($input['user_id']) ? (int)$input['user_id'] : 0;
    $titleId = isset($input['title_id']) ? (int)$input['title_id'] : 0;

    if ($userId <= 0 || $titleId <= 0) {
        respond(null, false, "بيانات الإضافة غير مكتملة", 422);
    }

    $stmt = $pdo->prepare("SELECT id FROM user_watchlists WHERE user_id = :u AND title_id = :t");
    $stmt->execute([':u' => $userId, ':t' => $titleId]);
    $exists = $stmt->fetch();

    if ($exists) {
        $del = $pdo->prepare("DELETE FROM user_watchlists WHERE user_id = :u AND title_id = :t");
        $del->execute([':u' => $userId, ':t' => $titleId]);
        respond(["saved" => false], true, "تم حذف العمل من قائمتك السحابية");
    } else {
        $ins = $pdo->prepare("INSERT INTO user_watchlists (user_id, title_id) VALUES (:u, :t)");
        $ins->execute([':u' => $userId, ':t' => $titleId]);
        respond(["saved" => true], true, "تمت إضافة العمل إلى قائمتك السحابية");
    }
}

// 13) إحصائيات لوحة التحكم (محمي بالـ PIN): GET /admin/stats
if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'admin' && $segments[1] === 'stats') {
    verifyAdminAuth();

    $totalTitles = (int)$pdo->query("SELECT COUNT(*) FROM titles")->fetchColumn();
    $totalClicks = (int)$pdo->query("SELECT COUNT(*) FROM affiliate_clicks")->fetchColumn();
    $totalProviders = (int)$pdo->query("SELECT COUNT(*) FROM providers")->fetchColumn();

    $topProviders = $pdo->query("
        SELECT 
            COALESCE(p.name, 'رابط مباشر') AS name,
            COUNT(ac.id) AS clicks_count
        FROM affiliate_clicks ac
        LEFT JOIN providers p ON ac.provider_id = p.id
        GROUP BY p.name
        ORDER BY clicks_count DESC
        LIMIT 5
    ")->fetchAll();

    $topTitles = $pdo->query("
        SELECT 
            COALESCE(t.title, 'تصفح عام') AS title,
            COUNT(ac.id) AS clicks_count
        FROM affiliate_clicks ac
        LEFT JOIN titles t ON ac.title_id = t.id
        GROUP BY t.title
        ORDER BY clicks_count DESC
        LIMIT 5
    ")->fetchAll();

    $recentClicks = $pdo->query("
        SELECT 
            ac.id,
            COALESCE(t.title, 'زيارة منصة مباشرة') AS title,
            COALESCE(p.name, 'رابط العمل') AS provider_name,
            ac.user_ip,
            ac.clicked_at
        FROM affiliate_clicks ac
        LEFT JOIN titles t ON ac.title_id = t.id
        LEFT JOIN providers p ON ac.provider_id = p.id
        ORDER BY ac.clicked_at DESC
        LIMIT 10
    ")->fetchAll();

    respond([
        "total_titles"    => $totalTitles,
        "total_clicks"    => $totalClicks,
        "total_providers" => $totalProviders,
        "top_providers"   => $topProviders,
        "top_titles"      => $topTitles,
        "recent_clicks"   => $recentClicks
    ]);
}

// 14) تشغيل المزامنة مع TMDB (محمي بالـ PIN): POST /admin/sync
if ($method === 'POST' && count($segments) === 2 && $segments[0] === 'admin' && $segments[1] === 'sync') {
    verifyAdminAuth();

    $importScriptPath = dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'scripts' . DIRECTORY_SEPARATOR . 'import_tmdb.php';
    
    if (file_exists($importScriptPath)) {
        ob_start();
        include $importScriptPath;
        $output = ob_get_clean();
        respond(["output" => strip_tags($output)], true, "تم تشغيل مزامنة TMDB بنجاح واستيراد أحدث الأفلام والمنصات");
    } else {
        respond(null, false, "لم يتم العثور على سكربت import_tmdb.php", 404);
    }
}

// 15) جلب التريلر الرسمي للعمل من TMDB: GET /titles/{id}/trailer
if ($method === 'GET' && count($segments) === 3 && $segments[0] === 'titles' && $segments[2] === 'trailer') {
    $titleId = (int)$segments[1];
    $stmt = $pdo->prepare("SELECT tmdb_id, title FROM titles WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $titleId]);
    $titleRow = $stmt->fetch();

    $youtubeKey = null;

    if ($titleRow && !empty($titleRow['tmdb_id'])) {
        $tmdbKey = "8265bd1679663a7ea12ac168da84d2e8";
        $apiUrl = "https://api.themoviedb.org/3/movie/" . $titleRow['tmdb_id'] . "/videos?api_key=" . $tmdbKey . "&language=en-US";
        
        $ctx = stream_context_create(['http' => ['timeout' => 3]]);
        $response = @file_get_contents($apiUrl, false, $ctx);

        if ($response) {
            $data = json_decode($response, true);
            if (!empty($data['results'])) {
                foreach ($data['results'] as $vid) {
                    if ($vid['site'] === 'YouTube' && ($vid['type'] === 'Trailer' || $vid['type'] === 'Teaser')) {
                        $youtubeKey = $vid['key'];
                        break;
                    }
                }
            }
        }
    }

    respond([
        "trailer_key" => $youtubeKey,
        "title"       => $titleRow['title'] ?? ''
    ]);
}

respond(null, false, "مسار الـ API غير صالح", 404);