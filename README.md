# ห้วยตึงเฒ่า - เว็บไซต์ท่องเที่ยว

เว็บไซต์ท่องเที่ยวสำหรับสำนักงานโครงการจัดหมู่บ้านตัวอย่างห้วยตึงเฒ่า อันเนื่องมาจากพระราชดำริ

## ✨ คุณสมบัติ

- 🎨 **ระบบจัดการเนื้อหาผ่าน JSON** - แก้ไขเนื้อหาได้ง่ายผ่าน JSON Editor
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ
- 🔄 **Real-time Updates** - อัพเดทเนื้อหาแบบ real-time
- 🎯 **SEO Friendly** - เพิ่มประสิทธิภาพการค้นหา
- 🚀 **Fast Loading** - โหลดเร็วด้วย Bootstrap และ CDN

## 📁 โครงสร้างไฟล์

```
├── index.html              # หน้าหลัก
├── page-contact.html       # หน้าติดต่อเรา
├── page-history.html       # หน้าประวัติ
├── page-services.html      # หน้าบริการ
├── admin/
│   ├── login.html         # หน้าเข้าสู่ระบบ
│   └── json-editor.html   # JSON Editor
├── js/
│   ├── shared.js          # ฟังก์ชันร่วม
│   └── json-editor.js     # JSON Editor logic
├── css/
│   ├── style.css          # CSS หลัก
│   └── admin.css          # CSS สำหรับ admin
└── data/                  # ไฟล์ JSON
    ├── site-config.json
    ├── homepage-carousel.json
    ├── homepage-news.json
    ├── homepage-featured.json
    ├── homepage-gallery.json
    ├── homepage-services.json
    ├── about-content.json
    ├── page-history.json
    ├── page-services.json
    ├── contact-content.json
    └── footer.json
```

## 🚀 การติดตั้งและใช้งาน

### 1. เปิดเว็บไซต์

เปิดไฟล์ `index.html` ในเบราว์เซอร์

### 2. แก้ไขเนื้อหา

1. เข้าสู่ระบบที่ `admin/login.html`

   - Username: `admin`
   - Password: `password123`

2. เข้า JSON Editor ที่ `admin/json-editor.html`

3. เลือกไฟล์ JSON ที่ต้องการแก้ไข

4. แก้ไขเนื้อหา → บันทึก

5. ดาวน์โหลดไฟล์ที่อัพเดทแล้ว

6. นำไฟล์ไปแทนที่ในโฟลเดอร์ `data/`

7. รีเฟรชหน้าเว็บเพื่อดูการเปลี่ยนแปลง

## 📋 ไฟล์ JSON และหน้าที่

| ไฟล์ JSON                | หน้าที่                         | หน้าที่ใช้         |
| ------------------------ | ------------------------------- | ------------------ |
| `site-config.json`       | การตั้งค่าเว็บไซต์, เมนู, โลโก้ | ทุกหน้า            |
| `footer.json`            | ข้อมูล Footer                   | ทุกหน้า            |
| `homepage-carousel.json` | สไลด์หน้าหลัก                   | index.html         |
| `homepage-news.json`     | ข่าวสาร, ประกาศ                 | index.html         |
| `homepage-featured.json` | เนื้อหาเด่น, กิจกรรม            | index.html         |
| `homepage-gallery.json`  | แกลเลอรี่รูปภาพ                 | index.html         |
| `homepage-services.json` | บริการหน้าหลัก                  | index.html         |
| `about-content.json`     | เกี่ยวกับเรา                    | index.html         |
| `page-history.json`      | ประวัติความเป็นมา               | page-history.html  |
| `page-services.json`     | รายละเอียดบริการ                | page-services.html |
| `contact-content.json`   | ข้อมูลติดต่อ                    | page-contact.html  |

## 🔧 การพัฒนา

### ระบบ Fallback

เว็บไซต์จะโหลดข้อมูลตามลำดับ:

1. **localStorage** (ข้อมูลที่แก้ไขแล้ว)
2. **ไฟล์ JSON** (ข้อมูลต้นฉบับ)

### ปุ่มรีเฟรช (Development Mode)

ในโหมด development (localhost) จะมีปุ่มรีเฟรชข้อมูลที่มุมหน้าจอ

### การเพิ่มเนื้อหาใหม่

1. แก้ไขไฟล์ JSON ที่เกี่ยวข้อง
2. อัพเดท `js/json-editor.js` เพื่อรองรับฟิลด์ใหม่
3. แก้ไข JavaScript ในหน้า HTML เพื่อแสดงข้อมูลใหม่

## 🎨 การปรับแต่ง CSS

### ไฟล์ CSS หลัก

- `css/style.css` - สไตล์หลักของเว็บไซต์
- `css/admin.css` - สไตล์สำหรับหน้า admin

### CSS Variables

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
}
```

## 🔐 ความปลอดภัย

### การเข้าสู่ระบบ

- ระบบ login แบบ client-side (สำหรับ demo)
- ข้อมูลเก็บใน localStorage
- Session timeout 24 ชั่วโมง

### การแนะนำสำหรับ Production

- ใช้ระบบ authentication ที่แข็งแกร่งกว่า
- เข้ารหัสข้อมูลสำคัญ
- ใช้ HTTPS
- จำกัดการเข้าถึงโฟลเดอร์ admin

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **ข้อมูลไม่อัพเดท**

   - ตรวจสอบ Console ใน Developer Tools
   - ลบ localStorage: `localStorage.clear()`
   - ตรวจสอบไฟล์ JSON syntax

2. **รูปภาพไม่แสดง**

   - ตรวจสอบ URL ในไฟล์ JSON
   - ใช้ absolute URL แทน relative URL

3. **JSON Editor ไม่ทำงาน**
   - ตรวจสอบการเข้าสู่ระบบ
   - ตรวจสอบ JavaScript errors ใน Console

## 📞 การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ:

1. ตรวจสอบ Console ใน Developer Tools
2. ตรวจสอบไฟล์ JSON syntax
3. ลองรีเฟรชหน้าเว็บ
4. ลบ localStorage และโหลดใหม่

## 📄 License

Copyright © 2024 ห้วยตึงเฒ่า. All rights reserved.
