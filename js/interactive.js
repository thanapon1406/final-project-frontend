// Interactive Features Library
// เฉพาะฟีเจอร์การโต้ตอบและ animations เท่านั้น

class InteractiveFeatures {
  constructor() {
    this.initialized = false;
    this.config = {
      aos: {
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 100,
      },
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: "#0066cc" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#0066cc",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
    };
  }

  // Initialize all interactive features
  init() {
    if (this.initialized) return;

    console.log("Initializing Interactive Features...");

    this.initAOS();
    this.initParticles();
    this.initTypedText();
    this.initCounters();
    this.initSmoothScrolling();
    this.initFloatingButton();
    this.initNavbarEffects();
    this.initHoverEffects();
    this.initImageLightbox();
    this.initPreloader();

    this.initialized = true;
    console.log("Interactive Features initialized successfully");
  }

  // Initialize AOS (Animate On Scroll)
  initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init(this.config.aos);
      console.log("AOS initialized");
    }
  }

  // Initialize Particles.js background
  initParticles() {
    const particlesContainer = document.getElementById("particles-js");
    if (particlesContainer && typeof particlesJS !== "undefined") {
      particlesJS("particles-js", {
        particles: this.config.particles,
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      });
      console.log("Particles.js initialized");
    }
  }

  // Initialize Typed.js for typing animations
  initTypedText() {
    const typedElement = document.querySelector(".typed-text");
    if (typedElement && typeof Typed !== "undefined") {
      new Typed(".typed-text", {
        strings: [
          "เข้าใจเรื่องราวของคุณ",
          "ฟังทุกปัญหาอย่างเข้าใจ",
          "ไร้คำตัดสิน",
          "ให้คำปรึกษาอย่างเป็นมิตร",
          "ที่ปรึกษาสำหรับทุกครอบครัว",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: "|",
      });
      console.log("Typed.js initialized");
    }
  }

  // Initialize CountUp.js for animated numbers
  initCounters() {
    const counterElements = document.querySelectorAll(
      ".counter, .stat-number[data-target]"
    );
    if (counterElements.length > 0 && typeof CountUp !== "undefined") {
      counterElements.forEach((element) => {
        const target = parseInt(
          element.getAttribute("data-target") || element.textContent || "0"
        );
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
      console.log(
        "CountUp.js initialized for",
        counterElements.length,
        "elements"
      );
    }
  }

  // Initialize smooth scrolling for navigation links
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
    console.log("Smooth scrolling initialized");
  }

  // Create and initialize floating action button
  initFloatingButton() {
    // Remove existing floating button if any
    const existingBtn = document.querySelector(".floating-action-btn");
    if (existingBtn) {
      existingBtn.remove();
    }

    const fab = document.createElement("div");
    fab.className = "floating-action-btn";
    fab.innerHTML = '<i class="fas fa-arrow-up"></i>';
    fab.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #0066cc, #004499);
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,102,204,0.3);
      transition: all 0.3s ease;
      z-index: 1000;
      border: none;
    `;

    fab.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    fab.addEventListener("mouseenter", () => {
      fab.style.transform = "scale(1.1)";
      fab.style.boxShadow = "0 6px 20px rgba(0,102,204,0.4)";
    });

    fab.addEventListener("mouseleave", () => {
      fab.style.transform = "scale(1)";
      fab.style.boxShadow = "0 4px 12px rgba(0,102,204,0.3)";
    });

    document.body.appendChild(fab);

    // Show/hide FAB based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        fab.style.display = "flex";
      } else {
        fab.style.display = "none";
      }
    });

    console.log("Floating action button initialized");
  }

  // Initialize navbar scroll effects
  initNavbarEffects() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    });

    console.log("Navbar scroll effects initialized");
  }

  // Initialize hover effects for cards and elements
  initHoverEffects() {
    // Feature cards hover effects
    const featureCards = document.querySelectorAll(
      ".feature-card, .service-card, .contact-card"
    );
    featureCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px)";
        this.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        this.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
      });
    });

    // Gallery items hover effects
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item) => {
      const img = item.querySelector("img");
      if (img) {
        item.addEventListener("mouseenter", function () {
          img.style.transform = "scale(1.05)";
          img.style.transition = "transform 0.3s ease";
        });

        item.addEventListener("mouseleave", function () {
          img.style.transform = "scale(1)";
        });
      }
    });

    console.log("Hover effects initialized");
  }

  // Initialize image lightbox for gallery
  initImageLightbox() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".gallery-item img")) {
        const img = e.target;
        this.createImageModal(img);
      }
    });

    console.log("Image lightbox initialized");
  }

  // Create image modal
  createImageModal(img) {
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
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      animation: zoomIn 0.3s ease;
    `;

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 30px;
      background: none;
      border: none;
      color: white;
      font-size: 40px;
      cursor: pointer;
      z-index: 10001;
    `;

    modal.appendChild(modalImg);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    // Close modal events
    const closeModal = () => {
      modal.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    };

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    closeBtn.addEventListener("click", closeModal);

    // Close on escape key
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  // Initialize preloader
  initPreloader() {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      // Hide preloader after page load
      window.addEventListener("load", () => {
        setTimeout(() => {
          preloader.style.opacity = "0";
          preloader.style.visibility = "hidden";
          setTimeout(() => {
            preloader.style.display = "none";
          }, 500);
        }, 500);
      });
    }
  }

  // Utility method to refresh/reinitialize features after dynamic content load
  refresh() {
    console.log("Refreshing interactive features...");
    this.initHoverEffects();
    this.initCounters();
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }

  // Utility method to show preloader
  showPreloader() {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.style.display = "flex";
      preloader.style.opacity = "1";
      preloader.style.visibility = "visible";
    }
  }

  // Utility method to hide preloader
  hidePreloader() {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }
  }
}

// Add CSS animations if not already present
if (!document.querySelector("#interactive-animations-css")) {
  const style = document.createElement("style");
  style.id = "interactive-animations-css";
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes zoomIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    .preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    
    .navbar-scrolled {
      background-color: rgba(0, 102, 204, 0.95) !important;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .floating-action-btn:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
}

// Create global instance
window.InteractiveFeatures = new InteractiveFeatures();

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => window.InteractiveFeatures.init(), 100);
  });
} else {
  setTimeout(() => window.InteractiveFeatures.init(), 100);
}

// Global utility functions for convenience
window.showPreloader = () => window.InteractiveFeatures.showPreloader();
window.hidePreloader = () => window.InteractiveFeatures.hidePreloader();
window.refreshInteractive = () => window.InteractiveFeatures.refresh();
