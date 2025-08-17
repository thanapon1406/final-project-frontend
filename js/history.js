// History page specific functionality

let historyData = null;

// Load history page data
async function loadHistoryData() {
  try {
    historyData = await loadJsonData("page-history");

    if (historyData) {
      updateHistoryHero();
      updateTimelineContent();
      updateGalleryContent();
    }

    console.log("History data loaded successfully");
  } catch (error) {
    console.error("Error loading history data:", error);
  }
}

// Update hero section
function updateHistoryHero() {
  if (!historyData?.history) return;

  const heroContent = document.querySelector("#hero-content");
  if (!heroContent) return;

  const hero = historyData.history;
  heroContent.innerHTML = `
    <h1 class="display-4 text-white mb-4">${hero.title}</h1>
    <p class="lead text-white">${hero.subtitle}</p>
  `;
}

// Update timeline content
function updateTimelineContent() {
  if (!historyData?.history?.sections) return;

  const timelineContainer = document.querySelector("#timeline-container");
  if (!timelineContainer) return;

  timelineContainer.innerHTML = "";

  historyData.history.sections.forEach((section, index) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.setAttribute("data-aos", "fade-up");
    timelineItem.setAttribute("data-aos-delay", (index * 100).toString());

    timelineItem.innerHTML = `
      <div class="timeline-content">
        <h3>${section.title}</h3>
        <div class="timeline-text">
          ${section.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
        ${section.images ? `
          <div class="timeline-images">
            ${section.images.map(img => `
              <div class="timeline-image">
                <img src="${img.url}" alt="${img.alt}" class="img-fluid rounded" 
                     onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23cccccc%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22>400x250</text></svg>'">
                <p class="image-caption">${img.caption}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    timelineContainer.appendChild(timelineItem);
  });
}

    timelineItem.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-date">${item.year}</div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
        ${
          item.achievements
            ? `
          <ul class="timeline-achievements">
            ${item.achievements
              .map((achievement) => `<li>${achievement}</li>`)
              .join("")}
          </ul>
        `
            : ""
        }
      </div>
    `;

    timelineContainer.appendChild(timelineItem);
  });
}

// Update gallery content
function updateGalleryContent() {
  if (!historyData?.history?.galleryImages) return;

  const galleryContainer = document.querySelector("#history-gallery .row");
  if (!galleryContainer) return;

  galleryContainer.innerHTML = "";

  historyData.history.galleryImages.forEach((image, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 mb-4";
    col.setAttribute("data-aos", "zoom-in");
    col.setAttribute("data-aos-delay", (index * 100).toString());

    col.innerHTML = `
      <div class="gallery-item">
        <img src="${image.url}" alt="${image.alt}" class="img-fluid rounded shadow"
             onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23cccccc%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22>400x250</text></svg>'">
        <div class="gallery-overlay">
          <div class="gallery-info">
            <h5>${image.caption}</h5>
          </div>
        </div>
      </div>
    `;

    galleryContainer.appendChild(col);
  });
}

// Initialize GSAP animations for timeline
function initializeTimelineAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate timeline items
  gsap.utils.toArray(".timeline-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  console.log("Timeline animations initialized");
}

// Initialize image lightbox for gallery
function initializeImageLightbox() {
  document.addEventListener("click", function (e) {
    if (e.target.closest(".gallery-item img")) {
      const img = e.target;
      const modal = document.createElement("div");
      modal.className = "image-modal";
      modal.innerHTML = `
        <img src="${img.src}" alt="${img.alt}">
        <button class="modal-close">&times;</button>
      `;

      document.body.appendChild(modal);

      // Close modal on click
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.classList.contains("modal-close")) {
          document.body.removeChild(modal);
        }
      });
    }
  });
}

// Refresh history data
function refreshHistoryData() {
  console.log("Refreshing history data...");
  loadHistoryData();
}

// Initialize history page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing history page...");
  if (typeof showPreloader === "function") {
    showPreloader();
  }

  // Load JSON data
  loadHistoryData().finally(() => {
    // Initialize GSAP animations after data is loaded
    setTimeout(() => {
      if (typeof initializeTimelineAnimations === "function") {
        initializeTimelineAnimations();
      }
      if (typeof initializeImageLightbox === "function") {
        initializeImageLightbox();
      }
    }, 500);
    if (typeof hidePreloader === "function") {
      hidePreloader();
    }
  });
});
