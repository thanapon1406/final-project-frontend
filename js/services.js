// Services page specific functionality

let servicesData = null;

// Load services page data
async function loadServicesData() {
  try {
    servicesData = await loadJsonData("page-services");

    if (servicesData) {
      updateServicesHero();
      updateServicesContent();
      updateServiceStats();
    }

    console.log("Services data loaded successfully");
  } catch (error) {
    console.error("Error loading services data:", error);
  }
}

// Update hero section
function updateServicesHero() {
  if (!servicesData?.hero) return;

  const heroContent = document.querySelector("#hero-content");
  if (!heroContent) return;

  const hero = servicesData.hero;
  heroContent.innerHTML = `
    <h1 class="display-4 text-white mb-4">${hero.title}</h1>
    <p class="lead text-white">${hero.subtitle}</p>
    <p class="text-white">${hero.description}</p>
  `;
}

// Update services content
function updateServicesContent() {
  if (!servicesData?.services) return;

  const servicesContainer = document.querySelector("#services-container .row");
  if (!servicesContainer) return;

  servicesContainer.innerHTML = "";

  servicesData.services.forEach((service, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 mb-4";
    col.setAttribute("data-aos", "fade-up");
    col.setAttribute("data-aos-delay", (index * 100).toString());

    col.innerHTML = `
      <div class="service-card h-100">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <div class="service-content">
          <h4>${service.title}</h4>
          <p>${service.description}</p>
          ${
            service.features
              ? `
            <ul class="service-features">
              ${service.features
                .map(
                  (feature) =>
                    `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`
                )
                .join("")}
            </ul>
          `
              : ""
          }
          ${
            service.contactInfo
              ? `
            <div class="service-contact">
              <small class="text-muted">${service.contactInfo}</small>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    servicesContainer.appendChild(col);
  });
}

// Update service statistics
function updateServiceStats() {
  if (!servicesData?.statistics) return;

  const statsContainer = document.querySelector("#service-stats .row");
  if (!statsContainer) return;

  statsContainer.innerHTML = "";

  servicesData.statistics.forEach((stat, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-6 mb-4";
    col.setAttribute("data-aos", "zoom-in");
    col.setAttribute("data-aos-delay", (index * 100).toString());

    col.innerHTML = `
      <div class="stat-card text-center">
        <div class="stat-icon">
          <i class="${stat.icon}"></i>
        </div>
        <div class="stat-number counter" data-target="${stat.value}">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `;

    statsContainer.appendChild(col);
  });

  // Initialize counters after adding to DOM
  setTimeout(initializeCounters, 100);
}

// Initialize counter animations
function initializeCounters() {
  if (typeof CountUp === "undefined") return;

  const counterElements = document.querySelectorAll(".counter");

  counterElements.forEach((element) => {
    const target = parseInt(element.getAttribute("data-target") || "0");
    const countUp = new CountUp(element, target, {
      duration: 2,
      separator: ",",
      suffix: element.getAttribute("data-suffix") || "",
    });

    // Start counting when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp.start();
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(element);
  });
}

// Refresh services data
function refreshServicesData() {
  console.log("Refreshing services data...");
  loadServicesData();
}

// Additional services page functions

// Get title from JSON
function getTitle() {
  if (servicesData) {
    return servicesData.services.title;
  }
  return "บริการต่างๆ";
}

// Get subtitle from JSON
function getSubtitle() {
  if (servicesData) {
    return servicesData.services.subtitle;
  }
  return "เรามีบริการต่างๆมากมาย";
}

// Update hero section with JSON data
function updateHeroSection() {
  const title = getTitle();
  const subtitle = getSubtitle();

  document.getElementById("hero-content").innerHTML = `
          <h1>${title}</h1>
          <p>${subtitle}</p>
      `;
}

// Update main services with JSON data
function updateMainServices() {
  if (!servicesData) return;

  const container = document.getElementById("main-services");
  container.innerHTML = "";

  servicesData.services.mainServices.forEach((service, index) => {
    container.innerHTML += `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${
        index * 100
      }">
        <div class="card h-100 hover-card">
          <img src="${service.image}" class="card-img-top" alt="${
      service.title
    }" 
               style="height: 200px; object-fit: cover" width="400" height="200"
               onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23cccccc%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22>400x200</text></svg>'">
          <div class="card-body">
            <h5 class="card-title">${service.title}</h5>
            <p class="card-text">${service.description}</p>
          </div>
        </div>
      </div>
    `;
  });
}

// Update activities with JSON data
function updateActivities() {
  if (!servicesData) return;

  const container = document.getElementById("activities");
  container.innerHTML = "";

  servicesData.services.activities.forEach((activity, index) => {
    container.innerHTML += `
      <div class="col-lg-3 col-md-6" data-aos="flip-up" data-aos-delay="${
        index * 150
      }">
        <div class="feature-card hover-card">
          <div class="feature-icon">
            <i class="${activity.icon}"></i>
          </div>
          <h5>${activity.title}</h5>
          <p>${activity.description}</p>
        </div>
      </div>
    `;
  });
}

// Update service info with JSON data
function updateServiceInfo() {
  if (!servicesData) return;

  const info = servicesData.services.serviceInfo;
  document.getElementById("service-info").innerHTML = `
          <h3 class="text-center mb-4">ข้อมูลการให้บริการ</h3>
          <div class="row">
              <div class="col-md-6">
                  <h5><i class="bi bi-clock text-primary me-2"></i>เวลาเปิด-ปิด</h5>
                  <p>${info.operatingHours}</p>
                  <h5><i class="bi bi-telephone text-primary me-2"></i>ติดต่อสอบถาม</h5>
                  <p>โทรศัพท์: ${info.phone}</p>
              </div>
              <div class="col-md-6">
                  <h5><i class="bi bi-car-front text-primary me-2"></i>ที่จอดรถ</h5>
                  <p>${info.parking}</p>
                  <h5><i class="bi bi-cup-straw text-primary me-2"></i>บริการอาหาร</h5>
                  <p>${info.restaurant}</p>
              </div>
          </div>
          <div class="row mt-3">
              <div class="col-12">
                  <h5><i class="bi bi-facebook text-primary me-2"></i>ติดตามเรา</h5>
                  <div class="social-links">
                      <a href="${info.socialMedia.facebook.account}" class="btn btn-outline-primary btn-sm me-2" target="_blank">
                          <i class="bi bi-facebook"></i> Facebook Account
                      </a>
                      <a href="${info.socialMedia.facebook.fanpage}" class="btn btn-outline-primary btn-sm" target="_blank">
                          <i class="bi bi-facebook"></i> Facebook Fanpage
                      </a>
                  </div>
              </div>
          </div>
          <hr class="my-4" />
          <div class="text-center">
              <h5 class="text-primary">หมายเหตุ</h5>
              <p class="mb-0">${info.note}</p>
          </div>
      `;
}

// Initialize interactive features
function initializeServicesInteractiveFeatures() {
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
      this.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    });
  });
}

// Load all data when page loads
document.addEventListener("DOMContentLoaded", async () => {
  await loadServicesData();

  if (servicesData) {
    updateHeroSection();
    updateMainServices();
    updateActivities();
    updateServiceInfo();
    initializeServicesInteractiveFeatures();
    console.log("Page updated with JSON data");
  }
});
