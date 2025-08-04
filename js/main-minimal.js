// Minimal Main JavaScript - No Errors Version
console.log('🚀 Loading minimal main.js...');

// Global error prevention
window.safeGet = function (obj, path, defaultValue = null) {
    try {
        return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
    } catch {
        return defaultValue;
    }
};

// Wait for DOM and jQuery
$(document).ready(function () {
    console.log('✅ Document ready - starting initialization...');

    try {
        initializeWebsiteMinimal();
        console.log('✅ Website initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showEmergencyFallback();
    }
});

// Main initialization function
function initializeWebsiteMinimal() {
    console.log('🔧 Initializing website components...');

    // Load components in order
    loadNavigationSafe();
    loadCarouselSafe();
    loadNewsMarqueeSafe();
    loadFooterSafe();

    // Load page content
    const currentPage = getCurrentPageSafe();
    console.log('📄 Current page:', currentPage);

    if (currentPage === 'homepage') {
        loadHomepageContentSafe();
    }
}

// Safe page detection
function getCurrentPageSafe() {
    try {
        const path = window.location.pathname || '';
        const page = path.split('/').pop() || '';

        if (page === 'index.html' || page === '') return 'homepage';
        if (page === 'page-history.html') return 'history';
        if (page === 'page-contact.html') return 'contact';
        if (page === 'page-services.html') return 'services';
        if (page === 'page-news.html') return 'news';

        return 'homepage';
    } catch (error) {
        console.warn('Error detecting page:', error);
        return 'homepage';
    }
}

// Safe navigation loading
function loadNavigationSafe() {
    console.log('🧭 Loading navigation...');

    $.getJSON('data/navigation.json')
        .done(function (data) {
            console.log('✅ Navigation data loaded');
            renderNavigationSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ Navigation load failed:', status, error);
            renderFallbackNavigationSafe();
        });
}

// Safe navigation rendering
function renderNavigationSafe(data) {
    try {
        const brandName = safeGet(data, 'brandName', 'ห้วยตึงเฒ่า');
        const menuItems = safeGet(data, 'menuItems', []);
        const currentPage = getCurrentPageSafe();

        let menuHTML = '';
        if (Array.isArray(menuItems)) {
            menuHTML = menuItems.map(item => {
                const isActive = (currentPage === 'homepage' && item.id === 'home') ||
                    (currentPage === 'history' && item.id === 'history') ||
                    (currentPage === 'contact' && item.id === 'contact') ||
                    (currentPage === 'services' && item.id === 'service') ||
                    (currentPage === 'news' && item.id === 'news');

                return `
                    <li class="nav-item">
                        <a class="nav-link ${isActive ? 'active' : ''}" href="${item.url || '#'}">
                            ${item.title || 'Menu'}
                        </a>
                    </li>
                `;
            }).join('');
        }

        const navHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #2c3e50, #34495e); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div class="container-fluid">
                    <a class="navbar-brand" href="index.html" style="font-weight: 600; color: white;">
                        <i class="fas fa-leaf"></i> ${brandName}
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            ${menuHTML}
                        </ul>
                    </div>
                </div>
            </nav>
            <style>
                .navbar-nav .nav-link {
                    color: rgba(255, 255, 255, 0.9) !important;
                    font-weight: 500;
                    padding: 0.5rem 1rem !important;
                    transition: all 0.3s ease;
                }
                .navbar-nav .nav-link:hover,
                .navbar-nav .nav-link.active {
                    color: #3498db !important;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
            </style>
        `;

        $('#navigation').html(navHTML);
        console.log('✅ Navigation rendered successfully');

    } catch (error) {
        console.error('❌ Navigation render error:', error);
        renderFallbackNavigationSafe();
    }
}

// Fallback navigation
function renderFallbackNavigationSafe() {
    console.log('🔄 Rendering fallback navigation...');

    const fallbackHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #2c3e50, #34495e);">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html" style="color: white;">
                    <i class="fas fa-leaf"></i> ห้วยตึงเฒ่า
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="index.html" style="color: rgba(255,255,255,0.9);">หน้าหลัก</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-history.html" style="color: rgba(255,255,255,0.9);">ประวัติ</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-services.html" style="color: rgba(255,255,255,0.9);">บริการ</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-news.html" style="color: rgba(255,255,255,0.9);">ข่าวสาร</a></li>
                        <li class="nav-item"><a class="nav-link" href="page-contact.html" style="color: rgba(255,255,255,0.9);">ติดต่อเรา</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;

    $('#navigation').html(fallbackHTML);
}

// Safe carousel loading
function loadCarouselSafe() {
    console.log('🎠 Loading carousel...');

    $.getJSON('data/homepage-carousel.json')
        .done(function (data) {
            console.log('✅ Carousel data loaded');
            renderCarouselSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ Carousel load failed:', status, error);
            renderEmptyCarouselSafe();
        });
}

// Safe carousel rendering
function renderCarouselSafe(data) {
    try {
        const slides = safeGet(data, 'slides', []);
        const controls = safeGet(data, 'controls', {});

        if (!Array.isArray(slides) || slides.length === 0) {
            renderEmptyCarouselSafe();
            return;
        }

        let slidesHTML = '';
        let indicatorsHTML = '';

        slides.forEach((slide, index) => {
            const title = slide.title || `สไลด์ที่ ${index + 1}`;
            const description = slide.description || '';
            const imageSrc = slide.image || slide.backgroundImage || generatePlaceholderSVG(title);

            indicatorsHTML += `
                <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="${index}" 
                        ${index === 0 ? 'class="active"' : ''} aria-label="Slide ${index + 1}"></button>
            `;

            slidesHTML += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${imageSrc}" 
                         class="d-block w-100" 
                         alt="${title}" 
                         style="height: 500px; object-fit: cover;"
                         onerror="this.src='${generatePlaceholderSVG(title)}';">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${title}</h5>
                        <p>${description}</p>
                    </div>
                </div>
            `;
        });

        const carouselHTML = `
            <div class="container-fluid px-0">
                <div id="mainCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="${controls.interval || 5000}">
                    <div class="carousel-indicators">
                        ${indicatorsHTML}
                    </div>
                    <div class="carousel-inner">
                        ${slidesHTML}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        `;

        $('#carousel-container').html(carouselHTML);
        console.log('✅ Carousel rendered successfully');

    } catch (error) {
        console.error('❌ Carousel render error:', error);
        renderEmptyCarouselSafe();
    }
}

