<?php
// Path: cineverse/core/Router.php

class Router {
    private $routes = [];

    // إضافة مسار جديد للجدول مع دعم البارامترات مثل {id}
    public function add($method, $path, $controller, $action) {
        // تحويل المسار إلى Regular Expression لقراءة المتغيرات
        $routeRegex = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $path);
        $routeRegex = "@^" . $routeRegex . "$@D";

        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'regex' => $routeRegex,
            'controller' => $controller,
            'action' => $action
        ];
    }

    // تسجيل مسار GET
    public function get($path, $controller, $action) {
        $this->add('GET', $path, $controller, $action);
    }

    // تسجيل مسار POST
    public function post($path, $controller, $action) {
        $this->add('POST', $path, $controller, $action);
    }

    // تسجيل مسار DELETE (اللي كانت عاملة المشكلة)
    public function delete($path, $controller, $action) {
        $this->add('DELETE', $path, $controller, $action);
    }

    // توجيه الطلب للكنترولر المناسب
    public function dispatch($uri, $method) {
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['regex'], $uri, $matches)) {
                array_shift($matches); // إزالة أول عنصر لأنه بيمثل المطابقة الكاملة

                $controllerName = $route['controller'];
                $actionName = $route['action'];

                // مسار ملف الكنترولر
                $controllerFile = __DIR__ . '/../app/Controllers/' . $controllerName . '.php';

                if (file_exists($controllerFile)) {
                    require_once $controllerFile;

                    if (class_exists($controllerName)) {
                        $controllerInstance = new $controllerName();

                        if (method_exists($controllerInstance, $actionName)) {
                            // تنفيذ الميثود مع تمرير البارامترات (زي الـ ID)
                            return call_user_func_array([$controllerInstance, $actionName], $matches);
                        } else {
                            http_response_code(500);
                            echo json_encode(["success" => false, "message" => "Method $actionName not found in controller $controllerName"]);
                            return;
                        }
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Controller class $controllerName not found"]);
                        return;
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(["success" => false, "message" => "Controller $controllerName not found"]);
                    return;
                }
            }
        }

        // لو مفيش أي مسار طابق الطلب
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Endpoint Not Found: " . $uri]);
    }
}