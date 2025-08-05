#!/bin/bash

echo "==============================================="
echo "   ห้วยตึงเฒ่า - เว็บไซต์ท่องเที่ยว"
echo "==============================================="
echo

# ตรวจสอบว่ามี Node.js หรือไม่
if ! command -v node &> /dev/null; then
    echo "❌ ไม่พบ Node.js กรุณาติดตั้ง Node.js ก่อน"
    echo "📥 ดาวน์โหลดได้ที่: https://nodejs.org/"
    exit 1
fi

echo "✅ พบ Node.js แล้ว"
node --version

# ตรวจสอบว่ามี node_modules หรือไม่
if [ ! -d "node_modules" ]; then
    echo
    echo "📦 กำลังติดตั้ง dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ การติดตั้ง dependencies ล้มเหลว"
        exit 1
    fi
fi

echo
echo "🚀 กำลังเริ่มต้น server..."
echo
echo "📝 JSON Editor: http://localhost:3000/admin/json-editor.html"
echo "🌐 Website: http://localhost:3000/index.html"
echo
echo "กด Ctrl+C เพื่อหยุด server"
echo

npm start