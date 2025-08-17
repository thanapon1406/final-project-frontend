// History Page JavaScript

let historyData = null;

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
      const localData = JSON.parse(savedData);
      console.log("Found localStorage data, checking if up to date...");

      // Check if localStorage data has the latest structure
      // Look for section 3 with 2 images (image7.jpg and image8.jpg)
      const section3 = localData.history?.sections?.find(s => s.id === 3);
      const hasLatestImages = section3?.images?.length === 2 &&
        section3.images.some(img => img.url.includes("image8.jpg"));

      if (hasLatestImages) {
        console.log("History data loaded from localStorage (up to date):", localData);
        return localData;
      } else {
        console.warn("localStorage data is outdated, loading from file");
        localStorage.removeItem(`json_${fileName}`); // Clear old data
      }
    } catch (e) {
      console.warn("Invalid saved data, loading from file");
      localStorage.removeItem(`json_${fileName}`); // Clear invalid data
    }
  }

  // Final fallback to direct file load
  const response = await fetch(`data/${fileName}.json`);
  return response.json();
}

// Load history data
async function loadHistoryData() {
  try {
    console.log("Starting to load history data...");
    historyData = await loadJsonData("page-history");
    console.log("History data loaded:", historyData);
    return historyData;
  } catch (error) {
    console.error("Error loading history data:", error);
    // Show error message to user
    const heroContent = document.getElementById("hero-content");
    if (heroContent) {
      heroContent.innerHTML = `
        <div class="alert alert-danger">
          <h4>เกิดข้อผิดพลาดในการโหลดข้อมูล</h4>
          <p>ไม่สามารถโหลดข้อมูลประวัติได้ กรุณาลองใหม่อีกครั้ง</p>
          <small>Error: ${error.message}</small>
          <div class="mt-3">
            <button class="btn btn-warning btn-sm" onclick="clearCacheAndReload()">
              <i class="bi bi-arrow-clockwise"></i> ล้างแคชและโหลดใหม่
            </button>
          </div>
        </div>
      `;
    }
    return null;
  }
}

// Update hero section
function updateHeroSection() {
  console.log("Updating hero section...");
  if (!historyData) {
    console.error("No history data available for hero section");
    return;
  }

  const history = historyData.history;
  document.getElementById("hero-content").innerHTML = `
    <h1>${history.title}</h1>
    <p>${history.subtitle}</p>
  `;
  console.log("Hero section updated");
}

