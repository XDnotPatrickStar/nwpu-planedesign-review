#!/usr/bin/env python3
"""飞机设计工程学填空题复习系统 - 本地服务器
用法: python serve.py
然后浏览器打开 http://localhost:8080
"""

import http.server
import socketserver
import os
import sys
import socket

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"  {args[0]}")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return '127.0.0.1'

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print()
print('  ✈  飞机设计工程学 · 填空题复习系统')
print('  ═══════════════════════════════════')
print()

try:
    with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
        local_ip = get_local_ip()
        print(f'  ✅ 服务器已启动！')
        print()
        print(f'  📱 本机访问:   http://localhost:{PORT}')
        print(f'  📱 手机访问:   http://{local_ip}:{PORT}')
        print()
        print(f'  💡 确保手机和电脑连接同一个 WiFi')
        print(f'  💡 按 Ctrl+C 停止服务器')
        print()
        httpd.serve_forever()
except OSError:
    print(f'  ❌ 端口 {PORT} 已被占用，尝试其他端口...')
    for alt_port in [8081, 8082, 3000, 5000, 9000]:
        try:
            with socketserver.TCPServer(('0.0.0.0', alt_port), Handler) as httpd:
                local_ip = get_local_ip()
                print(f'  ✅ 服务器已启动！')
                print(f'  📱 本机访问:   http://localhost:{alt_port}')
                print(f'  📱 手机访问:   http://{local_ip}:{alt_port}')
                print(f'  💡 按 Ctrl+C 停止服务器')
                httpd.serve_forever()
                break
        except OSError:
            continue
    else:
        print('  ❌ 无法启动服务器，请检查端口占用情况')
        sys.exit(1)
