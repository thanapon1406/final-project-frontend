// Contact Page JavaScript

let contactData = null;

// Load JSON data (try API first, then localStorage, then file)
async function loadJsonData(fileName) {
  // Try API first
  try {
    const response = await fetch(`/api/json/${fileName}`);
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
    }
  } catch (apiError) {
    console.warn(`API load failed for ${fileName}, trying fallback:`, apiError);
  }

  // Fallback to localStorage (edited data)
  const savedData = localStorage.getItem(`json_${fileName}`);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.warn(`Invalid saved data for ${fileName}, loading from file`);
    }
  }

  // Final fallback to direct file load
  const response = await fetch(`data/${fileName}.json`);
  return response.json();
}

// Load contact data
async function loadContactData() {
  try {
    contactData = await loadJsonData("contact-content");
    console.log("Contact data loaded:", contactData);
    return contactData;
  } catch (error) {
    console.error("Error loading contact data:", error);
    return null;
  }
}

// Update hero section
function updateHeroSection() {
  if (!contactData) return;

  const contact = contactData.contact;
  const heroContent = document.getElementById("hero-content");
  if (heroContent) {
    heroContent.innerHTML = `
      <h1>${contact.title}</h1>
      <p>${contact.subtitle}</p>
    `;
  }
}

// Update contact info
function updateContactInfo() {
  if (!contactData) return;

  const contact = contactData.contact;
  const contactInfo = document.getElementById("contact-info");
  if (contactInfo) {
    contactInfo.innerHTML = `
      <h3 class="card-title">
        <i class="bi bi-geo-alt text-primary me-2"></i>ที่อยู่
      </h3>
      <p class="card-text">
        ${contact.organization}<br>
        ${contact.address.fullAddress}
      </p>
      
      <h5 class="mt-4">
        <i class="bi bi-telephone text-primary me-2"></i>โทรศัพท์
      </h5>
      <p>${contact.phone}</p>
      
      <h5 class="mt-4">
        <i class="bi bi-clock text-primary me-2"></i>เวลาทำการ
      </h5>
      <p>${contact.operatingHours}</p>
      
      <h5 class="mt-4">
        <i class="bi bi-envelope text-primary me-2"></i>ติดตามเรา
      </h5>
      <div class="social-links">
        <a href="${contact.socialMedia.facebook.account}" class="btn btn-outline-primary btn-sm me-2" target="_blank">
          <i class="bi bi-facebook"></i> Facebook Account
        </a>
        <a href="${contact.socialMedia.facebook.fanpage}" class="btn btn-outline-primary btn-sm me-2" target="_blank">
          <i class="bi bi-facebook"></i> Facebook Fanpage
        </a>
      </div>
    `;
  }
}

// Create contact cards
function createContactCards() {
  if (!contactData) return;

  const contact = contactData.contact;
  const cardsContainer = document.getElementById("contact-cards");
  if (!cardsContainer) return;

  const cards = [
    {
      icon: "bi-telephone-fill",
      title: "โทรศัพท์",
      content: contact.phone,
      action: `tel:${contact.phone}`,
      actionText: "โทรหา",
      delay: 100,
    },
    {
      icon: "bi-clock-fill",
      title: "เวลาทำการ",
      content: contact.operatingHours,
      action: "#",
      actionText: "ดูเพิ่มเติม",
      delay: 200,
    },
    {
      icon: "bi-facebook",
      title: "Facebook",
      content: "ติดตามข่าวสารและกิจกรรม",
      action: contact.socialMedia.facebook.fanpage,
      actionText: "ไปที่ Facebook",
      delay: 300,
    },
  ];

  cardsContainer.innerHTML = cards
    .map(
      (card) => `
    <div class="col-md-4" data-aos="fade-up" data-aos-delay="${card.delay}">
      <div class="card text-center hover-card h-100">
        <div class="card-body">
          <div class="contact-icon mb-3">
            <i class="${card.icon} text-primary" style="font-size: 2.5rem;"></i>
          </div>
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${card.content}</p>
          <a href="${card.action}" class="btn btn-outline-primary btn-sm" ${
        card.action.startsWith("http") ? 'target="_blank"' : ""
      }>
            ${card.actionText}
          </a>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Update map with interactive Leaflet map
function updateMap() {
  if (!contactData) return;

  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) return;

  try {
    // Create map
    const map = L.map(mapContainer).setView([18.804, 98.961], 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker
    const marker = L.marker([18.804, 98.961]).addTo(map);
    marker
      .bindPopup(
        `
      <div class="text-center">
        <strong>${contactData.contact.organization}</strong><br>
        ${contactData.contact.address.fullAddress}<br>
        <small>โทร: ${contactData.contact.phone}</small>
      </div>
    `
      )
      .openPopup();

    // Add click event to map
    map.on("click", function (e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      console.log(`Clicked at: ${lat}, ${lng}`);
    });
  } catch (error) {
    console.error("Error initializing map:", error);
    // Fallback to iframe map
    updateMapFallback();
  }
}

// Fallback map using iframe
function updateMapFallback() {
  if (!contactData) return;

  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) return;

  const maps = contactData.contact.googleMaps;
  mapContainer.innerHTML = `
    <iframe 
      src="${maps.embedUrl}" 
      width="${maps.width}" 
      height="${maps.height}" 
      style="${maps.style}" 
      allowfullscreen="${maps.allowfullscreen}" 
      loading="${maps.loading}">
    </iframe>
  `;
}

// Initialize interactive features
function initializeInteractiveFeatures() {
  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }

  // Initialize scroll to top button
  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (scrollToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = "block";
        scrollToTopBtn.style.opacity = "1";
      } else {
        scrollToTopBtn.style.opacity = "0";
        setTimeout(() => {
          if (window.pageYOffset <= 300) {
            scrollToTopBtn.style.display = "none";
          }
        }, 300);
      }
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Add hover effects to cards
  document.querySelectorAll(".hover-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await loadContactData();

  if (contactData) {
    updateHeroSection();
    updateContactInfo();
    updateMap();
    createContactCards();
    initializeInteractiveFeatures();
    console.log("Contact page updated with JSON data");
  }
});

// Refresh data function for admin use
function refreshContactData() {
  console.log("Refreshing contact data...");
  loadContactData().then(() => {
    if (contactData) {
      updateHeroSection();
      updateContactInfo();
      updateMap();
      createContactCards();
    }
  });
}
