// Simple Main JavaScript for Huay Tueng Thao Website
console.log('Loading main-simple.js...');

$(document).ready(function() {
    console.log('Document ready - initializing website...');
    
    // Initialize error handling first
    if (typeof errorHandler !== 'undefined') {
        console.log('Error handler found, fixing undefined variables...');
        errorHandler.fixUndefinedVariables();
    } else {
        console.warn('Error handler not found');
    }
    
    // Initialize the website with error handling
    try {
        initializeWebsite();
        console.log('Website initialized successfully');
    } catch (error) {
        console.error('Failed to initialize website:', error);
        // Provide fallback initialization
        initializeFallbackWebsite();
    }
});

// Initialize all website components
function initializeWebsite() {
    console.log('Starting website initialization...');
    
    loadNavigation();
    loadCarousel();
    loadNewsMarquee();
    loadFooter();
    
    // Load page-specific content based on current page
    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);
    loadPageContent(currentPage);
    
    // Initialize basic interactive elements
    initializeBasicInteractiveElements();
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'index.html' || page === '') {
        return 'homepage';
    } else if (page === 'page-history.html') {
        return 'history';
    } else if (page === 'page-contact.html') {
        return 'contact';
    } else if (page === 'page-services.html') {
        return 'services';
    } else if (page === 'page-news.html') {
        return 'news';
    }
    return 'homepage';
}

