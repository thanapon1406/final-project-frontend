# ห้วยตึงเฒ่า Website - Architecture & Usage Diagram

## 🏗️ โครงสร้างระบบโดยรวม

```
┌─────────────────────────────────────────────────────────────────┐
│                    ห้วยตึงเฒ่า Website System                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Frontend      │    │   Backend       │    │   Data       │ │
│  │   (Static)      │◄──►│   (Node.js)     │◄──►│   (JSON)     │ │
│  │                 │    │                 │    │              │ │
│  │ • HTML Pages    │    │ • Express.js    │    │ • JSON Files │ │
│  │ • CSS Styling   │    │ • REST API      │    │ • Backups    │ │
│  │ • JavaScript    │    │ • Controllers   │    │ • Users      │ │
│  │ • Bootstrap     │    │ • Routes        │    │              │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🌐 Frontend Structure (หน้าเว็บ)

### หน้าหลัก (Public Pages)

```
index.html (หน้าหลัก)
├── Navigation Bar (เมนูนำทาง)
├── Carousel (สไลด์รูปภาพ)
├── News Marquee (ข่าวสารเลื่อน)
├── Hero Section (เนื้อหาเด่น)
├── Services Section (บริการ)
├── News Table (ตารางข่าว)
├── About Section (เกี่ยวกับเรา)
├── Gallery Section (แกลเลอรี่)
└── Footer (ส่วนท้าย)

page-contact.html (หน้าติดต่อ)
├── Contact Information
├── Google Maps
└── Contact Form

page-history.html (หน้าประวัติ)
├── History Content
├── Timeline
└── Image Gallery

page-services.html (หน้าบริการ)
├── Service Details
├── Operating Hours
└── Service Information
```

### หน้า Admin (Admin Panel)

```
admin/login.html (เข้าสู่ระบบ)
├── Login Form
├── Authentication
└── Session Management

admin/json-editor.html (แก้ไข JSON)
├── File Selection Cards
├── Dynamic Form Generator
├── JSON Validator
├── API Status Monitor
└── Backup Viewer
```

## 🎨 CSS Architecture

### CSS Files Structure

```
css/
├── style.css (CSS หลัก)
│   ├── Color Variables (:root)
│   ├── Base Styles (body, typography)
│   ├── Navigation Styles
│   ├── Component Styles (cards, buttons)
│   ├── Section Styles (hero, gallery)
│   ├── Responsive Design (@media)
│   └── Utility Classes
│
├── admin.css (CSS สำหรับ Admin)
│   ├── Admin Login Styles
│   ├── Sidebar Styles
│   ├── Form Styles
│   ├── Card Styles
│   └── Animation Keyframes
│
└── icons.css (Bootstrap Icons)
    ├── Icon Imports
    ├── Custom Icon Sizes
    └── Color Variants
```

### CSS Variables (Color Scheme)

```css
:root {
  --primary-color: #2c3e50; /* สีหลัก */
  --secondary-color: #34495e; /* สีรอง */
  --accent-color: #3498db; /* สีเน้น */
  --success-color: #27ae60; /* สีสำเร็จ */
  --warning-color: #f39c12; /* สีเตือน */
  --danger-color: #e74c3c; /* สีอันตราย */
}
```

## ⚙️ Backend Architecture (Node.js + Express)

### Server Structure

```
server.js (Main Server)
├── Express App Setup
├── Middleware Configuration
│   ├── CORS
│   ├── JSON Parser
│   └── Static File Serving
├── Route Mounting
│   ├── /api/json (JSON Routes)
│   ├── /api/backups (Backup Routes)
│   └── /api/auth (Auth Routes)
└── Error Handling
```

### API Routes

```
/api/json/
├── GET / (ดูรายการไฟล์ JSON)
├── GET /:filename (อ่านไฟล์ JSON)
└── POST /:filename (บันทึกไฟล์ JSON)

/api/backups/
└── GET /:filename? (ดู backup files)

/api/auth/
├── POST /login (เข้าสู่ระบบ)
├── POST /logout (ออกจากระบบ)
├── GET /users (ดูรายการผู้ใช้)
└── POST /change-password (เปลี่ยนรหัสผ่าน)
```

### Controllers

```
controllers/
├── Controller.js (JSON File Management)
│   ├── getJsonFile() - อ่านไฟล์ JSON
│   ├── saveJsonFile() - บันทึกไฟล์ JSON
│   ├── getJsonFileList() - ดูรายการไฟล์
│   └── getBackupFiles() - ดู backup files
│
└── AuthController.js (Authentication)
    ├── login() - เข้าสู่ระบบ
    ├── logout() - ออกจากระบบ
    ├── getUsers() - ดูรายการผู้ใช้
    └── changePassword() - เปลี่ยนรหัสผ่าน
