<?php
// Path: cineverse/core/Logger.php

class Logger {
    private static $logDir = __DIR__ . '/../storage/logs/';

    private static function ensureDir() {
        if (!is_dir(self::$logDir)) {
            mkdir(self::$logDir, 0755, true);
        }
    }

    public static function error($message, $context = []) {
        self::write('error', $message, $context);
    }

    public static function security($message, $context = []) {
        self::write('security', $message, $context);
    }

    private static function write($type, $message, $context) {
        self::ensureDir();
        $date = date('Y-m-d');
        $file = self::$logDir . $type . '-' . $date . '.log';
        
        // Sanitize sensitive data from context
        if (isset($context['password'])) unset($context['password']);
        if (isset($context['token'])) unset($context['token']);
        if (isset($context['Authorization'])) unset($context['Authorization']);

        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' | Context: ' . json_encode($context) : '';
        $logEntry = "[$timestamp] [$type] $message $contextStr" . PHP_EOL;

        file_put_contents($file, $logEntry, FILE_APPEND);
    }
}