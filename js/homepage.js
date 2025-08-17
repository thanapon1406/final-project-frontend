// Homepage specific functionality

// Global variables for homepage data
let carouselData = null;
let newsData = null;
let featuredData = null;
let galleryData = null;
let servicesData = null;
let aboutData = null;

// Utility functions
function createPlaceholderImage(width, height, text = `${width}x${height}`) {
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#cccccc"/><text x="50%" y="50%" font-size="24" text-anchor="middle" fill="#666" dy=".3em">${text}</text></svg>`;
}

function addImageErrorHandler(img, width, height) {
  img.onerror = function () {
    this.onerror = null;
    this.src = createPlaceholderImage(width, height);
  };
}

// Load homepage-specific JSON data
async function loadHomepageData() {
  try {
    const [carousel, news, featured, gallery, services, about] =
      await Promise.all([
        loadJsonData("homepage-carousel"),
        loadJsonData("homepage-news"),
        loadJsonData("homepage-featured"),
        loadJsonData("homepage-gallery"),
        loadJsonData("homepage-services"),
        loadJsonData("about-content"),
      ]);

    carouselData = carousel;
    newsData = news;
    featuredData = featured;
    galleryData = gallery;
    servicesData = services;
    aboutData = about;

    // Update page content
    updateCarousel();
    updateNews();
    updateFeatured();
    updateGallery();
    updateServices();
    updateAbout();

    console.log("Homepage data loaded successfully");
  } catch (error) {
    console.error("Error loading homepage data:", error);
  }
}

// Update carousel
function updateCarousel() {
  if (!carouselData?.slides) return;

  const carouselInner = document.querySelector("#carouselMain .carousel-inner");
  const carouselIndicators = document.querySelector(
    "#carouselMain .carousel-indicators"
  );

  if (!carouselInner || !carouselIndicators) return;

  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";

  const activeSlides = carouselData.slides.filter((slide) => slide.active);

  activeSlides.forEach((slide, index) => {
    // Create indicator
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#carouselMain");
    indicator.setAttribute("data-bs-slide-to", index);
    if (index === 0) indicator.classList.add("active");
    carouselIndicators.appendChild(indicator);

    // Create slide
    const slideDiv = document.createElement("div");
    slideDiv.className = `carousel-item ${index === 0 ? "active" : ""}`;

    const img = document.createElement("img");
    img.src = slide.image || createPlaceholderImage(1200, 600);
    img.className = "d-block w-100";
    img.alt = slide.title;
    img.width = 1200;
    img.height = 600;
    addImageErrorHandler(img, 1200, 600);

    const caption = document.createElement("div");
    caption.className = "carousel-caption";
    caption.innerHTML = `
      <h3>${slide.title}</h3>
      <p>${slide.description}</p>
    `;

    slideDiv.appendChild(img);
    slideDiv.appendChild(caption);
    carouselInner.appendChild(slideDiv);
  });
}

// Update news section
function updateNews() {
  if (!newsData) return;

  // Update marquee
  const marquee = document.querySelector(".news-marquee marquee");
  if (marquee && newsData.announcements) {
    const activeAnnouncements = newsData.announcements.filter((a) => a.active);
    if (activeAnnouncements.length > 0) {
      marquee.innerHTML = activeAnnouncements
        .map((a) => `<strong>ประกาศ:</strong> ${a.text}`)
        .join(" &nbsp;&nbsp;&nbsp;&nbsp; ");
    }
  }

  // Update news table
  const newsTable = document.querySelector("#news tbody");
  if (newsTable && newsData.newsTable) {
    newsTable.innerHTML = "";
    newsData.newsTable.forEach((news) => {
      const row = newsTable.insertRow();
      row.innerHTML = `
        <td><strong>${news.date}</strong></td>
        <td>${news.content}</td>
      `;
    });
  }
}

// Update featured content
function updateFeatured() {
  if (!featuredData?.heroSection) return;

  const heroContent = document.querySelector(".hero-content");
  const heroImage = document.querySelector(".hero-image .image-container");
  const hero = featuredData.heroSection;

  if (heroContent) {
    let buttonsHtml = "";
    if (hero.buttons) {
      buttonsHtml = `
        <div class="hero-buttons">
          ${hero.buttons
            .map(
              (btn) => `
              <a href="${btn.href}" class="${btn.class}">
                <i class="${btn.icon} me-2"></i>${btn.text}
              </a>
            `
            )
            .join("")}
        </div>
      `;
    }

    heroContent.innerHTML = `
      <h1>
        ${hero.title}<br />
        <small class="text-muted">${hero.subtitle}</small>
      </h1>
      <p>${hero.description}</p>
      ${buttonsHtml}
    `;
  }

  if (heroImage && hero.image) {
    const img = document.createElement("img");
    img.src = hero.image;
    img.alt = "พ่อแม่ลูกคิงคอง";
    img.className = "img-fluid";
    img.width = 800;
    img.height = 600;
    addImageErrorHandler(img, 800, 600);

    const overlay = document.createElement("div");
    overlay.className = "image-overlay";
    overlay.innerHTML = `
      <div class="image-overlay-text">
        <i class="${hero.overlay?.icon || "fas fa-heart"}"></i>
        <h5>${hero.overlay?.title || ""}</h5>
        <p>${hero.overlay?.description || ""}</p>
      </div>
    `;

    heroImage.innerHTML = "";
    heroImage.appendChild(img);
    heroImage.appendChild(overlay);
  }
}

