#!/bin/sh
set -e
printf 'window.__APP_CONFIG__ = { apiBaseUrl: "%s" };\n' "${API_BASE_URL:-http://localhost:8080}" > /usr/share/nginx/html/config.js