// Generate placeholder SVG
function generatePlaceholderSVG(text) {
    const svg = `
        <svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#4a90e2"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48">
                ${text}
            </text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Empty carousel fallback
function renderEmptyCarouselSafe() {
    console.log('🔄 Rendering empty carousel...');

    const emptyHTML = `
        <div class="container-fluid px-0">
            <div style="height: 400px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); display: flex; align-items: center; justify-content: center;">
                <div class="text-center text-muted">
                    <i class="fas fa-images fa-4x mb-3"></i>
                    <h4>ไม่มีสไลด์แสดง</h4>
                    <p>กรุณาเพิ่มสไลด์ผ่านระบบจัดการเนื้อหา</p>
                </div>
            </div>
        </div>
    `;

    $('#carousel-container').html(emptyHTML);
}

// Safe news marquee loading
function loadNewsMarqueeSafe() {
    console.log('📢 Loading news marquee...');

    $.getJSON('data/homepage-news.json')
        .done(function (data) {
            console.log('✅ News marquee data loaded');
            renderNewsMarqueeSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ News marquee load failed:', status, error);
            // Skip marquee if failed
        });
}

// Safe news marquee rendering
function renderNewsMarqueeSafe(data) {
    try {
        const announcements = safeGet(data, 'announcements', []);

        if (!Array.isArray(announcements) || announcements.length === 0) {
            return;
        }

        const activeAnnouncements = announcements.filter(item => item.active);
        if (activeAnnouncements.length === 0) {
            return;
        }

        const marqueeText = activeAnnouncements.map(item => item.text || '').join(' • ');

        const marqueeHTML = `
            <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 10px 0; overflow: hidden;">
                <div class="container-fluid">
                    <div style="white-space: nowrap; animation: marquee 30s linear infinite;">
                        <i class="fas fa-bullhorn"></i> ${marqueeText}
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
        console.log('✅ News marquee rendered successfully');

    } catch (error) {
        console.error('❌ News marquee render error:', error);
    }
}

