// JSON Editor JavaScript
let currentJsonData = null;
let currentFileName = "";

// JSON file configurations
const jsonConfigs = {
  "homepage-carousel": {
    title: "Carousel หน้าหลัก",
    fields: [
      {
        key: "slides",
        type: "array",
        label: "สไลด์",
        subfields: [
          { key: "id", type: "number", label: "ID" },
          { key: "title", type: "text", label: "หัวข้อ" },
          { key: "description", type: "textarea", label: "คำอธิบาย" },
          { key: "image", type: "url", label: "URL รูปภาพ" },
          { key: "active", type: "checkbox", label: "เปิดใช้งาน" },
        ],
      },
    ],
  },
  "homepage-news": {
    title: "ข่าวสารหน้าหลัก",
    fields: [
      {
        key: "announcements",
        type: "array",
        label: "ประกาศ",
        subfields: [
          { key: "id", type: "number", label: "ID" },
          { key: "text", type: "textarea", label: "ข้อความ" },
          {
            key: "priority",
            type: "select",
            label: "ความสำคัญ",
            options: ["high", "normal", "low"],
          },
          { key: "active", type: "checkbox", label: "เปิดใช้งาน" },
        ],
      },
      {
        key: "newsTable",
        type: "array",
        label: "ตารางข่าว",
        subfields: [
          { key: "date", type: "text", label: "วันที่" },
          { key: "content", type: "textarea", label: "เนื้อหา" },
        ],
      },
    ],
  },
  "site-config": {
    title: "การตั้งค่าเว็บไซต์",
    fields: [
      { key: "site.title", type: "text", label: "ชื่อเว็บไซต์" },
      { key: "site.shortTitle", type: "text", label: "ชื่อสั้น" },
      { key: "site.logo.url", type: "url", label: "URL โลโก้" },
      { key: "site.logo.alt", type: "text", label: "Alt Text โลโก้" },
      {
        key: "site.organization.fullName",
        type: "textarea",
        label: "ชื่อองค์กรเต็ม",
      },
      {
        key: "site.organization.shortName",
        type: "text",
        label: "ชื่อองค์กรสั้น",
      },
      {
        key: "navigation.brand.text",
        type: "textarea",
        label: "ข้อความ Brand",
      },
      {
        key: "navigation.brand.shortText",
        type: "text",
        label: "ข้อความ Brand สั้น",
      },
      {
        key: "navigation.menu",
        type: "array",
        label: "เมนูนำทาง",
        subfields: [
          { key: "id", type: "text", label: "ID" },
          { key: "text", type: "text", label: "ข้อความ" },
          { key: "href", type: "text", label: "ลิงก์" },
          { key: "active", type: "checkbox", label: "เปิดใช้งาน" },
        ],
      },
    ],
  },
  "homepage-featured": {
    title: "เนื้อหาเด่นหน้าหลัก",
    fields: [
      { key: "heroSection.title", type: "text", label: "หัวข้อหลัก" },
      { key: "heroSection.subtitle", type: "text", label: "หัวข้อรอง" },
      { key: "heroSection.description", type: "textarea", label: "คำอธิบาย" },
      { key: "heroSection.image", type: "url", label: "URL รูปภาพ" },
      {
        key: "heroSection.buttons",
        type: "array",
        label: "ปุ่ม",
        subfields: [
          { key: "text", type: "text", label: "ข้อความ" },
          { key: "href", type: "text", label: "ลิงก์" },
          { key: "icon", type: "text", label: "ไอคอน" },
          { key: "class", type: "text", label: "CSS Class" },
        ],
      },
      { key: "heroSection.overlay.icon", type: "text", label: "ไอคอน Overlay" },
      {
        key: "heroSection.overlay.title",
        type: "text",
        label: "หัวข้อ Overlay",
      },
      {
        key: "heroSection.overlay.description",
        type: "text",
        label: "คำอธิบาย Overlay",
      },
      {
        key: "activities",
        type: "array",
        label: "กิจกรรม",
        subfields: [
          { key: "id", type: "number", label: "ID" },
          { key: "title", type: "text", label: "หัวข้อ" },
          { key: "image", type: "url", label: "URL รูปภาพ" },
          { key: "alt", type: "text", label: "Alt Text" },
        ],
      },
      {
        key: "socialMedia.facebook.account",
        type: "url",
        label: "Facebook Account",
      },
      {
        key: "socialMedia.facebook.fanpage",
        type: "url",
        label: "Facebook Fanpage",
      },
    ],
  },
  "homepage-gallery": {
    title: "แกลเลอรี่หน้าหลัก",
    fields: [
      { key: "gallery.title", type: "text", label: "หัวข้อแกลเลอรี่" },
      { key: "gallery.subtitle", type: "text", label: "หัวข้อรอง" },
      {
        key: "gallery.images",
        type: "array",
        label: "รูปภาพ",
        subfields: [
          { key: "id", type: "number", label: "ID" },
          { key: "src", type: "url", label: "URL รูปภาพ" },
          { key: "alt", type: "text", label: "Alt Text" },
          { key: "title", type: "text", label: "หัวข้อ" },
          { key: "description", type: "textarea", label: "คำอธิบาย" },
          { key: "category", type: "text", label: "หมวดหมู่" },
        ],
      },
      {
        key: "socialMedia.facebook.account",
        type: "url",
        label: "Facebook Account",
      },
      {
        key: "socialMedia.facebook.fanpage",
        type: "url",
        label: "Facebook Fanpage",
      },
    ],
  },
  "page-services": {
    title: "หน้าบริการ",
    fields: [
      { key: "services.title", type: "text", label: "หัวข้อหน้า" },
      { key: "services.subtitle", type: "textarea", label: "คำอธิบายหน้า" },
      {
        key: "services.mainServices",
        type: "array",
        label: "บริการหลัก",
        subfields: [
          { key: "id", type: "number", label: "ID" },
          { key: "title", type: "text", label: "หัวข้อ" },
          { key: "description", type: "textarea", label: "คำอธิบาย" },
          { key: "image", type: "url", label: "URL รูปภาพ" },
        ],
      },
      {
        key: "services.serviceInfo.operatingHours",
        type: "text",
        label: "เวลาทำการ",
      },
      {
        key: "services.serviceInfo.phone",
        type: "text",
        label: "เบอร์โทรศัพท์",
      },
      {
        key: "services.serviceInfo.parking",
        type: "textarea",
        label: "ข้อมูลที่จอดรถ",
      },
      {
        key: "services.serviceInfo.restaurant",
        type: "textarea",
        label: "ข้อมูลร้านอาหาร",
      },
      { key: "services.serviceInfo.note", type: "textarea", label: "หมายเหตุ" },
      {
        key: "services.serviceInfo.socialMedia.facebook.account",
        type: "url",
        label: "Facebook Account",
      },
      {
        key: "services.serviceInfo.socialMedia.facebook.fanpage",
        type: "url",
        label: "Facebook Fanpage",
      },
    ],
  },
  "page-history": {
    title: "หน้าประวัติ",
    fields: [
      { key: "history.title", type: "text", label: "หัวข้อหน้า" },
      { key: "history.subtitle", type: "text", label: "หัวข้อรอง" },
      {
        key: "history.sections",
        type: "array",
        label: "หัวข้อประวัติ",
        subfields: [
          { key: "id", type: "number", label: "ID" },
          { key: "title", type: "text", label: "หัวข้อ" },
          {
            key: "content",
            type: "array",
            label: "เนื้อหา",
            subtype: "textarea",
          },
        ],
      },
      {
        key: "history.timeline",
        type: "array",
        label: "ไทม์ไลน์",
        subfields: [
          { key: "year", type: "text", label: "ปี" },
          { key: "title", type: "text", label: "หัวข้อ" },
          { key: "description", type: "textarea", label: "คำอธิบาย" },
        ],
      },
      {
        key: "history.socialMedia.facebook.account",
        type: "url",
        label: "Facebook Account",
      },
      {
        key: "history.socialMedia.facebook.fanpage",
        type: "url",
        label: "Facebook Fanpage",
      },
    ],
  },
  "contact-content": {
    title: "หน้าติดต่อ",
    fields: [
      { key: "contact.title", type: "text", label: "หัวข้อหน้า" },
      { key: "contact.subtitle", type: "textarea", label: "คำอธิบายหน้า" },
      { key: "contact.organization", type: "textarea", label: "ชื่อองค์กร" },
      {
        key: "contact.address.fullAddress",
        type: "textarea",
        label: "ที่อยู่เต็ม",
      },
      { key: "contact.phone", type: "text", label: "เบอร์โทรศัพท์" },
      { key: "contact.email", type: "email", label: "อีเมล" },
      { key: "contact.operatingHours", type: "text", label: "เวลาทำการ" },
      {
        key: "contact.socialMedia.facebook.account",
        type: "url",
        label: "Facebook Account",
      },
      {
        key: "contact.socialMedia.facebook.fanpage",
        type: "url",
        label: "Facebook Fanpage",
      },
      {
        key: "contact.googleMaps.embedUrl",
        type: "url",
        label: "Google Maps Embed URL",
      },
    ],
  },
  footer: {
    title: "Footer",
    fields: [
      {
        key: "footer.organization.name",
        type: "textarea",
        label: "ชื่อองค์กร",
      },
      { key: "footer.copyright.year", type: "text", label: "ปี Copyright" },
      {
        key: "footer.copyright.text",
        type: "textarea",
        label: "ข้อความ Copyright",
      },
      {
        key: "footer.socialMedia.facebook.account",
        type: "url",
        label: "Facebook Account",
      },
      {
        key: "footer.socialMedia.facebook.fanpage",
        type: "url",
        label: "Facebook Fanpage",
      },
    ],
  },
};