```

## 📊 Data Management (JSON Files)

### JSON Files Structure

```
data/
├── site-config.json (การตั้งค่าเว็บไซต์)
│   ├── site (ข้อมูลเว็บไซต์)
│   └── navigation (เมนูนำทาง)
│
├── users.json (ข้อมูลผู้ใช้)
│   └── users[] (รายการผู้ใช้)
│
├── homepage-*.json (ข้อมูลหน้าหลัก)
│   ├── homepage-carousel.json (สไลด์)
│   ├── homepage-news.json (ข่าวสาร)
│   ├── homepage-featured.json (เนื้อหาเด่น)
│   ├── homepage-gallery.json (แกลเลอรี่)
│   └── homepage-services.json (บริการ)
│
├── page-*.json (ข้อมูลหน้าต่างๆ)
│   ├── page-history.json (ประวัติ)
│   ├── page-services.json (บริการ)
│   └── contact-content.json (ติดต่อ)
│
├── about-content.json (เกี่ยวกับเรา)
├── footer.json (ส่วนท้าย)
└── backups/ (โฟลเดอร์ backup)
    └── filename_timestamp.json
```

### Backup System

```
Backup Process:
1. อ่านไฟล์เดิม
2. สร้าง backup ด้วย timestamp
3. บันทึกไฟล์ใหม่
4. เก็บ backup ในโฟลเดอร์ backups/

Backup Naming: filename_timestamp.json
Example: homepage-carousel_1692345678901.json
```

## 🔄 Data Flow & Logic

### การโหลดข้อมูล (Data Loading)

```
Frontend Data Loading Priority:
1. API Call (/api/json/:filename)
   ↓ (หากล้มเหลว)
2. localStorage (ข้อมูลที่แก้ไขแล้ว)
   ↓ (หากไม่มี)
3. Direct File Load (data/:filename.json)
   ↓ (หากล้มเหลว)
4. Sample Data (fallback)
```

### การบันทึกข้อมูล (Data Saving)

```
Admin Save Process:
1. Collect Form Data (รวบรวมข้อมูลจากฟอร์ม)
2. Validate JSON (ตรวจสอบความถูกต้อง)
3. API Call (POST /api/json/:filename)
   ├── Create Backup (สร้าง backup)
   ├── Save New File (บันทึกไฟล์ใหม่)
   └── Return Success/Error
4. Update localStorage (บันทึกลง localStorage)
5. Show Result (แสดงผลลัพธ์)

Fallback Mode (หาก API ไม่พร้อม):
1. Save to localStorage
2. Download JSON File
3. Manual File Replacement
```

## 🔐 Authentication System

### Login Process

```
Login Flow:
1. User Input (username/password)
2. API Call (/api/auth/login)
3. Validate Credentials (ตรวจสอบใน users.json)
4. Generate Session Token
5. Store in localStorage
   ├── adminLoggedIn: true
   ├── adminLoginTime: timestamp
   ├── adminUser: user data
   └── adminToken: session token
6. Redirect to JSON Editor
```

### Session Management

```
Session Validation:
├── Check adminLoggedIn flag
├── Validate session timeout (24 hours)
├── Remember Me option (7 days)
└── Auto logout on expire

Session Storage:
├── localStorage (client-side)
├── No server-side sessions
└── Simple token-based auth
```

## 📱 JavaScript Architecture

### Shared Functions (js/shared.js)

```
Shared Functionality:
├── loadJsonData() - โหลดข้อมูล JSON
├── loadSharedData() - โหลดข้อมูลร่วม
├── updateSiteConfig() - อัพเดทการตั้งค่า
├── updateNavigation() - อัพเดทเมนู
├── updateFooter() - อัพเดท footer
└── refreshSharedData() - รีเฟรชข้อมูล
```

### JSON Editor (js/json-editor.js)

```
JSON Editor Features:
├── Dynamic Form Generation
│   ├── generateForm() - สร้างฟอร์มอัตโนมัติ
│   ├── generateFieldHtml() - สร้าง HTML field
│   └── generateArrayFieldHtml() - สร้าง array fields
├── Data Management
│   ├── loadJsonFile() - โหลดไฟล์ JSON
│   ├── saveJsonFile() - บันทึกไฟล์ JSON
│   ├── collectFormData() - รวบรวมข้อมูลฟอร์ม
│   └── validateFormData() - ตรวจสอบข้อมูล
├── Array Management
│   ├── addArrayItem() - เพิ่มรายการ array
│   ├── removeArrayItem() - ลบรายการ array
│   └── addNestedArrayItem() - เพิ่ม nested array
└── Utility Functions
    ├── getNestedValue() - ดึงค่า nested
    ├── setNestedValue() - ตั้งค่า nested
    └── previewJson() - ดูตัวอย่าง JSON
