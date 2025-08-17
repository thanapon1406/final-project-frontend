# 🏞️ ห้วยตึงเฒ่า - เว็บไซต์ท่องเที่ยว

> เว็บไซต์ท่องเที่ยวสำหรับสำนักงานโครงการจัดหมู่บ้านตัวอย่างห้วยตึงเฒ่า อันเนื่องมาจากพระราชดำริ

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ คุณสมบัติหลัก

### 🎨 **ระบบจัดการเนื้อหา (JSON-based CMS)**
- แก้ไขเนื้อหาได้ง่ายผ่าน JSON Editor
- บันทึกไฟล์อัตโนมัติผ่าน REST API
- ระบบ backup อัตโนมัติก่อนแก้ไข
- รองรับการแก้ไขหลายภาษา

### 📱 **Frontend Technologies**
- **Bootstrap 5.3.0** - UI Framework
- **AOS (Animate On Scroll)** - Smooth animations
- **GSAP + ScrollTrigger** - Advanced animations (History page)
- **Leaflet** - Interactive maps (Contact page)
- **Particles.js** - Background effects
- **Typed.js** - Text typing animations

### 🎯 **Performance & SEO**
- Responsive Design รองรับทุกขนาดหน้าจอ
- Fast Loading ด้วย CDN และ optimization
- SEO Friendly structure
- Progressive Enhancement

### � **Architecture**
- **Modular JavaScript** - แยก JS ตามหน้า
- **API-first Design** - REST API backend
- **Fallback System** - localStorage cache
- **Error Handling** - Comprehensive error management

## 📁 โครงสร้างโปรเจค

```
huaytuengthao-website/
├── 📄 index.html              # หน้าหลัก (Homepage)
├── 📄 page-contact.html       # หน้าติดต่อเรา (Contact)
├── 📄 page-history.html       # หน้าประวัติ (History)
├── 📄 page-services.html      # หน้าบริการ (Services)
├── 📄 server.js               # Express.js Server
├── 📄 package.json            # Node.js dependencies
├── 📄 start.sh                # Start script (macOS/Linux)
│
├── 📁 admin/                  # ระบบจัดการ
│   ├── login.html            # หน้าเข้าสู่ระบบ
│   └── json-editor.html      # JSON Editor interface
│
├── 📁 js/                     # JavaScript modules
│   ├── shared.js             # ฟังก์ชันร่วม (Navigation, Footer)
│   ├── homepage.js           # หน้าหลัก
│   ├── contact.js            # หน้าติดต่อเรา
│   ├── history.js            # หน้าประวัติ
│   ├── services.js           # หน้าบริการ
│   ├── interactive.js        # Interactive features
│   ├── admin.js              # Admin functions
│   └── json-editor.js        # JSON Editor logic
│
├── 📁 css/                    # Stylesheets
│   ├── style.css             # Main CSS
│   ├── admin.css             # Admin interface CSS
│   └── icons.css             # Custom icons
│
├── 📁 data/                   # JSON Content files
│   ├── site-config.json      # การตั้งค่าเว็บไซต์
│   ├── navigation.json       # เมนูนำทาง
│   ├── footer.json           # ส่วนท้าย
│   ├── homepage-carousel.json # สไลด์หน้าหลัก
│   ├── homepage-news.json    # ข่าวสาร
│   ├── homepage-featured.json # คอนเทนต์เด่น
│   ├── homepage-gallery.json # แกลเลอรี่
│   ├── homepage-services.json # บริการหน้าหลัก
│   ├── about-content.json    # เกี่ยวกับเรา
│   ├── page-history.json     # เนื้อหาประวัติ
│   ├── page-services.json    # เนื้อหาบริการ
│   ├── contact-content.json  # ข้อมูลติดต่อ
│   └── users.json            # ผู้ใช้งานระบบ
│
├── 📁 controllers/            # Backend controllers
│   ├── Controller.js         # Base controller
│   └── AuthController.js     # Authentication
│
└── 📁 routes/                 # API routes
    ├── routes.js             # Main routes
    ├── auth-routes.js        # Authentication routes
    └── backup-routes.js      # Backup management
```