// Safe footer loading
function loadFooterSafe() {
    console.log('🦶 Loading footer...');

    $.getJSON('data/footer.json')
        .done(function (data) {
            console.log('✅ Footer data loaded');
            renderFooterSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ Footer load failed:', status, error);
            renderFallbackFooterSafe();
        });
}

// Safe footer rendering
function renderFooterSafe(data) {
    try {
        const copyright = safeGet(data, 'copyright', 'ห้วยตึงเฒ่า');
        const visitorCount = safeGet(data, 'visitorCount', '0');

        const footerHTML = `
            <div style="background: #2c3e50; color: white; padding: 2rem 0; margin-top: 3rem;">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <p>&copy; ${new Date().getFullYear()} ${copyright}</p>
                        </div>
                        <div class="col-md-6 text-end">
                            <p>ผู้เข้าชม: ${visitorCount} คน</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#footer').html(footerHTML);
        console.log('✅ Footer rendered successfully');

    } catch (error) {
        console.error('❌ Footer render error:', error);
        renderFallbackFooterSafe();
    }
}

// Fallback footer
function renderFallbackFooterSafe() {
    console.log('🔄 Rendering fallback footer...');

    const fallbackHTML = `
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

    $('#footer').html(fallbackHTML);
}

// Safe homepage content loading
function loadHomepageContentSafe() {
    console.log('🏠 Loading homepage content...');

    loadHomepageServicesSafe();
}

// Safe homepage services loading
function loadHomepageServicesSafe() {
    console.log('🛠️ Loading homepage services...');

    $.getJSON('data/homepage-services.json')
        .done(function (data) {
            console.log('✅ Homepage services data loaded');
            renderHomepageServicesSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ Homepage services load failed:', status, error);
            renderFallbackServicesSafe();
        });
}

// Safe homepage services rendering
function renderHomepageServicesSafe(data) {
    try {
        const section = safeGet(data, 'section', {});
        const services = safeGet(data, 'services', []);

        const sectionTitle = safeGet(section, 'title', 'บริการของเรา');
        const sectionSubtitle = safeGet(section, 'subtitle', 'บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า');

        let servicesHTML = '';
        if (Array.isArray(services)) {
            servicesHTML = services.slice(0, 6).map(service => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none; transition: all 0.3s ease;">
                        <div class="service-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                            <i class="${service.icon || 'fas fa-cog'}"></i>
                        </div>
                        <h4>${service.title || 'บริการ'}</h4>
                        <p>${service.description || 'คำอธิบายบริการ'}</p>
                    </div>
                </div>
            `).join('');
        }

        const fullHTML = `
            <section class="services-section py-5">
                <div class="container">
                    <div class="row text-center mb-5">
                        <div class="col-12">
                            <h2 style="color: #2c3e50; font-weight: 600; margin-bottom: 1rem;">${sectionTitle}</h2>
                            <p style="color: #7f8c8d; margin-bottom: 2rem;">${sectionSubtitle}</p>
                        </div>
                    </div>
                    <div class="row">
                        ${servicesHTML}
                    </div>
                </div>
            </section>
            <style>
                .service-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
            </style>
        `;

        $('#services-section').html(fullHTML);
        console.log('✅ Homepage services rendered successfully');

    } catch (error) {
        console.error('❌ Homepage services render error:', error);
        renderFallbackServicesSafe();
    }
}

// Fallback services
function renderFallbackServicesSafe() {
    console.log('🔄 Rendering fallback services...');

    const fallbackHTML = `
        <section class="services-section py-5">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 style="color: #2c3e50; font-weight: 600;">บริการของเรา</h2>
                        <p style="color: #7f8c8d;">บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-swimming-pool"></i>
                            </div>
                            <h4>กิจกรรมน้ำ</h4>
                            <p>เล่นน้ำและกิจกรรมริมอ่างเก็บน้ำ</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-campground"></i>
                            </div>
                            <h4>แคมป์ปิ้ง</h4>
                            <p>พื้นที่กางเต็นท์และพักค้างคืน</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100" style="background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2, #357abd); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
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

    $('#services-section').html(fallbackHTML);
}

// Emergency fallback when everything fails
function showEmergencyFallback() {
    console.log('🚨 Showing emergency fallback...');

    const emergencyHTML = `
        <div class="container mt-5">
            <div class="alert alert-danger text-center">
                <h4><i class="fas fa-exclamation-triangle"></i> เกิดข้อผิดพลาด</h4>
                <p>ไม่สามารถโหลดเว็บไซต์ได้ กรุณารีเฟรชหน้าหรือลองใหม่อีกครั้ง</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo"></i> รีเฟรชหน้า
                </button>
            </div>
        </div>
    `;

    $('body').html(emergencyHTML);
}

console.log('✅ Minimal main.js loaded successfully - No errors!');
// Additional functions for other pages
function loadHistoryContent() {
        console.log('📜 Loading history content...');

        $.getJSON('data/history-content.json')
            .done(function (data) {
                console.log('✅ History data loaded');
                renderHistoryContentSafe(data);
            })
            .fail(function (xhr, status, error) {
                console.warn('⚠️ History load failed:', status, error);
                renderFallbackHistoryContent();
            });
    }

function renderHistoryContentSafe(data) {
        try {
            const history = safeGet(data, 'history', {});
            const title = safeGet(history, 'title', 'ประวัติห้วยตึงเฒ่า');
            const subtitle = safeGet(history, 'subtitle', 'อันเนื่องมาจากพระราชดำริ');
            const content = safeGet(history, 'content', []);

            let contentHTML = '';
            if (Array.isArray(content)) {
                contentHTML = content.map((section, index) => `
                <div class="row mb-5">
                    <div class="col-md-8">
                        <h3>${section.section || 'หัวข้อ'}</h3>
                        <p>${section.text || 'เนื้อหา'}</p>
                    </div>
                    <div class="col-md-4">
                        ${section.image ? `
                            <img src="${section.image.src}" 
                                 alt="${section.image.alt || section.section}" 
                                 class="img-fluid rounded"
                                 onerror="this.src='${generatePlaceholderSVG(section.section || 'ประวัติ')}';">
                        ` : ''}
                    </div>
                </div>
            `).join('');
            }

            const historyHTML = `
            <div class="container py-5">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h1>${title}</h1>
                        <h2 class="text-muted">${subtitle}</h2>
                    </div>
                </div>
                ${contentHTML}
            </div>
        `;

            $('#history-content').html(historyHTML);
            console.log('✅ History content rendered successfully');

        } catch (error) {
            console.error('❌ History render error:', error);
            renderFallbackHistoryContent();
        }
    }

function renderFallbackHistoryContent() {
    const fallbackHTML = `
        <div class="container py-5">
            <div class="row text-center mb-5">
                <div class="col-12">
                    <h1>ประวัติห้วยตึงเฒ่า</h1>
                    <h2 class="text-muted">อันเนื่องมาจากพระราชดำริ</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p>ห้วยตึงเฒ่า เป็นโครงการจัดหมู่บ้านตัวอย่างอันเนื่องมาจากพระราชดำริ ตั้งอยู่ที่ตำบลดอนแก้ว อำเภอแม่ริม จังหวัดเชียงใหม่</p>
                </div>
            </div>
        </div>
    `;
    $('#history-content').html(fallbackHTML);
}

function loadContactContent() {
    console.log('📞 Loading contact content...');

    $.getJSON('data/contact-content.json')
        .done(function (data) {
            console.log('✅ Contact data loaded');
            renderContactContentSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ Contact load failed:', status, error);
            renderFallbackContactContent();
        });
}

function renderContactContentSafe(data) {
    try {
        const contact = safeGet(data, 'contact', {});
        const title = safeGet(contact, 'title', 'ติดต่อเรา');
        const organization = safeGet(contact, 'organization', 'ห้วยตึงเฒ่า');
        const phone = safeGet(contact, 'phone', '053-121119');
        const email = safeGet(contact, 'email', 'hueytuengtao@hotmail.com');
        const address = safeGet(contact, 'address.fullAddress', '283 ม.3 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่ 50180');

        const contactHTML = `
            <div class="container py-5">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h1>${title}</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body text-center">
                                <i class="fas fa-building fa-3x text-primary mb-3"></i>
                                <h5>หน่วยงาน</h5>
                                <p>${organization}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body text-center">
                                <i class="fas fa-phone fa-3x text-success mb-3"></i>
                                <h5>โทรศัพท์</h5>
                                <p><a href="tel:${phone.replace(/-/g, '')}">${phone}</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body text-center">
                                <i class="fas fa-envelope fa-3x text-info mb-3"></i>
                                <h5>อีเมล</h5>
                                <p><a href="mailto:${email}">${email}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-5">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">
                                <i class="fas fa-map-marker-alt fa-3x text-danger mb-3"></i>
                                <h5>ที่อยู่</h5>
                                <p>${address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#contact-content').html(contactHTML);
        console.log('✅ Contact content rendered successfully');

    } catch (error) {
        console.error('❌ Contact render error:', error);
        renderFallbackContactContent();
    }
}

function renderFallbackContactContent() {
    const fallbackHTML = `
        <div class="container py-5">
            <div class="row text-center mb-5">
                <div class="col-12">
                    <h1>ติดต่อเรา</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="fas fa-phone fa-3x text-success mb-3"></i>
                            <h5>โทรศัพท์</h5>
                            <p><a href="tel:053121119">053-121119</a></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="fas fa-envelope fa-3x text-info mb-3"></i>
                            <h5>อีเมล</h5>
                            <p><a href="mailto:hueytuengtao@hotmail.com">hueytuengtao@hotmail.com</a></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="fas fa-map-marker-alt fa-3x text-danger mb-3"></i>
                            <h5>ที่อยู่</h5>
                            <p>283 ม.3 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่ 50180</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#contact-content').html(fallbackHTML);
}

function loadServicesContent() {
    console.log('🛠️ Loading services content...');

    $.getJSON('data/services-content.json')
        .done(function (data) {
            console.log('✅ Services data loaded');
            renderServicesContentSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ Services load failed:', status, error);
            renderFallbackServicesContent();
        });
}

function renderServicesContentSafe(data) {
    try {
        const title = safeGet(data, 'title', 'บริการของเรา');
        const description = safeGet(data, 'description', 'บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า');
        const services = safeGet(data, 'services', []);

        let servicesHTML = '';
        if (Array.isArray(services)) {
            servicesHTML = services.map(service => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="${service.icon || 'fas fa-cog'} fa-3x text-primary mb-3"></i>
                            <h5>${service.title || 'บริการ'}</h5>
                            <p>${service.description || 'คำอธิบายบริการ'}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        const fullHTML = `
            <div class="container py-5">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h1>${title}</h1>
                        <p class="lead">${description}</p>
                    </div>
                </div>
                <div class="row">
                    ${servicesHTML}
                </div>
            </div>
        `;

        $('#services-content').html(fullHTML);
        console.log('✅ Services content rendered successfully');

    } catch (error) {
        console.error('❌ Services render error:', error);
        renderFallbackServicesContent();
    }
}

function renderFallbackServicesContent() {
    const fallbackHTML = `
        <div class="container py-5">
            <div class="row text-center mb-5">
                <div class="col-12">
                    <h1>บริการของเรา</h1>
                    <p class="lead">บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า</p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="fas fa-swimming-pool fa-3x text-primary mb-3"></i>
                            <h5>กิจกรรมน้ำ</h5>
                            <p>เล่นน้ำและกิจกรรมริมอ่างเก็บน้ำ</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="fas fa-campground fa-3x text-success mb-3"></i>
                            <h5>แคมป์ปิ้ง</h5>
                            <p>พื้นที่กางเต็นท์และพักค้างคืน</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="fas fa-utensils fa-3x text-info mb-3"></i>
                            <h5>ร้านอาหาร</h5>
                            <p>อาหารท้องถิ่นและเครื่องดื่ม</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#services-content').html(fallbackHTML);
}

function loadNewsContent() {
    console.log('📰 Loading news content...');

    $.getJSON('data/news-content.json')
        .done(function (data) {
            console.log('✅ News data loaded');
            renderNewsContentSafe(data);
        })
        .fail(function (xhr, status, error) {
            console.warn('⚠️ News load failed:', status, error);
            renderFallbackNewsContent();
        });
}

function renderNewsContentSafe(data) {
    try {
        const news = safeGet(data, 'news', []);

        let newsHTML = '';
        if (Array.isArray(news)) {
            newsHTML = news.map(item => `
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title">${item.title || 'ข่าวสาร'}</h5>
                                <small class="text-muted">${item.date || 'ไม่ระบุวันที่'}</small>
                            </div>
                            <p class="card-text">${item.content || 'เนื้อหาข่าว'}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        const fullHTML = `
            <div class="container py-5">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h1>ข่าวสาร</h1>
                        <p class="lead">ข่าวสารและกิจกรรมต่างๆ ของห้วยตึงเฒ่า</p>
                    </div>
                </div>
                <div class="row">
                    ${newsHTML}
                </div>
            </div>
        `;

        $('#news-content').html(fullHTML);
        console.log('✅ News content rendered successfully');

    } catch (error) {
        console.error('❌ News render error:', error);
        renderFallbackNewsContent();
    }
}

function renderFallbackNewsContent() {
    const fallbackHTML = `
        <div class="container py-5">
            <div class="row text-center mb-5">
                <div class="col-12">
                    <h1>ข่าวสาร</h1>
                    <p class="lead">ข่าวสารและกิจกรรมต่างๆ ของห้วยตึงเฒ่า</p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">ยินดีต้อนรับสู่ห้วยตึงเฒ่า</h5>
                            <p class="card-text">สถานที่ท่องเที่ยวเชิงนิเวศที่สวยงามในจังหวัดเชียงใหม่</p>
                            <small class="text-muted">วันนี้</small>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">บริการและสิ่งอำนวยความสะดวก</h5>
                            <p class="card-text">พร้อมให้บริการนักท่องเที่ยวด้วยสิ่งอำนวยความสะดวกครบครัน</p>
                            <small class="text-muted">วันนี้</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#news-content').html(fallbackHTML);
}

// Update the main initialization to handle different pages
function initializeWebsiteMinimal() {
    console.log('🔧 Initializing website components...');

    // Load components in order
    loadNavigationSafe();
    loadCarouselSafe();
    loadNewsMarqueeSafe();
    loadFooterSafe();

    // Load page content based on current page
    const currentPage = getCurrentPageSafe();
    console.log('📄 Current page:', currentPage);

    switch (currentPage) {
        case 'homepage':
            loadHomepageContentSafe();
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
        default:
            console.log('📄 Unknown page, loading homepage content');
            loadHomepageContentSafe();
            break;
    }
}

console.log('✅ Extended minimal main.js loaded - All pages supported!');