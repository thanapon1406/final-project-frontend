// Shared functions for all pages
let siteConfigData = null;
let footerData = null;

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

// Load site config and footer data
async function loadSharedData() {
  try {
    const [siteConfig, footer] = await Promise.all([
      loadJsonData("site-config"),
      loadJsonData("footer"),
    ]);

    siteConfigData = siteConfig;
    footerData = footer;

    // Update shared elements
    updateSiteConfig();
    updateNavigation();
    updateFooter();

    console.log("Shared data loaded successfully");
  } catch (error) {
    console.error("Error loading shared data:", error);
  }
}

// Update site config (title, favicon, etc.)
function updateSiteConfig() {
  if (!siteConfigData) return;

  const config = siteConfigData.site;

  // Update page title if it contains default text
  const currentTitle = document.title;
  if (
    currentTitle.includes("ห้วยตึงเฒ่า") &&
    !currentTitle.includes("Loading")
  ) {
    // Keep the page-specific part, update the site part
    const pagePart = currentTitle.split(" - ")[0];
    document.title = `${pagePart} - ${config.shortTitle}`;
  }

  // Update favicon
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon && config.favicon) {
    favicon.href = config.favicon;
  }
}

// Update navigation
function updateNavigation() {
  if (!siteConfigData) return;

  const nav = siteConfigData.navigation;

  // Update navbar brand
  const navbarBrand = document.querySelector(".navbar-brand");
  if (navbarBrand && nav.brand) {
    const logo = siteConfigData.site.logo;
    navbarBrand.innerHTML = `
      <img src="${logo.url}" alt="${logo.alt}" width="${logo.width}" height="${logo.height}" class="me-2"
           onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22${logo.width}%22 height=%22${logo.height}%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%232c3e50%22 rx=%225%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 fill=%22white%22 dy=%22.3em%22>LOGO</text></svg>'">
      <span class="d-none d-lg-inline">${nav.brand.text}</span>
      <span class="d-lg-none">${nav.brand.shortText}</span>
    `;
    navbarBrand.href = nav.brand.href;
  }

  // Update navigation menu
  const navMenu = document.querySelector(".navbar-nav");
  if (navMenu && nav.menu) {
    navMenu.innerHTML = "";

    // Get current page to set active state
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    nav.menu.forEach((item) => {
      const li = document.createElement("li");
      li.className = "nav-item";

      // Check if this menu item should be active
      let isActive = false;
      if (item.href === currentPage) {
        isActive = true;
      } else if (currentPage === "index.html" && item.id === "home") {
        isActive = true;
      } else if (currentPage === "page-contact.html" && item.id === "contact") {
        isActive = true;
      } else if (currentPage === "page-history.html" && item.id === "history") {
        isActive = true;
      } else if (
        currentPage === "page-services.html" &&
        item.id === "services"
      ) {
        isActive = true;
      }

      li.innerHTML = `
        <a class="nav-link ${isActive ? "active" : ""}" href="${item.href}">${
        item.text
      }</a>
      `;
      navMenu.appendChild(li);
    });
  }
}

// Update footer
function updateFooter() {
  if (!footerData) return;

  const footerMain = document.querySelector(".footer .col-lg-8");
  const footerSocial = document.getElementById("footer-social");

  if (footerMain && footerData.footer) {
    footerMain.innerHTML = `
      <h5>${footerData.footer.organization.name}</h5>
      <p>${footerData.footer.copyright.text}</p>
    `;
  }

  if (footerSocial && footerData.footer.socialMedia) {
    footerSocial.innerHTML = `
      <div class="social-links">
        <a href="${footerData.footer.socialMedia.facebook.account}" target="_blank">
          <i class="bi bi-facebook"></i>
        </a>
      </div>
    `;
  }
}

// Refresh shared data function
function refreshSharedData() {
  console.log("Refreshing shared data...");
  loadSharedData();
}

// Initialize shared data when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  loadSharedData();
});