```

### Admin Functions (js/admin.js)

```
Admin Functionality:
├── Authentication
│   ├── handleLogin() - จัดการการเข้าสู่ระบบ
│   ├── checkAuthentication() - ตรวจสอบสิทธิ์
│   └── logout() - ออกจากระบบ
├── Session Management
│   ├── checkExistingLogin() - ตรวจสอบ session
│   └── logActivity() - บันทึกกิจกรรม
└── UI Functions
    ├── showLoginAlert() - แสดงข้อความ
    └── togglePassword() - แสดง/ซ่อนรหัสผ่าน
```

## 🎯 Key Features & Usage

### 1. Content Management System (CMS)

```
JSON-based CMS:
├── No Database Required
├── File-based Storage
├── Real-time Updates
├── Auto Backup System
├── Version Control (via backups)
└── Easy Content Editing
```

### 2. Admin Panel Features

```
Admin Dashboard:
├── File Selection Cards (เลือกไฟล์ที่จะแก้ไข)
├── Dynamic Form Generation (สร้างฟอร์มอัตโนมัติ)
├── JSON Validation (ตรวจสอบ JSON)
├── API Status Monitor (ตรวจสอบสถานะ API)
├── Backup Viewer (ดู backup files)
├── Real-time Save (บันทึกแบบ real-time)
└── Fallback Mode (โหมดสำรอง)
```

### 3. Responsive Design

```
Responsive Features:
├── Mobile-first Design
├── Bootstrap 5 Framework
├── Flexible Grid System
├── Adaptive Navigation
├── Touch-friendly Interface
└── Cross-browser Compatibility
```

### 4. Performance Optimization

```
Performance Features:
├── CDN Resources (Bootstrap, jQuery)
├── Optimized Images
├── Minimal HTTP Requests
├── Efficient CSS/JS
├── Lazy Loading (images)
└── Caching Strategy
```

## 🔧 Libraries & Dependencies

### Frontend Libraries

```
Frontend Stack:
├── Bootstrap 5.3.0 (UI Framework)
├── jQuery 3.6.0 (DOM Manipulation)
├── Bootstrap Icons (Icon Library)
├── Google Fonts (Noto Sans Thai)
└── Custom CSS/JS
```

### Backend Dependencies

```
Backend Stack:
├── Node.js (Runtime)
├── Express.js 4.18.2 (Web Framework)
├── CORS 2.8.5 (Cross-Origin Requests)
└── Nodemon 3.0.1 (Development)

Package.json:
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🚀 Deployment & Usage

### Development Mode

```
Development Setup:
1. npm install (ติดตั้ง dependencies)
2. npm run dev (เริ่ม development server)
3. Access: http://localhost:3000
4. Admin: http://localhost:3000/admin/json-editor.html
```

### Production Deployment

```
Production Setup:
1. npm start (เริ่ม production server)
2. Configure reverse proxy (nginx/apache)
3. Set up SSL certificate
4. Configure firewall
5. Set up monitoring
```

### File Structure Summary

```
project/
├── index.html (หน้าหลัก)
├── page-*.html (หน้าต่างๆ)
├── admin/ (หน้า admin)
├── css/ (ไฟล์ CSS)
├── js/ (ไฟล์ JavaScript)
├── data/ (ไฟล์ JSON)
├── controllers/ (Backend controllers)
├── routes/ (API routes)
├── server.js (Main server)
├── package.json (Dependencies)
└── README.md (Documentation)
```

## 📋 Usage Workflow

### สำหรับผู้ดูแลเว็บไซต์:

1. เข้าสู่ระบบที่ `/admin/login.html`
2. เลือกไฟล์ JSON ที่ต้องการแก้ไข
3. แก้ไขข้อมูลในฟอร์ม
4. ตรวจสอบ JSON ก่อนบันทึก
5. บันทึกข้อมูล (auto backup)
6. ตรวจสอบผลลัพธ์บนเว็บไซต์

### สำหรับผู้เยี่ยมชม:

1. เข้าชมเว็บไซต์ที่ `/index.html`
2. ดูข้อมูลต่างๆ ที่อัพเดทแบบ real-time
3. นำทางผ่านเมนูต่างๆ
4. ดูข้อมูลติดต่อและแผนที่
5. อ่านประวัติและข้อมูลบริการ

นี่คือ diagram และคำอธิบายโดยละเอียดของระบบเว็บไซต์ห้วยตึงเฒ่า ครอบคลุมทั้งโครงสร้าง การทำงาน และการใช้งานทั้งหมด!