// Update gallery
function updateGallery() {
  if (!galleryData?.gallery) return;

  const galleryTitle = document.querySelector("#gallery .section-title");
  const gallerySubtitle = document.querySelector("#gallery .section-subtitle");

  if (galleryTitle) galleryTitle.textContent = galleryData.gallery.title;
  if (gallerySubtitle)
    gallerySubtitle.textContent = galleryData.gallery.subtitle;

  const galleryContainer = document.querySelector("#gallery .row.g-3");
  if (!galleryContainer) return;

  galleryContainer.innerHTML = "";
  galleryData.gallery.images.forEach((image, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";
    col.setAttribute("data-aos", "zoom-in");
    col.setAttribute("data-aos-delay", (index * 100).toString());

    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.className = "img-fluid";
    img.width = 400;
    img.height = 250;
    img.style.cssText = "cursor: pointer; transition: transform 0.3s ease;";
    addImageErrorHandler(img, 400, 250);

    galleryItem.appendChild(img);
    col.appendChild(galleryItem);
    galleryContainer.appendChild(col);
  });
}

// Update services
function updateServices() {
  if (!servicesData?.services) return;

  const servicesContainer = document.querySelector("#services .row.g-4");
  if (!servicesContainer) return;

  servicesContainer.innerHTML = "";
  servicesData.services.forEach((service, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";
    col.setAttribute("data-aos", "fade-up");
    col.setAttribute("data-aos-delay", (index * 100).toString());

    col.innerHTML = `
      <div class="feature-card">
        <div class="feature-icon">
          <span class="${service.icon}"></span>
        </div>
        <h4>${service.title}</h4>
        <p>${service.description}</p>
      </div>
    `;
    servicesContainer.appendChild(col);
  });

  // Re-apply hover effects to new cards
  initializeCardHoverEffects();
}

// Update about section
function updateAbout() {
  if (!aboutData?.about) return;

  const aboutContent = document.querySelector("#about-content");
  if (!aboutContent) return;

  aboutContent.innerHTML = "";
  aboutData.about.sections.forEach((section) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "about-section mb-4";
    
    const title = document.createElement("h5");
    title.className = "text-primary mb-2";
    title.textContent = section.title;
    sectionDiv.appendChild(title);
    
    section.content.forEach((paragraph) => {
      const p = document.createElement("p");
      p.className = "text-muted";
      p.textContent = paragraph;
      sectionDiv.appendChild(p);
    });
    
    aboutContent.appendChild(sectionDiv);
  });
}

// Refresh data function
function refreshData() {
  console.log("Refreshing homepage data...");
  loadHomepageData();
}

// Initialize all interactive features
function initializeInteractiveFeatures() {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });

  // Initialize particles.js background
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.3 },
        size: { value: 3 },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          out_mode: "out",
        },
      },
    });
  }

  // Initialize typing animation
  const typedTitle = document.getElementById("typed-title");
  if (typedTitle && typeof Typed !== "undefined") {
    new Typed("#typed-title", {
      strings: [
        "ยินดีต้อนรับสู่ห้วยตึงเฒ่า",
        "โครงการอันเนื่องมาจากพระราชดำริ",
        "พัฒนาชุมชนอย่างยั่งยืน",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
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

  // Initialize counter animations
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-count"));
        if (typeof CountUp !== "undefined") {
          const countUp = new CountUp(counter, target, {
            duration: 2,
            useEasing: true,
            separator: ",",
          });
          countUp.start();
        }
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  // Observe all counter elements
  document.querySelectorAll(".stat-number").forEach((counter) => {
    observer.observe(counter);
  });

  // Add hover effects to service cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Add interactive gallery with lightbox effect
  document.addEventListener("click", function (e) {
    if (e.target.closest(".gallery-item img")) {
      const img = e.target;
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
      `;

      const modalImg = document.createElement("img");
      modalImg.src = img.src;
      modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      `;

      modal.appendChild(modalImg);
      document.body.appendChild(modal);

      modal.addEventListener("click", function () {
        document.body.removeChild(modal);
      });
    }
  });

  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add loading animation for tables
  const tables = document.querySelectorAll("table tbody");
  tables.forEach((tbody) => {
    if (tbody.children.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="2" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">กำลังโหลด...</span>
            </div>
          </td>
        </tr>
      `;
    }
  });
}

// Initialize homepage when DOM loads
document.addEventListener("DOMContentLoaded", function () {
  loadHomepageData();
  initializeInteractiveFeatures();
});