// Load JSON file
async function loadJsonFile(fileName) {
  try {
    showAlert("กำลังโหลดข้อมูล...", "info");

    // Reset current data
    currentJsonData = null;

    // First try to load from localStorage (edited version)
    const savedData = localStorage.getItem(`json_${fileName}`);
    if (savedData) {
      try {
        currentJsonData = JSON.parse(savedData);
        console.log("Loaded from localStorage:", currentJsonData);
      } catch (e) {
        console.warn("Invalid saved data in localStorage, loading from file");
        currentJsonData = null;
      }
    }

    // If no saved data, load from original file
    if (!currentJsonData) {
      try {
        const response = await fetch(`../data/${fileName}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log("Raw JSON response:", text);
        currentJsonData = JSON.parse(text);
        console.log("Parsed JSON data:", currentJsonData);
      } catch (fetchError) {
        console.error("Error fetching file:", fetchError);
        // Try to load sample data if file doesn't exist
        currentJsonData = getSampleData(fileName);
        if (!currentJsonData) {
          throw new Error(`ไม่สามารถโหลดไฟล์ ${fileName}.json ได้`);
        }
      }
    }

    currentFileName = fileName;

    document.getElementById("currentFileName").textContent = `${fileName}.json`;
    document.getElementById("jsonFileList").style.display = "none";
    document.getElementById("jsonEditorForm").style.display = "block";

    generateForm(fileName);

    // Show load source info
    const source = savedData ? "ข้อมูลที่แก้ไขแล้ว" : "ไฟล์ต้นฉบับ";
    showAlert(`โหลดข้อมูลสำเร็จจาก ${source}`, "success");
  } catch (error) {
    console.error("Error loading JSON file:", error);
    showAlert("เกิดข้อผิดพลาดในการโหลดไฟล์: " + error.message, "danger");
  }
}

// Get sample data if file doesn't exist
function getSampleData(fileName) {
  const sampleData = {
    "homepage-carousel": {
      slides: [
        {
          id: 1,
          title: "ยินดีต้อนรับสู่ห้วยตึงเฒ่า",
          description: "สถานที่ท่องเที่ยวเชิงนิเวศที่สวยงามในจังหวัดเชียงใหม่",
          image: "https://example.com/image1.jpg",
          active: true,
        },
      ],
    },
    "homepage-news": {
      announcements: [
        {
          id: 1,
          text: "ขณะนี้ ห้วยตึงเฒ่า เปิดให้บริการตามปกติทุกวัน ตั้งแต่เวลา 06:30 - 18:00 น.",
          priority: "high",
          active: true,
        },
      ],
      newsTable: [
        {
          date: "1 มกราคม 2567",
          content: "ข่าวสารตัวอย่าง",
        },
      ],
    },
    "homepage-featured": {
      heroSection: {
        title: "พ่อ แม่ ลูก",
        subtitle: "ครอบครัวคิงคองแห่งห้วยตึงเฒ่า",
        description:
          "พ่อตึงเฒ่า แม่ขวัญข้าว น้องแรมเพจ ครบทีม พ่อแม่ลูกแห่งห้วยตึงเฒ่า",
        image: "https://example.com/hero.jpg",
      },
      socialMedia: {
        facebook: {
          account: "https://www.facebook.com/huaytuengthao/",
          fanpage: "https://www.facebook.com/huaytuengthaocm",
        },
      },
    },
  };

  return sampleData[fileName] || null;
}

// Generate dynamic form based on JSON structure
function generateForm(fileName) {
  const config = jsonConfigs[fileName];
  if (!config) {
    showAlert("ไม่พบการกำหนดค่าสำหรับไฟล์นี้", "warning");
    return;
  }

  const formContainer = document.getElementById("dynamicForm");
  formContainer.innerHTML = "";

  config.fields.forEach((field) => {
    const fieldHtml = generateFieldHtml(field, currentJsonData);
    formContainer.innerHTML += fieldHtml;
  });
}

// Generate HTML for different field types
function generateFieldHtml(field, data) {
  const value = getNestedValue(data, field.key);

  switch (field.type) {
    case "text":
      return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <input type="text" class="form-control" data-key="${
                      field.key
                    }" value="${value || ""}" />
                </div>
            `;

    case "textarea":
      return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <textarea class="form-control" rows="3" data-key="${
                      field.key
                    }">${value || ""}</textarea>
                </div>
            `;

    case "url":
      return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <input type="url" class="form-control" data-key="${
                      field.key
                    }" value="${value || ""}" 
                           placeholder="https://example.com" />
                    <div class="form-text">กรุณาใส่ URL ที่สมบูรณ์ (เริ่มต้นด้วย http:// หรือ https://)</div>
                </div>
            `;

    case "email":
      return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <input type="email" class="form-control" data-key="${
                      field.key
                    }" value="${value || ""}" />
                </div>
            `;

    case "number":
      return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <input type="number" class="form-control" data-key="${
                      field.key
                    }" value="${value || ""}" />
                </div>
            `;

    case "checkbox":
      return `
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" data-key="${
                          field.key
                        }" 
                               ${value ? "checked" : ""} />
                        <label class="form-check-label">${field.label}</label>
                    </div>
                </div>
            `;

    case "select":
      const options = field.options
        .map(
          (opt) =>
            `<option value="${opt}" ${
              value === opt ? "selected" : ""
            }>${opt}</option>`
        )
        .join("");
      return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <select class="form-select" data-key="${field.key}">
                        ${options}
                    </select>
                </div>
            `;

    case "array":
      return generateArrayFieldHtml(field, value);

    default:
      return "";
  }
}

// Generate HTML for array fields
function generateArrayFieldHtml(field, arrayData) {
  if (!Array.isArray(arrayData)) arrayData = [];

  let html = `
        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>${field.label}</h5>
                <button type="button" class="btn btn-sm btn-outline-primary" 
                        onclick="addArrayItem('${field.key}')">
                    <i class="fas fa-plus me-1"></i>เพิ่มรายการ
                </button>
            </div>
            <div id="array-${field.key.replace(
              /\./g,
              "-"
            )}" class="border rounded p-3">
    `;

  arrayData.forEach((item, index) => {
    html += `
            <div class="card mb-3" data-array-item="${
              field.key
            }" data-index="${index}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>รายการที่ ${index + 1}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger" 
                            onclick="removeArrayItem('${field.key}', ${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="card-body">
        `;

    if (field.subfields) {
      field.subfields.forEach((subfield) => {
        const subValue = item[subfield.key] || "";
        html += generateSubFieldHtml(subfield, subValue, field.key, index);
      });
    }

    html += `
                </div>
            </div>
        `;
  });

  html += `
            </div>
        </div>
    `;

  return html;
}

// Generate HTML for subfields in arrays
function generateSubFieldHtml(subfield, value, parentKey, index) {
  const dataKey = `${parentKey}[${index}].${subfield.key}`;

  switch (subfield.type) {
    case "text":
      return `
                <div class="mb-2">
                    <label class="form-label">${subfield.label}</label>
                    <input type="text" class="form-control form-control-sm" 
                           data-key="${dataKey}" value="${value}" />
                </div>
            `;

    case "textarea":
      return `
                <div class="mb-2">
                    <label class="form-label">${subfield.label}</label>
                    <textarea class="form-control form-control-sm" rows="2" 
                              data-key="${dataKey}">${value}</textarea>
                </div>
            `;

    case "url":
      return `
                <div class="mb-2">
                    <label class="form-label">${subfield.label}</label>
                    <input type="url" class="form-control form-control-sm" 
                           data-key="${dataKey}" value="${value}" 
                           placeholder="https://example.com" />
                </div>
            `;

    case "number":
      return `
                <div class="mb-2">
                    <label class="form-label">${subfield.label}</label>
                    <input type="number" class="form-control form-control-sm" 
                           data-key="${dataKey}" value="${value}" />
                </div>
            `;

    case "checkbox":
      return `
                <div class="mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                               data-key="${dataKey}" ${
        value ? "checked" : ""
      } />
                        <label class="form-check-label">${
                          subfield.label
                        }</label>
                    </div>
                </div>
            `;

    case "array":
      if (subfield.subtype === "textarea") {
        let arrayHtml = `
                    <div class="mb-2">
                        <label class="form-label">${subfield.label}</label>
                `;
        if (Array.isArray(value)) {
          value.forEach((item, subIndex) => {
            arrayHtml += `
                            <textarea class="form-control form-control-sm mb-1" rows="2" 
                                      data-key="${dataKey}[${subIndex}]">${item}</textarea>
                        `;
          });
        }
        arrayHtml += `</div>`;
        return arrayHtml;
      }
      break;

    default:
      return "";
  }
}

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : "";
  }, obj);
}

// Set nested value in object using dot notation
function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Save JSON file
async function saveJsonFile() {
  try {
    showAlert("กำลังบันทึกข้อมูล...", "info");

    // Collect form data
    const formData = collectFormData();

    // Validate data
    if (!validateFormData(formData)) {
      showAlert("กรุณาตรวจสอบข้อมูลที่กรอก", "warning");
      return;
    }

    const jsonString = JSON.stringify(formData, null, 2);

    // Try to save to actual file using a simple approach
    try {
      // Create a download link to save the file
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentFileName}.json`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Also save to localStorage as backup
      localStorage.setItem(`json_${currentFileName}`, jsonString);

      // Update current data
      currentJsonData = formData;

      // Log activity
      logActivity("save", currentFileName);

      // Show success message with instructions
      showSaveInstructions(currentFileName, jsonString);
    } catch (error) {
      console.error("Error saving file:", error);
      // Fallback to localStorage only
      localStorage.setItem(`json_${currentFileName}`, jsonString);
      currentJsonData = formData;
      logActivity("save", currentFileName);
      showAlert(
        "บันทึกลง localStorage แล้ว (กรุณาดาวน์โหลดไฟล์และอัพโหลดไปยัง data/ folder)",
        "warning"
      );
    }
  } catch (error) {
    console.error("Error saving JSON file:", error);
    showAlert("เกิดข้อผิดพลาดในการบันทึก: " + error.message, "danger");
  }
}