## 🚀 การติดตั้งและใช้งาน

### ✅ ความต้องการระบบ

- **Node.js** 14.0.0 หรือสูงกว่า
- **npm** (มาพร้อม Node.js)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### 📦 การติดตั้ง

#### 1. Clone Repository
```bash
git clone https://github.com/thanapon1406/final-project-frontend.git
cd final-project-frontend
```

#### 2. ติดตั้ง Dependencies
```bash
npm install
```

#### 3. เริ่มต้น Server

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
npm start
```

### 🌐 การเข้าใช้งาน

เมื่อ server ทำงานแล้ว เปิดเบราว์เซอร์และไปที่:

- **🏠 เว็บไซต์หลัก:** [http://localhost:3000](http://localhost:3000)
- **⚙️ JSON Editor:** [http://localhost:3000/admin/json-editor.html](http://localhost:3000/admin/json-editor.html)
- **🔐 Login:** [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)

### 📋 หน้าต่างๆ ในเว็บไซต์

| หน้า | URL | คำอธิบาย |
|------|-----|----------|
| 🏠 หน้าหลัก | `/` | Carousel, ข่าวสาร, บริการ, เกี่ยวกับเรา, แกลเลอรี่ |
| 📞 ติดต่อเรา | `/page-contact.html` | ข้อมูลติดต่อ, แผนที่ Leaflet |
| 📜 ประวัติ | `/page-history.html` | ประวัติพัฒนา, Timeline, GSAP animations |
| 🛎️ บริการ | `/page-services.html` | รายการบริการ, กิจกรรม |

## 🎛️ ระบบจัดการเนื้อหา (JSON Editor)

### 🔐 การเข้าสู่ระบบ

**ข้อมูลเริ่มต้น:**
- **Username:** `admin`
- **Password:** `admin123`

### 📝 การแก้ไขเนื้อหา

1. เข้าสู่ระบบผ่าน `/admin/login.html`
2. ไปที่ JSON Editor: `/admin/json-editor.html`
3. เลือกไฟล์ที่ต้องการแก้ไข
4. แก้ไขเนื้อหาในรูปแบบ JSON
5. กด "Save" เพื่อบันทึก
6. ระบบจะสร้าง backup อัตโนมัติ

### 🔄 ระบบ Backup

- Backup อัตโนมัติก่อนการแก้ไขทุกครั้ง
- เก็บไฟล์ backup ใน `/data/backups/`
- Format: `filename_YYYYMMDD_HHMMSS.json`

## 🛠️ API Endpoints

### 📊 JSON Data Management

```http
GET    /api/json/:filename     # ดึงข้อมูล JSON
POST   /api/json/:filename     # บันทึกข้อมูล JSON
GET    /api/backups            # ดูรายการ backup
POST   /api/restore/:filename  # กู้คืนจาก backup
```

### 🔐 Authentication

```http
POST   /api/auth/login         # เข้าสู่ระบบ
POST   /api/auth/logout        # ออกจากระบบ
GET    /api/auth/check         # ตรวจสอบสถานะ
```

## 🎨 Features ของแต่ละหน้า

### 🏠 หน้าหลัก (Homepage)
- **Carousel** แบบ responsive พร้อม indicators
- **News Marquee** แสดงข่าวสารแบบเลื่อน
- **Services Grid** พร้อม hover effects
- **About Section** แสดงข้อมูลเกี่ยวกับเรา
- **Gallery** แสดงภาพแบบ grid
- **Particles.js** background effects

### 📞 หน้าติดต่อเรา (Contact)
- **Interactive Leaflet Map** พร้อม marker และ popup
- **Contact Cards** แสดงข้อมูลติดต่อแบบ card
- **Responsive Design** รองรับทุกขนาดหน้าจอ
- **Fallback Map** ใช้ Google Maps iframe หาก Leaflet ไม่ทำงาน

### 📜 หน้าประวัติ (History)
- **GSAP Animations** พร้อม ScrollTrigger
- **Timeline Layout** แสดงประวัติการพัฒนา
- **Image Lightbox** เปิดดูภาพแบบ modal
- **Smooth Scrolling** เลื่อนหน้าจอแบบนุ่มนวล

### 🛎️ หน้าบริการ (Services)
- **Service Cards** แสดงบริการแบบ grid
- **Activities Section** กิจกรรมและอุปกรณ์
- **Hover Effects** เอฟเฟกต์เมื่อเลื่อนเมาส์
- **AOS Animations** แอนิเมชันเมื่อเลื่อนหน้า

## 💾 การทำงานของระบบ

### 🔄 Data Loading Strategy

1. **API First** - พยายามโหลดจาก API ก่อน
2. **localStorage Cache** - ใช้ cache หากมีข้อมูลที่แก้ไขแล้ว
3. **File Fallback** - โหลดจากไฟล์โดยตรงหากอื่นๆ ล้มเหลว

### 🎯 JavaScript Architecture

```javascript
// Example: Data loading pattern
async function loadJsonData(fileName) {
  try {
    // 1. Try API first
    const response = await fetch(`/api/json/${fileName}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn('API failed, trying localStorage...');
  }
  
  // 2. Try localStorage
  const cached = localStorage.getItem(`json_${fileName}`);
  if (cached) return JSON.parse(cached);
  
  // 3. Fallback to direct file
  const response = await fetch(`data/${fileName}.json`);
  return await response.json();
}
```

## 🔧 การพัฒนาและปรับแต่ง

### 📁 การเพิ่มหน้าใหม่

1. สร้างไฟล์ HTML ใหม่
2. สร้างไฟล์ JavaScript สำหรับหน้านั้น
3. เพิ่ม navigation ใน `data/navigation.json`
4. สร้างไฟล์ JSON สำหรับเนื้อหา

### 🎨 การปรับแต่ง Styling

- แก้ไขใน `css/style.css`
- ใช้ Bootstrap utility classes
- เพิ่ม custom animations ใน JavaScript

### 🔌 การเพิ่ม API Endpoint

```javascript
// ใน routes/routes.js
app.get('/api/new-endpoint', (req, res) => {
  // Logic here
});
```

## 🐛 การแก้ไขปัญหา

### ❌ ปัญหาที่พบบ่อย

| ปัญหา | สาเหตุ | วิธีแก้ไข |
|-------|--------|----------|
| หน้าไม่โหลดเนื้อหา | ไฟล์ JSON ผิดรูปแบบ | ตรวจสอบ syntax ใน JSON Editor |
| แผนที่ไม่แสดง | Leaflet library ไม่โหลด | ตรวจสอบ internet connection |
| Animation ไม่ทำงาน | JavaScript error | เปิด Developer Tools ดู Console |
| ไม่สามารถบันทึกได้ | ไม่มีสิทธิ์เขียนไฟล์ | ตรวจสอบ permissions |

### 🔍 การ Debug

```javascript
// เปิด debug mode
localStorage.setItem('debug', 'true');

// ล้าง cache
localStorage.clear();

// ดู errors ใน Console
console.log('Debug info:', data);
```

## 🤝 การสนับสนุนและการพัฒนา

### 📞 ติดต่อ

- **โปรเจค:** ห้วยตึงเฒ่า ท่องเที่ยว
- **Email:** support@huaytuengthao.com
- **GitHub:** [thanapon1406/final-project-frontend](https://github.com/thanapon1406/final-project-frontend)

### 🔄 การ Contribute

1. Fork repository
2. สร้าง feature branch
3. Commit changes
4. Push และสร้าง Pull Request

### 📝 License

โปรเจคนี้อยู่ภายใต้ [MIT License](LICENSE)

---

<div align="center">

**🏞️ สร้างโดยทีมพัฒนาห้วยตึงเฒ่า**

[🌐 Website](http://localhost:3000) • [📝 Documentation](README.md) • [⚙️ Admin Panel](http://localhost:3000/admin)

</div>

```bash
# ใช้ script
bash ./start.sh

```

### 2. เข้าใช้งานเว็บไซต์

- **เว็บไซต์หลัก**: http://localhost:3000/
- **JSON Editor**: http://localhost:3000/admin/json-editor.html

### 3. แก้ไขเนื้อหา (แบบใหม่ - ไม่ต้องดาวน์โหลด!)

1. เข้าสู่ระบบที่ `admin/login.html`

   - Username: `admin`
   - Password: `password123`

2. เข้า JSON Editor ที่ `admin/json-editor.html`

3. เลือกไฟล์ JSON ที่ต้องการแก้ไข

4. แก้ไขเนื้อหา → บันทึก

5. **ไฟล์จะถูกบันทึกโดยอัตโนมัติ!** ไม่ต้องดาวน์โหลดหรือแทนที่ไฟล์

6. รีเฟรชหน้าเว็บเพื่อดูการเปลี่ยนแปลง

## 🚀 การติดตั้งและใช้งาน (เดิม)

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

## 🔧 ฟีเจอร์ JSON Editor ใหม่

### 📊 **Dashboard Features:**

- ✅ **สถานะ API** - แสดงสถานะการเชื่อมต่อ API แบบ real-time
- ✅ **Auto Save** - บันทึกไฟล์โดยตรงผ่าน API ไม่ต้องดาวน์โหลด
- ✅ **Backup Viewer** - ดูไฟล์ backup ที่สร้างอัตโนมัติ
- ✅ **JSON Validator** - ตรวจสอบความถูกต้องของ JSON ก่อนบันทึก
- ✅ **System Test** - ทดสอบการทำงานของระบบทั้งหมด
- ✅ **Loading States** - แสดงสถานะการบันทึกแบบ real-time
- ✅ **Fallback Mode** - ทำงานได้แม้ API ไม่พร้อมใช้งาน

### 🎯 **การใช้งาน JSON Editor:**

1. **เช็คสถานะ API** - ดูสถานะการเชื่อมต่อด้านบน
2. **เลือกไฟล์** - คลิกการ์ดไฟล์ที่ต้องการแก้ไข
3. **แก้ไขข้อมูล** - กรอกข้อมูลในฟอร์ม
4. **ตรวจสอบ JSON** - กดปุ่ม "ตรวจสอบ JSON" เพื่อ validate
5. **บันทึก** - กดปุ่ม "บันทึกการเปลี่ยนแปลง"
6. **รอผลลัพธ์** - ระบบจะแสดงผลการบันทึก

### 🔄 **Fallback System:**

หาก API ไม่พร้อมใช้งาน ระบบจะ:

1. แสดงสถานะ "Fallback Mode"
2. ใช้การดาวน์โหลดไฟล์แทน
3. บันทึกลง localStorage เป็น backup
4. แสดงคำแนะนำการแทนที่ไฟล์

## 🚨 การแก้ไขปัญหา

### ปัญหา API ไม่ทำงาน:

```bash
# ตรวจสอบว่า server ทำงานหรือไม่
npm start

# ตรวจสอบ port 3000
curl http://localhost:3000/api/json
```

### ปัญหาไฟล์ไม่อัพเดท:

1. ตรวจสอบสถานะ API ในหน้า JSON Editor
2. ลองรีเฟรชหน้าเว็บ
3. ตรวจสอบ Console ใน Developer Tools
4. ใช้ปุ่ม "ทดสอบ" เพื่อตรวจสอบระบบ
