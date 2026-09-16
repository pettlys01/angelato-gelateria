#!/usr/bin/env python3
"""Servidor local de desenvolvimento: python3 servidor.py → http://127.0.0.1:4189
chdir explícito antes de importar http.server (o módulo lê os.getcwd() na
definição dos argumentos)."""
import os
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "docs")
os.chdir(RAIZ)
import http.server, socketserver

porta = int(os.environ.get("PORT", "4189"))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, *a):
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", porta), Handler) as s:
    print(f"servindo {RAIZ} em http://127.0.0.1:{porta}", flush=True)
    s.serve_forever()