// Show save instructions
function showSaveInstructions(fileName, jsonString) {
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title">
            <i class="fas fa-download me-2"></i>ไฟล์ถูกดาวน์โหลดแล้ว!
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-info">
            <h6><i class="fas fa-info-circle me-2"></i>วิธีการอัพเดทไฟล์:</h6>
            <ol class="mb-0">
              <li>ไฟล์ <strong>${fileName}.json</strong> ได้ถูกดาวน์โหลดไปยังโฟลเดอร์ Downloads แล้ว</li>
              <li>นำไฟล์ที่ดาวน์โหลดไปแทนที่ไฟล์เดิมในโฟลเดอร์ <code>data/</code></li>
              <li>รีเฟรชหน้าเว็บเพื่อดูการเปลี่ยนแปลง</li>
            </ol>
          </div>
          
          <div class="text-center mt-3">
            <button class="btn btn-outline-primary me-2" onclick="downloadBackup('${fileName}', \`${jsonString.replace(
    /`/g,
    "\\`"
  )}\`)">
              <i class="fas fa-download me-2"></i>ดาวน์โหลดอีกครั้ง
            </button>
            <button class="btn btn-outline-info me-2" onclick="copyJsonToClipboard(\`${jsonString.replace(
              /`/g,
              "\\`"
            )}\`)">
              <i class="fas fa-copy me-2"></i>คัดลอก JSON
            </button>
            <button class="btn btn-success" data-bs-dismiss="modal">
              <i class="fas fa-check me-2"></i>เข้าใจแล้ว
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Remove modal after hide
  modal.addEventListener("hidden.bs.modal", () => {
    document.body.removeChild(modal);
  });
}

// Download backup (optional)
function downloadBackup(fileName, jsonString) {
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}_backup_${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Log activity to localStorage
function logActivity(action, fileName) {
  const logs = JSON.parse(localStorage.getItem("admin_logs") || "[]");
  logs.unshift({
    timestamp: new Date().toISOString(),
    action: action,
    fileName: fileName,
    user: "admin",
  });

  // Keep only last 50 logs
  if (logs.length > 50) {
    logs.splice(50);
  }

  localStorage.setItem("admin_logs", JSON.stringify(logs));
}

// Collect form data
function collectFormData() {
  const formData = JSON.parse(JSON.stringify(currentJsonData)); // Deep copy

  // Collect simple fields
  document
    .querySelectorAll('[data-key]:not([data-key*="["])')
    .forEach((element) => {
      const key = element.getAttribute("data-key");
      let value = element.value;

      if (element.type === "checkbox") {
        value = element.checked;
      } else if (element.type === "number") {
        value = parseFloat(value) || 0;
      }

      setNestedValue(formData, key, value);
    });

  // Collect array fields
  document.querySelectorAll("[data-array-item]").forEach((arrayItem) => {
    const arrayKey = arrayItem.getAttribute("data-array-item");
    const index = parseInt(arrayItem.getAttribute("data-index"));

    const arrayPath = arrayKey.split(".");
    let targetArray = formData;
    arrayPath.forEach((key) => {
      if (!targetArray[key]) targetArray[key] = [];
      targetArray = targetArray[key];
    });

    if (!targetArray[index]) targetArray[index] = {};

    arrayItem.querySelectorAll("[data-key]").forEach((field) => {
      const fullKey = field.getAttribute("data-key");
      const fieldKey = fullKey.split(".").pop();
      let value = field.value;

      if (field.type === "checkbox") {
        value = field.checked;
      } else if (field.type === "number") {
        value = parseFloat(value) || 0;
      }

      targetArray[index][fieldKey] = value;
    });
  });

  return formData;
}

// Validate form data
function validateFormData(data) {
  // Add validation logic here
  return true;
}

// Add array item
function addArrayItem(arrayKey) {
  const config = jsonConfigs[currentFileName];
  const field = config.fields.find((f) => f.key === arrayKey);

  if (!field || field.type !== "array") {
    showAlert("ไม่พบการกำหนดค่าสำหรับฟิลด์นี้", "warning");
    return;
  }

  // Get current array data
  const arrayData = getNestedValue(currentJsonData, arrayKey) || [];

  // Create new item with default values
  const newItem = {};
  if (field.subfields) {
    field.subfields.forEach((subfield) => {
      switch (subfield.type) {
        case "number":
          newItem[subfield.key] = 0;
          break;
        case "checkbox":
          newItem[subfield.key] = false;
          break;
        case "array":
          newItem[subfield.key] = [];
          break;
        default:
          newItem[subfield.key] = "";
      }
    });
  }

  // Add new item to array
  arrayData.push(newItem);
  setNestedValue(currentJsonData, arrayKey, arrayData);

  // Regenerate form
  generateForm(currentFileName);
  showAlert("เพิ่มรายการใหม่แล้ว", "success");
}

// Remove array item
function removeArrayItem(arrayKey, index) {
  if (confirm("คุณต้องการลบรายการนี้หรือไม่?")) {
    // Get current array data
    const arrayData = getNestedValue(currentJsonData, arrayKey) || [];

    // Remove item at index
    arrayData.splice(index, 1);
    setNestedValue(currentJsonData, arrayKey, arrayData);

    // Regenerate form
    generateForm(currentFileName);
    showAlert("ลบรายการแล้ว", "success");
  }
}

// Back to file list
function backToFileList() {
  document.getElementById("jsonEditorForm").style.display = "none";
  document.getElementById("jsonFileList").style.display = "block";
  currentJsonData = null;
  currentFileName = "";
}

// Reset form
function resetForm() {
  if (
    confirm(
      "คุณต้องการรีเซ็ตฟอร์มหรือไม่? การเปลี่ยนแปลงที่ยังไม่ได้บันทึกจะหายไป"
    )
  ) {
    generateForm(currentFileName);
    showAlert("รีเซ็ตฟอร์มแล้ว", "info");
  }
}

// Reset to original file
async function resetToOriginal() {
  if (confirm("คุณต้องการโหลดข้อมูลต้นฉบับหรือไม่? การแก้ไขทั้งหมดจะหายไป")) {
    try {
      showAlert("กำลังโหลดข้อมูลต้นฉบับ...", "info");

      const response = await fetch(`../data/${currentFileName}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      currentJsonData = await response.json();

      // Remove saved data from localStorage
      localStorage.removeItem(`json_${currentFileName}`);

      generateForm(currentFileName);
      showAlert("โหลดข้อมูลต้นฉบับสำเร็จ", "success");
    } catch (error) {
      console.error("Error loading original file:", error);
      showAlert(
        "เกิดข้อผิดพลาดในการโหลดไฟล์ต้นฉบับ: " + error.message,
        "danger"
      );
    }
  }
}

