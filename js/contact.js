// Contact page specific functionality

let contactData = null;

// Load contact page data
async function loadContactData() {
  try {
    contactData = await loadJsonData("contact-content");

    if (contactData) {
      updateContactInfo();
      initializeContactMap();
    }

    console.log("Contact data loaded successfully");
  } catch (error) {
    console.error("Error loading contact data:", error);
  }
}

// Update contact information
function updateContactInfo() {
  if (!contactData?.contact) return;

  const contactContainer = document.querySelector("#contact-cards");
  if (!contactContainer) return;

  // Create contact cards based on contact data
  const contactCards = [
    {
      icon: "fas fa-map-marker-alt",
      title: "ที่อยู่",
      details: `${contactData.contact.organization}<br>${contactData.contact.address.fullAddress}`
    },
    {
      icon: "fas fa-phone",
      title: "โทรศัพท์",
      details: contactData.contact.phone
    },
    {
      icon: "fas fa-fax",
      title: "โทรสาร",
      details: contactData.contact.fax
    },
    {
      icon: "fas fa-envelope",
      title: "อีเมล",
      details: contactData.contact.email
    },
    {
      icon: "fas fa-clock",
      title: "เวลาทำการ",
      details: contactData.contact.operatingHours
    }
  ];

  contactContainer.innerHTML = `
    <div class="row">
      ${contactCards.map((item, index) => `
        <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="contact-card h-100">
            <div class="contact-icon">
              <i class="${item.icon}"></i>
            </div>
            <h5>${item.title}</h5>
            <p>${item.details}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Initialize interactive map
function initializeContactMap() {
  const mapContainer = document.getElementById("contact-map");
  if (!mapContainer || typeof L === "undefined") return;

  // Clear existing map
  if (window.contactMap) {
    window.contactMap.remove();
  }

  // Initialize Leaflet map
  window.contactMap = L.map("contact-map").setView([18.7061, 98.9817], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(window.contactMap);

  // Add marker
  const marker = L.marker([18.7061, 98.9817]).addTo(window.contactMap);
  marker.bindPopup(
    "<b>สำนักงานโครงการห้วยตึงเฒ่า</b><br>อันเนื่องมาจากพระราชดำริ"
  );

  console.log("Contact map initialized");
}

// Refresh contact data
function refreshContactData() {
  console.log("Refreshing contact data...");
  loadContactData();
}

// Initialize contact page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing contact page...");
  if (typeof showPreloader === "function") {
    showPreloader();
  }

  // Load JSON data
  loadContactData().finally(() => {
    if (typeof hidePreloader === "function") {
      hidePreloader();
    }
  });
});