// Load navigation from JSON with enhanced error handling
function loadNavigation() {
    console.log('Loading navigation...');
    
    $.getJSON('data/navigation.json')
        .done(function(data) {
            console.log('Navigation data loaded:', data);
            // Validate data structure
            if (data && typeof data === 'object') {
                renderNavigation(data);
            } else {
                console.warn('Invalid navigation data structure, using fallback');
                renderFallbackNavigation();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to load navigation data:', textStatus, errorThrown);
            renderFallbackNavigation();
        });
}

// Render navigation HTML
function renderNavigation(data) {
    console.log('Rendering navigation...');
    
    const currentPage = getCurrentPage();
    const navHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #2c3e50, #34495e);">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">
                    <i class="fas fa-leaf"></i> ${data.brandName || 'ห้วยตึงเฒ่า'}
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        ${data.menuItems ? data.menuItems.map(item => {
                            const isActive = (currentPage === 'homepage' && item.id === 'home') ||
                                           (currentPage === 'history' && item.id === 'history') ||
                                           (currentPage === 'contact' && item.id === 'contact') ||
                                           (currentPage === 'services' && item.id === 'service') ||
                                           (currentPage === 'news' && item.id === 'news');
                            return `
                                <li class="nav-item">
                                    <a class="nav-link ${isActive ? 'active' : ''}" href="${item.url}">
                                        ${item.title}
                                    </a>
                                </li>
                            `;
                        }).join('') : ''}
                    </ul>
                </div>
            </div>
        </nav>
    `;
    $('#navigation').html(navHTML);
    console.log('Navigation rendered successfully');
}

// Fallback navigation if JSON fails to load
function renderFallbackNavigation() {
    console.log('Rendering fallback navigation...');
    
    const fallbackHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #2c3e50, #34495e);">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">
                    <i class="fas fa-leaf"></i> ห้วยตึงเฒ่า
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="index.html">หน้าหลัก</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-history.html">ประวัติ</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-services.html">บริการ</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-news.html">ข่าวสาร</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-contact.html">ติดต่อเรา</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    $('#navigation').html(fallbackHTML);
}

// Load carousel from JSON
function loadCarousel() {
    console.log('Loading carousel...');
    
    $.getJSON('data/homepage-carousel.json')
        .done(function(data) {
            console.log('Carousel data loaded:', data);
            renderCarousel(data);
        })
        .fail(function() {
            console.error('Failed to load carousel data');
            renderEmptyCarousel();
        });
}

// Render carousel HTML with enhanced image handling
function renderCarousel(data) {
    console.log('Rendering carousel...');
    
    if (!data || !data.slides || data.slides.length === 0) {
        renderEmptyCarousel();
        return;
    }
    
    // Ensure controls object exists
    const controls = data.controls || {};
    
    const carouselHTML = `
        <div class="container-fluid px-0">
            <div id="mainCarousel" class="carousel slide" data-bs-ride="carousel" 
                 data-bs-interval="${controls.interval || 5000}">
                <div class="carousel-indicators">
                    ${data.slides.map((slide, index) => `
                        <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="${index}" 
                                ${index === 0 ? 'class="active"' : ''} aria-label="Slide ${index + 1}"></button>
                    `).join('')}
                </div>
                <div class="carousel-inner">
                    ${data.slides.map((slide, index) => {
                        // Generate fallback image if no image provided
                        const imageSrc = slide.image || slide.backgroundImage || 
                            'data:image/svg+xml;base64,' + btoa(`
                                <svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100%" height="100%" fill="#4a90e2"/>
                                    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48">
                                        ${slide.title || 'สไลด์'}
                                    </text>
                                </svg>
                            `);
                        
                        return `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}" data-slide-id="${slide.id || index}">
                                <img src="${imageSrc}" 
                                     class="d-block w-100 carousel-image" 
                                     alt="${slide.title || 'สไลด์ที่ ' + (index + 1)}" 
                                     loading="${index === 0 ? 'eager' : 'lazy'}"
                                     style="height: 500px; object-fit: cover;"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="carousel-fallback" style="display:none; height:500px; background:linear-gradient(135deg, #4a90e2, #357abd); align-items:center; justify-content:center; color:white;">
                                    <div class="text-center">
                                        <i class="fas fa-image fa-4x mb-3"></i>
                                        <h3>${slide.title || 'สไลด์'}</h3>
                                    </div>
                                </div>
                                <div class="carousel-caption">
                                    <h5>${slide.title || ''}</h5>
                                    <p>${slide.description || ''}</p>
                                    ${(slide.link && slide.link.url) ? `
                                        <a href="${slide.link.url}" target="${slide.link.target || '_self'}" 
                                           class="btn btn-primary mt-2">
                                            <i class="fas fa-external-link-alt"></i> เรียนรู้เพิ่มเติม
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${controls.prevButton !== false ? `
                    <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                ` : ''}
                ${controls.nextButton !== false ? `
                    <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    $('#carousel-container').html(carouselHTML);
    console.log('Carousel rendered successfully');
}

// Render empty carousel fallback
function renderEmptyCarousel() {
    console.log('Rendering empty carousel...');
    
    const emptyCarouselHTML = `
        <div class="container-fluid px-0">
            <div class="carousel-empty" style="height: 400px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); display: flex; align-items: center; justify-content: center;">
                <div class="text-center text-muted">
                    <i class="fas fa-images fa-4x mb-3"></i>
                    <h4>ไม่มีสไลด์แสดง</h4>
                    <p>กรุณาเพิ่มสไลด์ผ่านระบบจัดการเนื้อหา</p>
                </div>
            </div>
        </div>
    `;
    $('#carousel-container').html(emptyCarouselHTML);
}

// Load news marquee
function loadNewsMarquee() {
    console.log('Loading news marquee...');
    
    $.getJSON('data/homepage-news.json')
        .done(function(data) {
            console.log('News marquee data loaded:', data);
            renderNewsMarquee(data);
        })
        .fail(function() {
            console.error('Failed to load news marquee data');
        });
}

// Render news marquee
function renderNewsMarquee(data) {
    if (!data || !data.announcements || data.announcements.length === 0) {
        console.log('No announcements to display');
        return;
    }
    
    const activeAnnouncements = data.announcements.filter(announcement => announcement.active);
    if (activeAnnouncements.length === 0) {
        console.log('No active announcements');
        return;
    }
    
    const marqueeHTML = `
        <div class="news-marquee" style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 10px 0; overflow: hidden;">
            <div class="container-fluid">
                <div class="marquee-content" style="white-space: nowrap; animation: marquee 30s linear infinite;">
                    <i class="fas fa-bullhorn"></i> 
                    ${activeAnnouncements.map(announcement => announcement.text).join(' • ')}
                </div>
            </div>
        </div>
        <style>
            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
        </style>
    `;
    $('#news-marquee').html(marqueeHTML);
    console.log('News marquee rendered successfully');
}

// Load footer
function loadFooter() {
    console.log('Loading footer...');
    
    $.getJSON('data/footer.json')
        .done(function(data) {
            console.log('Footer data loaded:', data);
            renderFooter(data);
        })
        .fail(function() {
            console.error('Failed to load footer data');
            renderFallbackFooter();
        });
}

// Render footer
function renderFooter(data) {
    const footerHTML = `
        <div style="background: #2c3e50; color: white; padding: 2rem 0; margin-top: 3rem;">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <p>&copy; ${new Date().getFullYear()} ${data.copyright || 'ห้วยตึงเฒ่า'}</p>
                    </div>
                    <div class="col-md-6 text-end">
                        <p>ผู้เข้าชม: ${data.visitorCount || '0'} คน</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#footer').html(footerHTML);
    console.log('Footer rendered successfully');
}

// Fallback footer
function renderFallbackFooter() {
    const footerHTML = `
        <div style="background: #2c3e50; color: white; padding: 2rem 0; margin-top: 3rem;">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <p>&copy; ${new Date().getFullYear()} ห้วยตึงเฒ่า</p>
                    </div>
                    <div class="col-md-6 text-end">
                        <p>ผู้เข้าชม: 0 คน</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#footer').html(footerHTML);
}

// Load page-specific content
function loadPageContent(page) {
    console.log('Loading page content for:', page);
    
    switch(page) {
        case 'homepage':
            loadHomepageContent();
            break;
        case 'history':
            loadHistoryContent();
            break;
        case 'contact':
            loadContactContent();
            break;
        case 'services':
            loadServicesContent();
            break;
        case 'news':
            loadNewsContent();
            break;
    }
}

// Load homepage content
function loadHomepageContent() {
    console.log('Loading homepage content...');
    
    loadHomepageServices();
    loadHomepageFeatured();
    loadHomepageGallery();
    loadHomepageUpdates();
}

// Load homepage services
function loadHomepageServices() {
    $.getJSON('data/homepage-services.json')
        .done(function(data) {
            console.log('Homepage services loaded:', data);
            renderHomepageServices(data);
        })
        .fail(function() {
            console.error('Failed to load homepage services data');
            renderFallbackServices();
        });
}

// Render homepage services
function renderHomepageServices(data) {
    if (!data || !data.services || data.services.length === 0) {
        renderFallbackServices();
        return;
    }
    
    const servicesHTML = `
        <section class="services-section py-5">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="section-title">${data.section?.title || 'บริการของเรา'}</h2>
                        <p class="section-subtitle">${data.section?.subtitle || 'บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า'}</p>
                    </div>
                </div>
                <div class="row">
                    ${data.services.slice(0, 6).map(service => `
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none;">
                                <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                    <i class="${service.icon || 'fas fa-cog'}"></i>
                                </div>
                                <h4>${service.title || 'บริการ'}</h4>
                                <p>${service.description || 'คำอธิบายบริการ'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
    
    $('#services-section').html(servicesHTML);
    console.log('Homepage services rendered successfully');
}

// Render fallback services
function renderFallbackServices() {
    const fallbackServicesHTML = `
        <section class="services-section py-5">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="section-title">บริการของเรา</h2>
                        <p class="section-subtitle">บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-swimming-pool"></i>
                            </div>
                            <h4>กิจกรรมน้ำ</h4>
                            <p>เล่นน้ำและกิจกรรมริมอ่างเก็บน้ำ</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-campground"></i>
                            </div>
                            <h4>แคมป์ปิ้ง</h4>
                            <p>พื้นที่กางเต็นท์และพักค้างคืน</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <h4>ร้านอาหาร</h4>
                            <p>อาหารท้องถิ่นและเครื่องดื่ม</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#services-section').html(fallbackServicesHTML);
}

// Simplified functions for other content
function loadHomepageFeatured() {
    console.log('Loading homepage featured content...');
    $('#featured-content').html('<div class="py-5 text-center"><h3>เนื้อหาเด่น</h3><p>กำลังโหลด...</p></div>');
}

function loadHomepageGallery() {
    console.log('Loading homepage gallery...');
    $('#gallery-section').html('<div class="py-5 text-center"><h3>ประมวลภาพ</h3><p>กำลังโหลด...</p></div>');
}

function loadHomepageUpdates() {
    console.log('Loading homepage updates...');
    $('#news-updates').html('<div class="py-5 text-center"><h3>ข่าวสารและอัปเดต</h3><p>กำลังโหลด...</p></div>');
}

function loadHistoryContent() {
    console.log('Loading history content...');
    $('#history-content').html('<div class="py-5 text-center"><h3>ประวัติห้วยตึงเฒ่า</h3><p>กำลังโหลด...</p></div>');
}

function loadContactContent() {
    console.log('Loading contact content...');
    $('#contact-content').html('<div class="py-5 text-center"><h3>ติดต่อเรา</h3><p>กำลังโหลด...</p></div>');
}

function loadServicesContent() {
    console.log('Loading services content...');
    $('#services-content').html('<div class="py-5 text-center"><h3>บริการของเรา</h3><p>กำลังโหลด...</p></div>');
}

function loadNewsContent() {
    console.log('Loading news content...');
    $('#news-content').html('<div class="py-5 text-center"><h3>ข่าวสาร</h3><p>กำลังโหลด...</p></div>');
}

// Initialize basic interactive elements
function initializeBasicInteractiveElements() {
    console.log('Initializing basic interactive elements...');
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Fallback initialization when main initialization fails
function initializeFallbackWebsite() {
    console.log('Initializing fallback website...');
    
    // Basic navigation fallback
    renderFallbackNavigation();
    
    // Basic carousel fallback
    renderEmptyCarousel();
    
    // Basic footer fallback
    renderFallbackFooter();
    
    // Show error message to user
    showUserErrorMessage();
}

// Show user-friendly error message
function showUserErrorMessage() {
    const errorMessageHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert" style="margin: 20px;">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>การแจ้งเตือน:</strong> เว็บไซต์กำลังโหลดในโหมดพื้นฐาน เนื่องจากมีปัญหาในการโหลดข้อมูลบางส่วน
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Insert after navigation or at top of main content
    const insertTarget = document.querySelector('#navigation') || document.querySelector('main') || document.body;
    if (insertTarget) {
        insertTarget.insertAdjacentHTML('afterend', errorMessageHTML);
    }
}

console.log('Main-simple.js loaded successfully');