// Preview JSON
function previewJson() {
  const formData = collectFormData();
  const jsonString = JSON.stringify(formData, null, 2);

  // Create modal for preview
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">ตัวอย่าง JSON: ${currentFileName}.json</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;"><code>${jsonString}</code></pre>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" onclick="copyJsonToClipboard()">
            <i class="fas fa-copy me-2"></i>คัดลอก
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Store current JSON for copying
  window.currentPreviewJson = jsonString;

  // Remove modal after hide
  modal.addEventListener("hidden.bs.modal", () => {
    document.body.removeChild(modal);
    delete window.currentPreviewJson;
  });
}

// Copy JSON to clipboard
function copyJsonToClipboard(jsonString = null) {
  const textToCopy = jsonString || window.currentPreviewJson;
  if (textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showAlert("คัดลอกไปยังคลิปบอร์ดแล้ว", "success");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showAlert("ไม่สามารถคัดลอกได้", "danger");
      });
  }
}

// Refresh JSON list
function refreshJsonList() {
  showAlert("รีเฟรชรายการไฟล์แล้ว", "success");
}

// Test JSON loading
async function testJsonLoad() {
  showAlert("กำลังทดสอบการโหลด JSON...", "info");

  const testFiles = ["homepage-carousel", "homepage-news", "page-services"];
  let results = [];

  for (const fileName of testFiles) {
    try {
      const response = await fetch(`../data/${fileName}.json`);
      if (response.ok) {
        const data = await response.json();
        results.push(
          `✅ ${fileName}.json - โหลดสำเร็จ (${Object.keys(data).length} keys)`
        );
      } else {
        results.push(`❌ ${fileName}.json - HTTP ${response.status}`);
      }
    } catch (error) {
      results.push(`❌ ${fileName}.json - Error: ${error.message}`);
    }
  }

  // Show results in modal
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">ผลการทดสอบโหลด JSON</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${results.join(
            "\n"
          )}</pre>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Remove modal after hide
  modal.addEventListener("hidden.bs.modal", () => {
    document.body.removeChild(modal);
  });

  showAlert("ทดสอบเสร็จแล้ว", "success");
}

// Show alert
function showAlert(message, type = "info") {
  const alertArea = document.getElementById("alertArea");
  const alertClass = `alert-${type}`;

  alertArea.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  // Auto dismiss after 3 seconds for success/info messages
  if (type === "success" || type === "info") {
    setTimeout(() => {
      const alert = alertArea.querySelector(".alert");
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 3000);
  }
}

// Logout function
function logout() {
  if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
    window.location.href = "login.html";
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  console.log("JSON Editor initialized");
});