// Update history content with animations
function updateHistoryContent() {
  if (!historyData) return;

  const container = document.getElementById("history-content");
  let content = "";

  historyData.history.sections.forEach((section, index) => {
    content += `
      <div class="history-section mb-5" data-aos="fade-up" data-aos-delay="${
        index * 200
      }">
        <div class="row align-items-start">
          <div class="col-12">
            <h3 class="section-title text-primary mb-4 gsap-title">${
              section.title
            }</h3>
          </div>
        </div>
        <div class="row">
          <div class="${section.images ? "col-lg-8" : "col-lg-12"}">
            <div class="content-text">
              ${section.content
                .map(
                  (paragraph, pIndex) =>
                    `<p class="mb-3 gsap-paragraph" data-delay="${
                      pIndex * 100
                    }">${paragraph}</p>`
                )
                .join("")}
            </div>
          </div>
          
          ${
            section.images
              ? `
          <div class="col-lg-4">
            <div class="images-container">
              ${section.images
                .map((image, imgIndex) =>
                  image.position !== "full"
                    ? `
                <div class="history-image mb-3 ${
                  image.position === "side" ? "text-center" : ""
                } image-hover" data-aos="zoom-in" data-aos-delay="${
                        index * 200 + imgIndex * 100 + 300
                      }">
                  <img src="${image.url}" 
                       alt="${image.alt}" 
                       class="img-fluid rounded shadow-sm clickable-image"
                       style="max-height: 200px; object-fit: cover; width: 100%; cursor: pointer; transition: transform 0.3s ease;"
                       onmouseover="this.style.transform='scale(1.05)'"
                       onmouseout="this.style.transform='scale(1)'">
                  ${
                    image.caption
                      ? `<small class="text-muted d-block mt-2">${image.caption}</small>`
                      : ""
                  }
                </div>
              `
                    : ""
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }
        </div>
        ${
          section.images &&
          section.images.some((img) => img.position === "half")
            ? `
          <div class="row mt-4">
            <div class="col-6">
              ${section.images
                .filter((img) => img.position === "half")
                .map(
                  (image) => `
                <div class="history-image-full text-center mb-3 image-hover" data-aos="fade-up">
                  <img src="${image.url}" 
                       alt="${image.alt}" 
                       class="img-fluid rounded shadow clickable-image"
                       style="cursor: pointer; transition: transform 0.3s ease;"
                       onmouseover="this.style.transform='scale(1.02)'"
                       onmouseout="this.style.transform='scale(1)'">
                  ${
                    image.caption
                      ? `<small class="text-muted d-block mt-2">${image.caption}</small>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        ${
          section.images &&
          section.images.some((img) => img.position === "full")
            ? `
          <div class="row mt-4">
            <div class="col-12">
              ${section.images
                .filter((img) => img.position === "full")
                .map(
                  (image) => `
                <div class="history-image-full text-center mb-3 image-hover" data-aos="fade-up">
                  <img src="${image.url}" 
                       alt="${image.alt}" 
                       class="img-fluid rounded shadow clickable-image"
                       style="cursor: pointer; transition: transform 0.3s ease;"
                       onmouseover="this.style.transform='scale(1.02)'"
                       onmouseout="this.style.transform='scale(1)'">
                  ${
                    image.caption
                      ? `<small class="text-muted d-block mt-2">${image.caption}</small>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          index < historyData.history.sections.length - 1
            ? '<hr class="my-5 animated-divider">'
            : ""
        }
      </div>
    `;
  });

  container.innerHTML = content;
  initializeImageLightbox();
}

// Update timeline with enhanced animations
function updateTimeline() {
  if (!historyData) return;

  const container = document.getElementById("timeline-content");
  container.innerHTML = "";

  // Create timeline with enhanced styling
  historyData.history.timeline.forEach((item, index) => {
    const isEven = index % 2 === 0;
    container.innerHTML += `
      <div class="timeline-item-wrapper mb-4" data-aos="${
        isEven ? "fade-right" : "fade-left"
      }" data-aos-delay="${index * 150}">
        <div class="card timeline-card shadow-lg hover-timeline-card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-3">
                <div class="timeline-year-badge">
                  <div class="year-circle">
                    <h4 class="text-white fw-bold mb-0">${item.year}</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-9">
                <h5 class="timeline-title mb-2 text-primary">${
                  item.title
                }</h5>
                <p class="timeline-description mb-0">${
                  item.description
                }</p>
                <div class="timeline-progress mt-3">
                  <div class="progress-bar-custom" style="width: ${
                    (index + 1) *
                    (100 / historyData.history.timeline.length)
                  }%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Add social media section after timeline
  if (historyData.history.socialMedia) {
    container.innerHTML += `
      <div class="card mt-5 social-card shadow-lg" data-aos="zoom-in" data-aos-delay="800">
        <div class="card-body text-center py-4">
          <div class="social-icon mb-3">
            <i class="bi bi-facebook text-primary" style="font-size: 3rem;"></i>
          </div>
          <h5 class="mb-3">ติดตามข่าวสารของเรา</h5>
          <p class="text-muted mb-4">ติดตามข้อมูลข่าวสารและกิจกรรมต่างๆ ของห้วยตึงเฒ่า</p>
          <div class="social-links">
            <a href="${historyData.history.socialMedia.facebook.account}" 
               class="btn btn-primary me-3 mb-2 btn-hover" target="_blank">
              <i class="bi bi-facebook me-2"></i>Facebook Account
            </a>
            <a href="${historyData.history.socialMedia.facebook.fanpage}" 
               class="btn btn-outline-primary mb-2 btn-hover" target="_blank">
              <i class="bi bi-facebook me-2"></i>Facebook Fanpage
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

// Clear cache and reload function
function clearCacheAndReload() {
  console.log("Clearing localStorage cache...");
  localStorage.removeItem("json_page-history");
  location.reload();
}

// Load all data when page loads
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded - starting initialization...");

  await loadHistoryData();

  if (historyData) {
    console.log("History data available, updating sections...");
    updateHeroSection();
    updateHistoryContent();
    updateTimeline();
    initializeInteractiveFeatures();
    console.log("History page updated with JSON data");

    // Add developer helper function to console
    window.clearHistoryCache = function () {
      localStorage.removeItem("json_page-history");
      console.log(
        "History cache cleared. Reload page to fetch fresh data."
      );
    };
    console.log(
      "💡 Developer tip: Run clearHistoryCache() to clear localStorage cache"
    );
  } else {
    console.error("Failed to load history data");
    document.getElementById("history-content").innerHTML =
      '<div class="alert alert-warning">ไม่สามารถโหลดข้อมูลได้</div>';
    document.getElementById("timeline-content").innerHTML =
      '<div class="alert alert-warning">ไม่สามารถโหลดข้อมูลได้</div>';
  }
});

// Initialize interactive features
function initializeInteractiveFeatures() {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

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

  // Add hover effects to timeline cards
  document.querySelectorAll(".hover-timeline-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      gsap.to(this, {
        duration: 0.3,
        y: -10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      });
    });

    card.addEventListener("mouseleave", function () {
      gsap.to(this, {
        duration: 0.3,
        y: 0,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      });
    });
  });

  // GSAP ScrollTrigger animations for text
  gsap.utils.toArray(".gsap-title").forEach((title) => {
    gsap.fromTo(
      title,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.utils.toArray(".gsap-paragraph").forEach((paragraph, index) => {
    gsap.fromTo(
      paragraph,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: paragraph.dataset.delay
          ? parseInt(paragraph.dataset.delay) / 1000
          : 0,
        scrollTrigger: {
          trigger: paragraph,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animated dividers
  gsap.utils.toArray(".animated-divider").forEach((divider) => {
    gsap.fromTo(
      divider,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        scrollTrigger: {
          trigger: divider,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
}

// Initialize image lightbox
function initializeImageLightbox() {
  document.querySelectorAll(".clickable-image").forEach((img) => {
    img.addEventListener("click", function () {
      const modal = document.createElement("div");
      modal.className = "image-modal";
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
      `;

      const modalImg = document.createElement("img");
      modalImg.src = this.src;
      modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        animation: zoomIn 0.3s ease;
      `;

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "×";
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      modal.appendChild(modalImg);
      modal.appendChild(closeBtn);
      document.body.appendChild(modal);

      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target === closeBtn) {
          modal.style.animation = "fadeOut 0.3s ease";
          setTimeout(() => {
            document.body.removeChild(modal);
          }, 300);
        }
      });
    });
  });
}
