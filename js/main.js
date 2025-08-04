// Main JavaScript for Huay Tueng Thao Website
$(document).ready(function () {
    // Initialize error handling first
    if (typeof errorHandler !== 'undefined') {
        errorHandler.fixUndefinedVariables();
    }

    // Initialize the website with error handling
    try {
        initializeWebsite();
    } catch (error) {
        console.error('Failed to initialize website:', error);
        // Provide fallback initialization
        initializeFallbackWebsite();
    }
});

// Initialize all website components
function initializeWebsite() {
    loadNavigation();
    loadCarousel();
    loadNewsMarquee();
    loadFooter();

    // Load page-specific content based on current page
    const currentPage = getCurrentPage();
    loadPageContent(currentPage);

    // Initialize interactive elements
    initializeInteractiveElements();

    // Initialize mobile-specific features
    initializeMobileFeatures();

    // Initialize responsive image handling
    initializeResponsiveImages();

    // Initialize real-time content synchronization
    initializeRealTimeSync(currentPage);

    // Initialize advanced interactive features
    initializeAdvancedInteractiveFeatures();
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
    $.getJSON('data/navigation.json')
        .done(function (data) {
            // Validate data structure
            if (data && typeof data === 'object') {
                renderNavigation(data);
            } else {
                console.warn('Invalid navigation data structure, using fallback');
                renderFallbackNavigation();
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to load navigation data:', textStatus, errorThrown);
            // Log error for debugging
            if (typeof errorHandler !== 'undefined') {
                errorHandler.logError('Navigation Load Error', {
                    status: textStatus,
                    error: errorThrown,
                    url: 'data/navigation.json'
                });
            }
            // Fallback navigation
            renderFallbackNavigation();
        });
}

// Initialize real-time content synchronization
function initializeRealTimeSync(currentPage) {
    if (typeof window.realTimeSync === 'undefined') {
        console.warn('Real-time sync not available');
        return;
    }

    // Register navigation for real-time updates
    window.realTimeSync.registerContent('navigation', async (contentType) => {
        console.log('Reloading navigation due to update');
        loadNavigation();
    });

    // Register carousel for real-time updates
    window.realTimeSync.registerContent('homepage-carousel', async (contentType) => {
        console.log('Reloading carousel due to update');
        loadCarousel();
    });

    // Register news marquee for real-time updates
    window.realTimeSync.registerContent('homepage-news', async (contentType) => {
        console.log('Reloading news marquee due to update');
        loadNewsMarquee();
    });

    // Register footer for real-time updates
    window.realTimeSync.registerContent('footer', async (contentType) => {
        console.log('Reloading footer due to update');
        loadFooter();
    });

    // Register page-specific content based on current page
    switch (currentPage) {
        case 'homepage':
            // Register homepage-specific content
            window.realTimeSync.registerContent('homepage-services', async (contentType) => {
                console.log('Reloading homepage services due to update');
                loadHomepageServices();
            });
            window.realTimeSync.registerContent('homepage-featured', async (contentType) => {
                console.log('Reloading homepage featured content due to update');
                loadHomepageFeatured();
            });
            window.realTimeSync.registerContent('homepage-gallery', async (contentType) => {
                console.log('Reloading homepage gallery due to update');
                loadHomepageGallery();
            });
            window.realTimeSync.registerContent('homepage-updates', async (contentType) => {
                console.log('Reloading homepage updates due to update');
                loadHomepageUpdates();
            });
            break;
        case 'history':
            window.realTimeSync.registerContent('history', async (contentType) => {
                console.log('Reloading history content due to update');
                loadHistoryContent();
            });
            break;
        case 'contact':
            window.realTimeSync.registerContent('contact', async (contentType) => {
                console.log('Reloading contact content due to update');
                loadContactContent();
            });
            break;
        case 'services':
            window.realTimeSync.registerContent('services', async (contentType) => {
                console.log('Reloading services content due to update');
                loadServicesContent();
            });
            break;
        case 'news':
            window.realTimeSync.registerContent('news', async (contentType) => {
                console.log('Reloading news content due to update');
                loadNewsContent();
            });
            break;
    }

    console.log('Real-time sync initialized for page:', currentPage);
}

// Render navigation HTML
function renderNavigation(data) {
    const currentPage = getCurrentPage();
    const navHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
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

    // Initialize navbar scroll effect
    initializeNavbarScrollEffect();
}

// Fallback navigation if JSON fails to load
function renderFallbackNavigation() {
    const fallbackHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
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
    $.getJSON('data/homepage-carousel.json')
        .done(function (data) {
            renderCarousel(data);
        })
        .fail(function () {
            console.error('Failed to load carousel data');
        });
}

// Render carousel HTML with enhanced image handling
function renderCarousel(data) {
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
            (typeof errorHandler !== 'undefined' ?
                errorHandler.fallbackImages.get('carousel') :
                'data:image/svg+xml;base64,' + btoa(`
                                    <svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="100%" height="100%" fill="#4a90e2"/>
                                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48">
                                            ${slide.title || 'สไลด์'}
                                        </text>
                                    </svg>
                                `)
            );

        return `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}" data-slide-id="${slide.id || index}">
                                <img src="${imageSrc}" 
                                     class="d-block w-100 carousel-image" 
                                     alt="${slide.title || 'สไลด์ที่ ' + (index + 1)}" 
                                     loading="${index === 0 ? 'eager' : 'lazy'}"
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

    // Initialize carousel enhancements
    initializeCarouselEnhancements();
}

// Render empty carousel fallback
function renderEmptyCarousel() {
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
    $.getJSON('data/homepage-news.json')
        .done(function (data) {
            renderNewsMarquee(data);
        })
        .fail(function () {
            console.error('Failed to load news marquee data');
        });
}

// Render news marquee
function renderNewsMarquee(data) {
    if (!data.announcements || data.announcements.length === 0) return;

    const activeAnnouncements = data.announcements.filter(announcement => announcement.active);
    if (activeAnnouncements.length === 0) return;

    const marqueeHTML = `
        <div class="news-marquee">
            <div class="container-fluid">
                <div class="marquee-content">
                    <i class="fas fa-bullhorn"></i> 
                    ${activeAnnouncements.map(announcement => announcement.text).join(' • ')}
                </div>
            </div>
        </div>
    `;
    $('#news-marquee').html(marqueeHTML);

    // Initialize marquee pause on hover
    initializeMarqueeInteractions();
}

// Load footer
function loadFooter() {
    $.getJSON('data/footer.json')
        .done(function (data) {
            renderFooter(data);
        })
        .fail(function () {
            console.error('Failed to load footer data');
            renderFallbackFooter();
        });
}

// Render footer
function renderFooter(data) {
    const footerHTML = `
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
    `;
    $('#footer').html(footerHTML);
}

// Fallback footer
function renderFallbackFooter() {
    const footerHTML = `
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
    `;
    $('#footer').html(footerHTML);
}

// Load page-specific content
function loadPageContent(page) {
    switch (page) {
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

// Load history content
function loadHistoryContent() {
    $.getJSON('data/history-content.json')
        .done(function (data) {
            renderHistoryContent(data);
        })
        .fail(function () {
            console.error('Failed to load history content data');
            showError('#history-content', 'ไม่สามารถโหลดข้อมูลประวัติได้ กรุณาลองใหม่อีกครั้ง');
        });
}

// Render history content with enhanced design
function renderHistoryContent(data) {
    if (!data.history) return;

    const history = data.history;
    const historyHTML = `
        <div class="history-page">
            <!-- Hero Section -->
            <section class="history-hero">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-8">
                            <div class="hero-content">
                                <h1 class="hero-title">${history.title}</h1>
                                <h2 class="hero-subtitle">${history.subtitle}</h2>
                                <div class="hero-divider"></div>
                                <p class="hero-description">
                                    ติดตามเรื่องราวการพัฒนาและความเป็นมาของห้วยตึงเฒ่า 
                                    อันเนื่องมาจากพระราชดำริในพระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดช มหาราช
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="hero-image">
                                <img src="${history.mainImage.src}" alt="${history.mainImage.alt}" class="img-fluid rounded-3 shadow-lg">
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Timeline Section -->
            <section class="history-timeline">
                <div class="container">
                    <div class="section-title text-center mb-5">
                        <h2>เส้นทางประวัติศาสตร์</h2>
                        <p>การพัฒนาห้วยตึงเฒ่าตั้งแต่อดีตจนถึงปัจจุบัน</p>
                    </div>
                    
                    <div class="timeline">
                        ${history.content.map((section, index) => `
                            <div class="timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}" data-aos="fade-${index % 2 === 0 ? 'right' : 'left'}">
                                <div class="timeline-content">
                                    <div class="timeline-card">
                                        <div class="row ${index % 2 === 0 ? '' : 'flex-row-reverse'}">
                                            <div class="col-md-6">
                                                <div class="content-text">
                                                    <h3 class="section-title">${section.section}</h3>
                                                    <p class="section-text">${section.text}</p>
                                                </div>
                                            </div>
                                            ${section.image ? `
                                                <div class="col-md-6">
                                                    <div class="content-image">
                                                        <img src="${section.image.src}" 
                                                             alt="${section.section}" 
                                                             class="img-fluid rounded-3 shadow-sm history-image"
                                                             data-bs-toggle="modal" 
                                                             data-bs-target="#imageModal"
                                                             data-image-src="${section.image.src}"
                                                             data-image-title="${section.section}">
                                                        <div class="image-overlay">
                                                            <i class="fas fa-search-plus"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                    <div class="timeline-marker">
                                        <div class="timeline-number">${index + 1}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Legacy Section -->
            <section class="history-legacy">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto">
                            <div class="legacy-card">
                                <div class="legacy-icon">
                                    <i class="fas fa-crown"></i>
                                </div>
                                <h3>มรดกแห่งพระราชดำริ</h3>
                                <p class="lead">
                                    ห้วยตึงเฒ่าเป็นสัญลักษณ์แห่งพระราชปณิธานในการพัฒนาคุณภาพชีวิตของประชาชน 
                                    และการอนุรักษ์ทรัพยากรธรรมชาติอย่างยั่งยืน ตามแนวพระราชดำริเศรษฐกิจพอเพียง
                                </p>
                                <div class="legacy-stats">
                                    <div class="row text-center">
                                        <div class="col-md-3">
                                            <div class="stat-item">
                                                <h4>300</h4>
                                                <p>ไร่</p>
                                                <small>พื้นที่อ่างเก็บน้ำ</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="stat-item">
                                                <h4>1.4</h4>
                                                <p>ล้าน ลบ.ม.</p>
                                                <small>ความจุน้ำ</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="stat-item">
                                                <h4>61</h4>
                                                <p>ครอบครัว</p>
                                                <small>ราษฎรในโครงการ</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="stat-item">
                                                <h4>2,462</h4>
                                                <p>ไร่</p>
                                                <small>พื้นที่ทั้งหมด</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="imageModalLabel">ภาพประกอบ</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img id="modalImage" src="" alt="" class="img-fluid rounded">
                    </div>
                </div>
            </div>
        </div>
    `;

    $('#history-content').html(historyHTML);

    // Initialize history page interactions
    initializeHistoryPageInteractions();
}

// Load contact content
function loadContactContent() {
    $.getJSON('data/contact-content.json')
        .done(function (data) {
            renderContactContent(data);
        })
        .fail(function () {
            console.error('Failed to load contact content data');
            showError('#contact-content', 'ไม่สามารถโหลดข้อมูลติดต่อได้ กรุณาลองใหม่อีกครั้ง');
        });
}

// Render contact content with enhanced design
function renderContactContent(data) {
    if (!data.contact) return;

    const contact = data.contact;
    const contactHTML = `
        <div class="contact-page">
            <!-- Contact Hero Section -->
            <section class="contact-hero">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <div class="hero-content">
                                <h1 class="hero-title">${contact.title}</h1>
                                <div class="hero-divider"></div>
                                <p class="hero-description">
                                    ติดต่อสอบถามข้อมูลเพิ่มเติม หรือประสานงานเกี่ยวกับการเยี่ยมชมห้วยตึงเฒ่า
                                </p>
                                <div class="contact-quick-info">
                                    <div class="quick-info-item">
                                        <i class="fas fa-phone"></i>
                                        <span>${contact.phone}</span>
                                    </div>
                                    <div class="quick-info-item">
                                        <i class="fas fa-envelope"></i>
                                        <span>${contact.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="hero-image">
                                <div class="contact-card">
                                    <div class="card-icon">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <h3>ที่ตั้ง</h3>
                                    <p class="organization-name">${contact.organization}</p>
                                    <p class="address">${contact.address.fullAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contact Information Section -->
            <section class="contact-info">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-md-6">
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-building"></i>
                                </div>
                                <h4>หน่วยงาน</h4>
                                <p>${contact.organization}</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-phone-alt"></i>
                                </div>
                                <h4>โทรศัพท์</h4>
                                <p>
                                    <a href="tel:${contact.phone.replace(/-/g, '')}" class="contact-link">
                                        ${contact.phone}
                                    </a>
                                </p>
                                ${contact.fax ? `<small>แฟกซ์: ${contact.fax}</small>` : ''}
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <h4>อีเมล</h4>
                                <p>
                                    <a href="mailto:${contact.email}" class="contact-link">
                                        ${contact.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Map and Social Media Section -->
            <section class="contact-map-social">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="map-container">
                                <h3 class="section-title">
                                    <i class="fas fa-map-marked-alt"></i>
                                    แผนที่และเส้นทาง
                                </h3>
                                <div class="map-wrapper">
                                    <iframe 
                                        src="${contact.googleMaps.embedUrl}"
                                        width="${contact.googleMaps.width}"
                                        height="${contact.googleMaps.height}"
                                        style="${contact.googleMaps.style}"
                                        allowfullscreen="${contact.googleMaps.allowfullscreen}"
                                        loading="${contact.googleMaps.loading}"
                                        referrerpolicy="no-referrer-when-downgrade"
                                        class="google-map">
                                    </iframe>
                                    <div class="map-overlay">
                                        <div class="map-controls">
                                            <button class="btn btn-primary btn-sm" onclick="openInGoogleMaps()">
                                                <i class="fas fa-external-link-alt"></i>
                                                เปิดใน Google Maps
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="directions-info">
                                    <h5>วิธีการเดินทาง</h5>
                                    <ul class="directions-list">
                                        <li><i class="fas fa-car"></i> จากตัวเมืองเชียงใหม่ ใช้เส้นทางไปแม่ริม ประมาณ 20 กิโลเมตร</li>
                                        <li><i class="fas fa-bus"></i> รถประจำทางสาย แม่ริม-ดอนแก้ว</li>
                                        <li><i class="fas fa-motorcycle"></i> รถจักรยานยนต์รับจ้าง จากตลาดแม่ริม</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="social-container">
                                <h3 class="section-title">
                                    <i class="fab fa-facebook"></i>
                                    ติดตามเรา
                                </h3>
                                <div class="social-links">
                                    <a href="${contact.socialMedia.facebook.account.url}" 
                                       target="_blank" 
                                       class="social-link facebook-account">
                                        <div class="social-icon">
                                            <i class="fab fa-facebook-f"></i>
                                        </div>
                                        <div class="social-info">
                                            <h5>Facebook Account</h5>
                                            <p>หน้าบัญชีผู้ใช้</p>
                                        </div>
                                        <i class="fas fa-external-link-alt social-external"></i>
                                    </a>
                                    <a href="${contact.socialMedia.facebook.fanpage.url}" 
                                       target="_blank" 
                                       class="social-link facebook-fanpage">
                                        <div class="social-icon">
                                            <i class="fab fa-facebook"></i>
                                        </div>
                                        <div class="social-info">
                                            <h5>Facebook Fanpage</h5>
                                            <p>หน้าแฟนเพจ</p>
                                        </div>
                                        <i class="fas fa-external-link-alt social-external"></i>
                                    </a>
                                </div>
                                
                                <!-- Facebook Page Plugin -->
                                <div class="facebook-embed">
                                    <div class="fb-page" 
                                         data-href="${contact.facebookEmbed.pageUrl}"
                                         data-tabs="${contact.facebookEmbed.tabs}"
                                         data-width="350"
                                         data-height="500"
                                         data-small-header="${contact.facebookEmbed.smallHeader}"
                                         data-adapt-container-width="${contact.facebookEmbed.adaptContainerWidth}"
                                         data-hide-cover="${contact.facebookEmbed.hideCover}"
                                         data-show-facepile="${contact.facebookEmbed.showFacepile}">
                                        <blockquote cite="${contact.facebookEmbed.pageUrl}" class="fb-xfbml-parse-ignore">
                                            <a href="${contact.facebookEmbed.pageUrl}">ห้วยตึงเฒ่า</a>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contact Form Section -->
            <section class="contact-form-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="contact-form-container">
                                <h3 class="section-title text-center">
                                    <i class="fas fa-paper-plane"></i>
                                    ส่งข้อความถึงเรา
                                </h3>
                                <p class="text-center mb-4">
                                    กรอกแบบฟอร์มด้านล่างเพื่อส่งข้อความสอบถามหรือขอข้อมูลเพิ่มเติม
                                </p>
                                <form id="contactForm" class="contact-form">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="contactName">ชื่อ-นามสกุล *</label>
                                                <input type="text" class="form-control" id="contactName" required>
                                                <div class="form-icon">
                                                    <i class="fas fa-user"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="contactPhone">เบอร์โทรศัพท์</label>
                                                <input type="tel" class="form-control" id="contactPhone">
                                                <div class="form-icon">
                                                    <i class="fas fa-phone"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="contactEmail">อีเมล *</label>
                                        <input type="email" class="form-control" id="contactEmail" required>
                                        <div class="form-icon">
                                            <i class="fas fa-envelope"></i>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="contactSubject">หัวข้อ *</label>
                                        <select class="form-control" id="contactSubject" required>
                                            <option value="">เลือกหัวข้อ</option>
                                            <option value="general">สอบถามข้อมูลทั่วไป</option>
                                            <option value="visit">ขอข้อมูลการเยี่ยมชม</option>
                                            <option value="activity">สอบถามกิจกรรม</option>
                                            <option value="booking">จองสถานที่</option>
                                            <option value="other">อื่นๆ</option>
                                        </select>
                                        <div class="form-icon">
                                            <i class="fas fa-tag"></i>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="contactMessage">ข้อความ *</label>
                                        <textarea class="form-control" id="contactMessage" rows="5" required placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม..."></textarea>
                                        <div class="form-icon">
                                            <i class="fas fa-comment"></i>
                                        </div>
                                    </div>
                                    <div class="form-group text-center">
                                        <button type="submit" class="btn btn-primary btn-lg">
                                            <i class="fas fa-paper-plane"></i>
                                            ส่งข้อความ
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    $('#contact-content').html(contactHTML);

    // Initialize contact page interactions
    initializeContactPageInteractions();

    // Load Facebook SDK
    loadFacebookSDK();
}

// Initialize contact page interactions
function initializeContactPageInteractions() {
    // Contact form submission
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        handleContactFormSubmission();
    });

    // Form validation
    $('.form-control').on('blur', function () {
        validateFormField($(this));
    });

    // Phone number formatting
    $('#contactPhone').on('input', function () {
        formatPhoneNumber($(this));
    });

    // Social link click tracking
    $('.social-link').on('click', function () {
        const platform = $(this).hasClass('facebook-account') ? 'Facebook Account' : 'Facebook Fanpage';
        console.log('Social link clicked:', platform);
    });

    // Map interaction
    $('.google-map').on('load', function () {
        console.log('Google Maps loaded successfully');
    });

    // Add hover effects to info cards
    $('.info-card').hover(
        function () {
            $(this).addClass('card-hover');
        },
        function () {
            $(this).removeClass('card-hover');
        }
    );
}

// Handle contact form submission
function handleContactFormSubmission() {
    const formData = {
        name: $('#contactName').val(),
        phone: $('#contactPhone').val(),
        email: $('#contactEmail').val(),
        subject: $('#contactSubject').val(),
        message: $('#contactMessage').val(),
        timestamp: new Date().toISOString()
    };

    // Show loading state
    const submitBtn = $('#contactForm button[type="submit"]');
    const originalText = submitBtn.html();
    submitBtn.html('<span class="loading"></span> กำลังส่ง...').prop('disabled', true);

    // Simulate form submission (replace with actual API call)
    setTimeout(function () {
        // Show success message
        showContactFormSuccess();

        // Reset form
        $('#contactForm')[0].reset();

        // Restore button
        submitBtn.html(originalText).prop('disabled', false);

        console.log('Contact form submitted:', formData);
    }, 2000);
}

// Show contact form success message
function showContactFormSuccess() {
    const successHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle"></i>
            <strong>ส่งข้อความสำเร็จ!</strong> เราจะติดต่อกลับไปยังท่านในเร็วๆ นี้
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    $('.contact-form-container').prepend(successHTML);

    // Auto-hide after 5 seconds
    setTimeout(function () {
        $('.alert').fadeOut();
    }, 5000);
}

// Validate form field
function validateFormField(field) {
    const value = field.val().trim();
    const fieldType = field.attr('type') || field.prop('tagName').toLowerCase();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.prop('required') && !value) {
        isValid = false;
        errorMessage = 'กรุณากรอกข้อมูลในช่องนี้';
    }

    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }
    }

    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง';
        }
    }

    // Show/hide validation feedback
    field.removeClass('is-valid is-invalid');
    field.siblings('.invalid-feedback').remove();

    if (!isValid) {
        field.addClass('is-invalid');
        field.after(`<div class="invalid-feedback">${errorMessage}</div>`);
    } else if (value) {
        field.addClass('is-valid');
    }

    return isValid;
}

// Format phone number
function formatPhoneNumber(field) {
    let value = field.val().replace(/\D/g, '');

    if (value.length >= 3) {
        if (value.length <= 6) {
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        } else {
            value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
        }
    }

    field.val(value);
}

// Open location in Google Maps
function openInGoogleMaps() {
    const address = encodeURIComponent('283 ม.3 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่ 50180');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
}

// Load Facebook SDK
function loadFacebookSDK() {
    if (typeof FB !== 'undefined') return;

    window.fbAsyncInit = function () {
        FB.init({
            xfbml: true,
            version: 'v18.0'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v18.0';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

// Initialize history page interactions
function initializeHistoryPageInteractions() {
    // Image modal functionality
    $('.history-image').click(function () {
        const imageSrc = $(this).data('image-src');
        const imageTitle = $(this).data('image-title');

        $('#modalImage').attr('src', imageSrc).attr('alt', imageTitle);
        $('#imageModalLabel').text(imageTitle);
    });

    // Smooth scroll animation for timeline items
    $(window).scroll(function () {
        $('.timeline-item').each(function () {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-in');
            }
        });
    });

    // Add hover effects to timeline cards
    $('.timeline-card').hover(
        function () {
            $(this).addClass('card-hover');
        },
        function () {
            $(this).removeClass('card-hover');
        }
    );

    // Initialize image lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.history-image img').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Load homepage content
function loadHomepageContent() {
    loadHomepageServices();
    loadHomepageFeatured();
    loadHomepageUpdates();
    loadHomepageGallery();
}

// Load homepage services
function loadHomepageServices() {
    $.getJSON('data/homepage-services.json')
        .done(function (data) {
            renderHomepageServices(data);
        })
        .fail(function () {
            console.error('Failed to load homepage services data');
        });
}

// Load homepage featured content
function loadHomepageFeatured() {
    $.getJSON('data/homepage-featured.json')
        .done(function (data) {
            renderHomepageFeatured(data);
        })
        .fail(function () {
            console.error('Failed to load homepage featured data');
        });
}

// Load homepage updates
function loadHomepageUpdates() {
    $.getJSON('data/homepage-updates.json')
        .done(function (data) {
            renderHomepageUpdates(data);
        })
        .fail(function () {
            console.error('Failed to load homepage updates data');
        });
}

// Load homepage gallery
function loadHomepageGallery() {
    $.getJSON('data/homepage-gallery.json')
        .done(function (data) {
            renderHomepageGallery(data);
        })
        .fail(function () {
            console.error('Failed to load homepage gallery data');
        });
}

// Load featured content
function loadFeaturedContent() {
    $.getJSON('data/homepage-featured.json')
        .done(function (data) {
            renderFeaturedContent(data);
        })
        .fail(function () {
            console.error('Failed to load featured content data');
        });
}

// Render featured content
function renderFeaturedContent(data) {
    if (!data.featuredContent || data.featuredContent.length === 0) return;

    const featuredHTML = `
        <section class="featured-section">
            <div class="container">
                <div class="section-title">
                    <h2>${data.section.title}</h2>
                    <p>${data.section.subtitle}</p>
                </div>
                <div class="row">
                    ${data.featuredContent.map(item => `
                        <div class="col-lg-3 col-md-6">
                            <div class="featured-card ${item.type === 'video' ? 'video-card' : ''}" data-featured-id="${item.id}">
                                <div class="card-image">
                                    ${item.type === 'video' ? `
                                        <img src="${item.image}" alt="${item.title}">
                                        <div class="play-button" data-video-src="${item.videoSrc}">
                                            <i class="fas fa-play"></i>
                                        </div>
                                    ` : `
                                        <img src="${item.image}" alt="${item.title}">
                                    `}
                                    <div class="card-overlay">
                                        <div class="overlay-content">
                                            <h5>${item.title}</h5>
                                            <p>${item.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <span class="card-category">${item.category}</span>
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-description">${item.description}</p>
                                    ${item.tags ? `
                                        <div class="card-tags">
                                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${data.additionalActivities ? `
                    <div class="row mt-4">
                        <div class="col-12">
                            <h4 class="text-center mb-4">กิจกรรมเพิ่มเติม</h4>
                        </div>
                        ${data.additionalActivities.map(activity => `
                            <div class="col-lg-4 col-md-6">
                                <div class="featured-card">
                                    <div class="card-image">
                                        <img src="${activity.image}" alt="${activity.title}">
                                        <div class="card-overlay">
                                            <div class="overlay-content">
                                                <i class="${activity.icon}" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                                <h5>${activity.title}</h5>
                                                <p>${activity.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">${activity.title}</h5>
                                        <p class="card-description">${activity.description}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </section>
    `;
    $('#featured-content').html(featuredHTML);

    // Initialize featured content interactions
    initializeFeaturedContentInteractions();
}

// Load news updates
function loadNewsUpdates() {
    $.getJSON('data/homepage-updates.json')
        .done(function (data) {
            renderNewsUpdates(data);
        })
        .fail(function () {
            console.error('Failed to load news updates data');
        });
}

// Render news updates
function renderNewsUpdates(data) {
    if (!data.newsItems || data.newsItems.length === 0) return;

    const newsHTML = `
        <section class="news-section">
            <div class="container">
                <div class="section-title">
                    <h2>${data.newsSection.title}</h2>
                    <p>ติดตามข่าวสารและกิจกรรมล่าสุดของห้วยตึงเฒ่า</p>
                </div>
                <div class="news-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>ข่าวสาร</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.newsItems.slice(0, 6).map(news => `
                                <tr>
                                    <td class="news-item-date">${news.date}</td>
                                    <td>
                                        <a href="${news.link}" target="${news.target || '_self'}" class="news-item-title">
                                            ${news.title}
                                        </a>
                                        ${news.isNew ? '<span class="news-badge">ใหม่</span>' : ''}
                                    </td>
                                    <td>
                                        ${news.isNew ? '<i class="fas fa-star text-warning"></i>' : '<i class="fas fa-check text-success"></i>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="text-center mt-4">
                    <a href="page-news.html" class="btn btn-primary">
                        <i class="fas fa-newspaper"></i> ดูข่าวสารทั้งหมด
                    </a>
                </div>
            </div>
        </section>
    `;
    $('#news-updates').html(newsHTML);
}

// Load gallery
function loadGallery() {
    $.getJSON('data/homepage-gallery.json')
        .done(function (data) {
            renderGallery(data);
        })
        .fail(function () {
            console.error('Failed to load gallery data');
        });
}

// Render gallery
function renderGallery(data) {
    if (!data.gallery.images || data.gallery.images.length === 0) return;

    const galleryHTML = `
        <section class="gallery-section">
            <div class="container">
                <div class="section-title">
                    <h2>${data.gallery.title}</h2>
                    <p>${data.gallery.subtitle}</p>
                </div>
                <div class="gallery-grid">
                    ${data.gallery.images.slice(0, 6).map(image => `
                        <div class="gallery-item" data-image-id="${image.id}">
                            <img src="${image.src}" alt="${image.alt}" loading="lazy">
                            <div class="gallery-overlay">
                                <h5>${image.title}</h5>
                                <p>${image.description}</p>
                                <span class="badge bg-primary">${image.category}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="text-center mt-4">
                    <a href="${data.gallery.viewAllLink}" class="btn btn-primary">
                        <i class="fas fa-images"></i> ดูภาพทั้งหมด
                    </a>
                </div>
            </div>
        </section>
    `;
    $('#gallery-section').html(galleryHTML);

    // Initialize gallery lightbox
    initializeGalleryLightbox(data.gallery.images);
}

// Load services section
function loadServices() {
    $.getJSON('data/homepage-services.json')
        .done(function (data) {
            renderServices(data);
        })
        .fail(function () {
            console.error('Failed to load services data');
        });
}

// Render services
function renderServices(data) {
    if (!data.services || data.services.length === 0) return;

    const servicesHTML = `
        <section class="services-section">
            <div class="container">
                <div class="section-title">
                    <h2>${data.section.title}</h2>
                    <p>${data.section.subtitle}</p>
                </div>
                <div class="row">
                    ${data.services.map(service => `
                        <div class="col-lg-4 col-md-6">
                            <div class="service-card" data-service-id="${service.id}">
                                <div class="service-icon">
                                    <i class="${service.icon}"></i>
                                </div>
                                <h4>${service.title}</h4>
                                <p>${service.description}</p>
                                ${service.features ? `
                                    <ul class="service-features">
                                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
    $('#services-section').html(servicesHTML);

    // Initialize service card interactions
    initializeServiceCardInteractions();
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Add loading states to buttons
    $('.btn').on('click', function () {
        const $btn = $(this);
        const originalText = $btn.html();
        $btn.html('<span class="loading"></span> กำลังโหลด...');

        setTimeout(function () {
            $btn.html(originalText);
        }, 2000);
    });

    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover();
}

// Initialize navbar scroll effect
function initializeNavbarScrollEffect() {
    $(window).scroll(function () {
        const navbar = $('.navbar');
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
}

// Initialize carousel enhancements
function initializeCarouselEnhancements() {
    const carousel = $('#mainCarousel');

    // Add keyboard navigation
    $(document).keydown(function (e) {
        if (e.keyCode === 37) { // Left arrow
            carousel.carousel('prev');
        } else if (e.keyCode === 39) { // Right arrow
            carousel.carousel('next');
        }
    });

    // Add touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    carousel.on('touchstart', function (e) {
        startX = e.originalEvent.touches[0].clientX;
    });

    carousel.on('touchend', function (e) {
        endX = e.originalEvent.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                carousel.carousel('next');
            } else {
                carousel.carousel('prev');
            }
        }
    }

    // Pause carousel on hover
    carousel.hover(
        function () { $(this).carousel('pause'); },
        function () { $(this).carousel('cycle'); }
    );

    // Add slide change event tracking
    carousel.on('slide.bs.carousel', function (e) {
        const slideId = $(e.relatedTarget).data('slide-id');
        console.log('Carousel slide changed to:', slideId);

        // Add fade effect to captions
        $('.carousel-caption').fadeOut(200, function () {
            $(this).fadeIn(400);
        });
    });
}

// Initialize marquee interactions
function initializeMarqueeInteractions() {
    const marqueeContent = $('.marquee-content');

    // Pause animation on hover
    marqueeContent.hover(
        function () {
            $(this).css('animation-play-state', 'paused');
        },
        function () {
            $(this).css('animation-play-state', 'running');
        }
    );

    // Add click to pause/resume functionality
    marqueeContent.click(function () {
        const currentState = $(this).css('animation-play-state');
        if (currentState === 'paused') {
            $(this).css('animation-play-state', 'running');
        } else {
            $(this).css('animation-play-state', 'paused');
        }
    });
}

// Utility function to show loading state
function showLoading(element) {
    $(element).html('<div class="text-center"><span class="loading"></span> กำลังโหลด...</div>');
}

// Utility function to show error state
function showError(element, message) {
    $(element).html(`<div class="alert alert-danger">${message}</div>`);
}
// Initialize service card interactions
function initializeServiceCardInteractions() {
    $('.service-card').hover(
        function () {
            $(this).find('.service-icon').addClass('animate__animated animate__pulse');
        },
        function () {
            $(this).find('.service-icon').removeClass('animate__animated animate__pulse');
        }
    );

    // Add click tracking
    $('.service-card').click(function () {
        const serviceId = $(this).data('service-id');
        console.log('Service card clicked:', serviceId);
        // Add analytics or navigation logic here
    });
}

// Initialize featured content interactions
function initializeFeaturedContentInteractions() {
    // Video play button functionality
    $('.play-button').click(function (e) {
        e.preventDefault();
        const videoSrc = $(this).data('video-src');
        if (videoSrc) {
            openVideoModal(videoSrc);
        }
    });

    // Featured card hover effects
    $('.featured-card').hover(
        function () {
            $(this).find('.card-image img').addClass('animate__animated animate__pulse');
        },
        function () {
            $(this).find('.card-image img').removeClass('animate__animated animate__pulse');
        }
    );

    // Featured card click tracking
    $('.featured-card').click(function () {
        const featuredId = $(this).data('featured-id');
        console.log('Featured card clicked:', featuredId);
    });
}

// Initialize gallery lightbox
function initializeGalleryLightbox(images) {
    // Create lightbox HTML if it doesn't exist
    if ($('#lightbox').length === 0) {
        $('body').append(`
            <div id="lightbox" class="lightbox">
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img id="lightbox-image" src="" alt="">
                    <div class="lightbox-caption">
                        <h5 id="lightbox-title"></h5>
                        <p id="lightbox-description"></p>
                    </div>
                </div>
            </div>
        `);
    }

    // Gallery item click handlers
    $('.gallery-item').click(function () {
        const imageId = $(this).data('image-id');
        const image = images.find(img => img.id === imageId);

        if (image) {
            $('#lightbox-image').attr('src', image.src).attr('alt', image.alt);
            $('#lightbox-title').text(image.title);
            $('#lightbox-description').text(image.description);
            $('#lightbox').addClass('active');
        }
    });

    // Close lightbox
    $('.lightbox-close, #lightbox').click(function (e) {
        if (e.target === this) {
            $('#lightbox').removeClass('active');
        }
    });

    // Keyboard navigation
    $(document).keydown(function (e) {
        if ($('#lightbox').hasClass('active')) {
            if (e.keyCode === 27) { // Escape key
                $('#lightbox').removeClass('active');
            }
        }
    });
}

// Open video modal
function openVideoModal(videoSrc) {
    // Create video modal if it doesn't exist
    if ($('#videoModal').length === 0) {
        $('body').append(`
            <div class="modal fade" id="videoModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">วิดีโอแนะนำ</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <video id="modalVideo" controls style="width: 100%; height: auto;">
                                <source src="" type="video/mp4">
                                เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    // Set video source and show modal
    $('#modalVideo source').attr('src', videoSrc);
    $('#modalVideo')[0].load();
    $('#videoModal').modal('show');

    // Pause video when modal is closed
    $('#videoModal').on('hidden.bs.modal', function () {
        $('#modalVideo')[0].pause();
    });
}
//Initialize mobile-specific features
function initializeMobileFeatures() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile || isTouchDevice) {
        document.body.classList.add('mobile-device');

        // Initialize touch-friendly navigation
        initializeMobileNavigation();

        // Initialize touch gestures for carousel
        initializeTouchCarousel();

        // Initialize mobile-optimized gallery
        initializeMobileGallery();

        // Optimize viewport for mobile
        optimizeMobileViewport();
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);

    // Handle resize events with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
}

// Initialize mobile navigation enhancements
function initializeMobileNavigation() {
    // Auto-close mobile menu when clicking outside
    $(document).on('click', function (e) {
        const navbar = $('.navbar-collapse');
        const toggler = $('.navbar-toggler');

        if (!navbar.is(e.target) && navbar.has(e.target).length === 0 &&
            !toggler.is(e.target) && toggler.has(e.target).length === 0) {
            navbar.collapse('hide');
        }
    });

    // Close mobile menu when clicking on nav links
    $('.navbar-nav .nav-link').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });

    // Add smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 500);
        }
    });

    // Enhance navbar scroll behavior on mobile
    let lastScrollTop = 0;
    const navbar = $('.navbar');

    $(window).scroll(function () {
        const scrollTop = $(this).scrollTop();

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.addClass('navbar-hidden');
        } else {
            // Scrolling up - show navbar
            navbar.removeClass('navbar-hidden');
        }

        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }

        lastScrollTop = scrollTop;
    });
}

// Initialize touch gestures for carousel
function initializeTouchCarousel() {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    $('.carousel').on('touchstart', function (e) {
        startX = e.originalEvent.touches[0].clientX;
        startY = e.originalEvent.touches[0].clientY;
        isScrolling = false;
    });

    $('.carousel').on('touchmove', function (e) {
        if (!startX || !startY) return;

        const currentX = e.originalEvent.touches[0].clientX;
        const currentY = e.originalEvent.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe detected
            isScrolling = false;
            e.preventDefault();
        } else {
            // Vertical scroll detected
            isScrolling = true;
        }
    });

    $('.carousel').on('touchend', function (e) {
        if (isScrolling || !startX) return;

        const endX = e.originalEvent.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe left - next slide
                $(this).carousel('next');
            } else {
                // Swipe right - previous slide
                $(this).carousel('prev');
            }
        }

        startX = 0;
        startY = 0;
    });
}

// Initialize mobile-optimized gallery
function initializeMobileGallery() {
    // Add touch feedback for gallery items
    $('.gallery-item').on('touchstart', function () {
        $(this).addClass('touch-active');
    });

    $('.gallery-item').on('touchend touchcancel', function () {
        $(this).removeClass('touch-active');
    });

    // Optimize gallery loading for mobile
    const galleryItems = $('.gallery-item img');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    galleryItems.each(function () {
        observer.observe(this);
    });
}

// Optimize mobile viewport
function optimizeMobileViewport() {
    // Prevent zoom on input focus (iOS)
    $('input, select, textarea').on('focus', function () {
        $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    });

    $('input, select, textarea').on('blur', function () {
        $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0');
    });

    // Handle iOS Safari viewport height issues
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
}

// Handle orientation changes
function handleOrientationChange() {
    // Delay to allow for orientation change to complete
    setTimeout(() => {
        // Recalculate carousel heights
        $('.carousel-item img').each(function () {
            const $img = $(this);
            const aspectRatio = $img.data('aspect-ratio') || (16 / 9);
            const containerWidth = $img.parent().width();
            const newHeight = Math.min(containerWidth / aspectRatio, window.innerHeight * 0.6);
            $img.css('height', newHeight + 'px');
        });

        // Refresh gallery layout
        if (typeof refreshGalleryLayout === 'function') {
            refreshGalleryLayout();
        }

        // Update viewport calculations
        if (document.body.classList.contains('mobile-device')) {
            optimizeMobileViewport();
        }
    }, 500);
}

// Handle resize events
function handleResize() {
    const windowWidth = $(window).width();

    // Update breakpoint classes
    document.body.classList.remove('mobile', 'tablet', 'desktop');
    if (windowWidth < 768) {
        document.body.classList.add('mobile');
    } else if (windowWidth < 1200) {
        document.body.classList.add('tablet');
    } else {
        document.body.classList.add('desktop');
    }

    // Recalculate responsive elements
    recalculateResponsiveElements();
}

// Recalculate responsive elements
function recalculateResponsiveElements() {
    // Update carousel heights
    $('.carousel-item img').each(function () {
        const $img = $(this);
        const windowWidth = $(window).width();
        let height;

        if (windowWidth < 414) {
            height = 200;
        } else if (windowWidth < 768) {
            height = 250;
        } else if (windowWidth < 992) {
            height = 350;
        } else if (windowWidth < 1200) {
            height = 450;
        } else {
            height = 500;
        }

        $img.css('height', height + 'px');
    });

    // Update gallery grid
    const galleryGrid = $('.gallery-grid');
    if (galleryGrid.length) {
        const windowWidth = $(window).width();
        let columns;

        if (windowWidth < 768) {
            columns = 1;
        } else if (windowWidth < 992) {
            columns = 2;
        } else if (windowWidth < 1200) {
            columns = 3;
        } else {
            columns = 4;
        }

        galleryGrid.css('grid-template-columns', `repeat(${columns}, 1fr)`);
    }
}

// Initialize responsive image handling
function initializeResponsiveImages() {
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadResponsiveImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe all images with data-src attribute
    $('img[data-src]').each(function () {
        imageObserver.observe(this);
    });

    // Progressive image loading
    $('.progressive-image').each(function () {
        const container = $(this);
        const lowRes = container.find('.image-low-res');
        const highRes = container.find('.image-high-res');

        if (highRes.length) {
            const highResImg = new Image();
            highResImg.onload = function () {
                highRes.attr('src', this.src);
                container.addClass('loaded');
            };
            highResImg.src = highRes.data('src');
        }
    });
}

// Load responsive image based on device capabilities
function loadResponsiveImage(img) {
    const $img = $(img);
    const baseSrc = $img.data('src');
    const windowWidth = $(window).width();
    const devicePixelRatio = window.devicePixelRatio || 1;

    if (!baseSrc) return;

    // Add loading class
    $img.addClass('loading');

    // Determine appropriate image size
    let imageSize = 'medium';
    if (windowWidth < 768) {
        imageSize = devicePixelRatio > 1 ? 'medium' : 'small';
    } else if (windowWidth < 1200) {
        imageSize = devicePixelRatio > 1 ? 'large' : 'medium';
    } else {
        imageSize = devicePixelRatio > 1 ? 'xlarge' : 'large';
    }

    // Load the image
    const newImg = new Image();
    newImg.onload = function () {
        $img.attr('src', this.src);
        $img.removeClass('loading').addClass('loaded');
    };

    newImg.onerror = function () {
        // Fallback to original src
        $img.attr('src', baseSrc);
        $img.removeClass('loading').addClass('loaded');
    };

    // Try to load size-specific image, fallback to original
    const sizeSrc = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, `_${imageSize}.$1`);
    newImg.src = sizeSrc;
}

// Add CSS for mobile navigation hiding
const mobileNavCSS = `
    .navbar-hidden {
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }
    
    .touch-active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
    
    @media (max-width: 767px) {
        .navbar {
            transition: transform 0.3s ease;
        }
    }
`;

// Inject mobile-specific CSS
if (!document.getElementById('mobile-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'mobile-nav-styles';
    style.textContent = mobileNavCSS;
    document.head.appendChild(style);
}
// Initialize interactive elements and animations
function initializeInteractiveElements() {
    // Initialize scroll-triggered animations
    initializeScrollAnimations();

    // Initialize loading states
    initializeLoadingStates();

    // Initialize hover effects
    initializeHoverEffects();

    // Initialize smooth scrolling
    initializeSmoothScrolling();

    // Initialize interactive buttons
    initializeInteractiveButtons();

    // Initialize content animations
    initializeContentAnimations();

    // Initialize visual feedback
    initializeVisualFeedback();
}

// Initialize scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add animation classes based on element type
                if (element.classList.contains('scroll-animate')) {
                    element.classList.add('in-view');
                }

                if (element.classList.contains('stagger-animation')) {
                    element.classList.add('animate-in');
                }

                if (element.classList.contains('fade-in-up')) {
                    element.style.animationDelay = '0s';
                    element.style.animationFillMode = 'forwards';
                }

                // Unobserve after animation
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    $('.scroll-animate, .stagger-animation, .fade-in-up').each(function () {
        animationObserver.observe(this);
    });

    // Timeline animations for history page
    $('.timeline-item').each(function (index) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 200);
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        timelineObserver.observe(this);
    });
}

// Initialize loading states and skeleton screens
function initializeLoadingStates() {
    // Show loading state for content sections
    function showLoadingState(container, type = 'default') {
        const skeletonHTML = generateSkeletonHTML(type);
        $(container).html(skeletonHTML).addClass('loading-state');
    }

    // Hide loading state and show content
    function hideLoadingState(container, content) {
        $(container).removeClass('loading-state').html(content);
        $(container).find('.content-loading').addClass('content-loaded');
    }

    // Generate skeleton HTML based on type
    function generateSkeletonHTML(type) {
        switch (type) {
            case 'card':
                return `
                    <div class="skeleton-card">
                        <div class="skeleton skeleton-image"></div>
                        <div class="skeleton skeleton-text large"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text small"></div>
                    </div>
                `;
            case 'list':
                return Array(5).fill().map(() => `
                    <div class="skeleton-card mb-3">
                        <div class="skeleton skeleton-text large"></div>
                        <div class="skeleton skeleton-text"></div>
                    </div>
                `).join('');
            default:
                return `
                    <div class="skeleton-card">
                        <div class="skeleton skeleton-text large"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text small"></div>
                    </div>
                `;
        }
    }

    // Expose functions globally
    window.showLoadingState = showLoadingState;
    window.hideLoadingState = hideLoadingState;
}

// Initialize enhanced hover effects
function initializeHoverEffects() {
    // Add hover classes to interactive elements
    $('.service-card, .featured-card, .gallery-item').addClass('hover-lift card-interactive');
    $('.btn-primary, .btn-secondary').addClass('btn-animated ripple');
    $('.navbar-brand, .nav-link').addClass('hover-glow');

    // Parallax effect for hero sections
    $(window).scroll(function () {
        const scrolled = $(this).scrollTop();
        const parallaxElements = $('.parallax-bg');

        parallaxElements.each(function () {
            const speed = $(this).data('speed') || 0.5;
            const yPos = -(scrolled * speed);
            $(this).css('transform', `translateY(${yPos}px)`);
        });
    });

    // Enhanced card hover effects
    $('.card-interactive').on('mouseenter', function () {
        $(this).addClass('card-hover');
    }).on('mouseleave', function () {
        $(this).removeClass('card-hover');
    });

    // Image hover effects
    $('.gallery-item img').on('mouseenter', function () {
        $(this).parent().addClass('hover-scale');
    }).on('mouseleave', function () {
        $(this).parent().removeClass('hover-scale');
    });
}

// Initialize smooth scrolling enhancements
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));

        if (target.length) {
            const offset = $('.navbar').outerHeight() || 0;
            $('html, body').animate({
                scrollTop: target.offset().top - offset - 20
            }, 800, 'easeInOutCubic');
        }
    });

    // Add easing function
    $.easing.easeInOutCubic = function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };

    // Smooth scroll to top button
    const scrollToTopBtn = $(`
        <button class="scroll-to-top btn btn-primary" title="กลับไปด้านบน">
            <i class="fas fa-chevron-up"></i>
        </button>
    `);

    $('body').append(scrollToTopBtn);

    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            scrollToTopBtn.addClass('show');
        } else {
            scrollToTopBtn.removeClass('show');
        }
    });

    scrollToTopBtn.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 800, 'easeInOutCubic');
    });
}

// Initialize interactive buttons
function initializeInteractiveButtons() {
    // Ripple effect for buttons
    $('.ripple').on('click', function (e) {
        const button = $(this);
        const rect = this.getBoundingClientRect();
        const ripple = $('<span class="ripple-effect"></span>');

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.css({
            width: size,
            height: size,
            left: x,
            top: y
        });

        button.append(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Button loading states
    function setButtonLoading(button, loading = true) {
        const $btn = $(button);
        if (loading) {
            $btn.prop('disabled', true)
                .data('original-text', $btn.html())
                .html('<span class="spinner spinner-small"></span> กำลังโหลด...');
        } else {
            $btn.prop('disabled', false)
                .html($btn.data('original-text'));
        }
    }

    // Expose function globally
    window.setButtonLoading = setButtonLoading;

    // Enhanced form interactions
    $('.form-control').on('focus', function () {
        $(this).parent().addClass('form-group-focused');
    }).on('blur', function () {
        $(this).parent().removeClass('form-group-focused');
        if ($(this).val()) {
            $(this).parent().addClass('form-group-filled');
        } else {
            $(this).parent().removeClass('form-group-filled');
        }
    });
}

// Initialize content animations
function initializeContentAnimations() {
    // Typewriter effect for hero titles
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Animate counters
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // Initialize counters when they come into view
    $('.stat-item h4').each(function () {
        const counter = this;
        const target = parseInt($(this).text().replace(/,/g, ''));

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(counter);
    });

    // Progress bar animations
    $('.progress-bar-animated').each(function () {
        const progressBar = this;
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(progressBar).addClass('animate');
                    progressObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        progressObserver.observe(progressBar);
    });

    // Staggered animations for card grids
    $('.service-card, .featured-card').each(function (index) {
        $(this).addClass('stagger-animation');
        $(this).css('animation-delay', `${index * 0.1}s`);
    });
}

// Initialize visual feedback
function initializeVisualFeedback() {
    // Toast notifications
    function showToast(message, type = 'info', duration = 3000) {
        const toast = $(`
            <div class="toast-notification toast-${type}">
                <div class="toast-content">
                    <i class="fas fa-${getToastIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `);

        $('body').append(toast);

        setTimeout(() => {
            toast.addClass('show');
        }, 100);

        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);

        toast.find('.toast-close').on('click', function () {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    function getToastIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // Expose toast function globally
    window.showToast = showToast;

    // Loading overlay
    function showLoadingOverlay(message = 'กำลังโหลด...') {
        const overlay = $(`
            <div class="loading-overlay">
                <div class="loading-content">
                    <div class="spinner spinner-large"></div>
                    <p>${message}</p>
                </div>
            </div>
        `);

        $('body').append(overlay);
        setTimeout(() => overlay.addClass('show'), 100);

        return overlay;
    }

    function hideLoadingOverlay(overlay) {
        overlay.removeClass('show');
        setTimeout(() => overlay.remove(), 300);
    }

    // Expose loading overlay functions globally
    window.showLoadingOverlay = showLoadingOverlay;
    window.hideLoadingOverlay = hideLoadingOverlay;

    // Form validation feedback
    $('.form-control').on('input', function () {
        const input = $(this);
        const value = input.val();
        const type = input.attr('type');

        // Remove previous validation classes
        input.removeClass('is-valid is-invalid');

        // Basic validation
        let isValid = true;
        if (input.prop('required') && !value) {
            isValid = false;
        }

        if (type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
        }

        // Add validation class
        input.addClass(isValid ? 'is-valid' : 'is-invalid');
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Add CSS for interactive elements and animations
const interactiveCSS = `
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .scroll-to-top.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .scroll-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9999;
        min-width: 300px;
    }
    
    .toast-notification.show {
        transform: translateX(0);
    }
    
    .toast-notification.toast-success {
        border-left: 4px solid #28a745;
    }
    
    .toast-notification.toast-error {
        border-left: 4px solid #dc3545;
    }
    
    .toast-notification.toast-warning {
        border-left: 4px solid #ffc107;
    }
    
    .toast-notification.toast-info {
        border-left: 4px solid #17a2b8;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .toast-close:hover {
        background-color: #f8f9fa;
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .loading-overlay.show {
        opacity: 1;
        visibility: visible;
    }
    
    .loading-content {
        text-align: center;
        color: white;
    }
    
    .loading-content p {
        margin-top: 1rem;
        font-size: 1.1rem;
    }
    
    .form-group-focused .form-control {
        border-color: var(--primary-green);
        box-shadow: 0 0 0 0.2rem rgba(45, 80, 22, 0.25);
    }
    
    .form-control.is-valid {
        border-color: #28a745;
    }
    
    .form-control.is-invalid {
        border-color: #dc3545;
    }
    
    @media (max-width: 767px) {
        .toast-notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
        
        .scroll-to-top {
            bottom: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
        }
    }
`;

// Inject interactive CSS
if (!document.getElementById('interactive-styles')) {
    const style = document.createElement('style');
    style.id = 'interactive-styles';
    style.textContent = interactiveCSS;
    document.head.appendChild(style);
}
// Render homepage services
function renderHomepageServices(data) {
    if (!data.services || data.services.length === 0) return;

    const servicesHTML = data.services.map(service => `
        <div class="col-md-4">
            <div class="service-card">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h4>${service.title}</h4>
                <p>${service.description}</p>
            </div>
        </div>
    `).join('');

    $('#homepage-services').html(`<div class="row">${servicesHTML}</div>`);
}

// Render homepage featured content
function renderHomepageFeatured(data) {
    if (!data.featured || data.featured.length === 0) return;

    const featuredHTML = data.featured.map(item => `
        <div class="col-md-3">
            <div class="featured-card">
                <img src="${item.image}" alt="${item.title}" class="img-fluid">
                <div class="featured-content">
                    <h5>${item.title}</h5>
                    <p>${item.description}</p>
                    ${item.link ? `<a href="${item.link}" class="btn btn-primary btn-sm">ดูเพิ่มเติม</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    $('#homepage-featured').html(`<div class="row">${featuredHTML}</div>`);
}

// Render homepage updates
function renderHomepageUpdates(data) {
    if (!data.updates || data.updates.length === 0) return;

    const updatesHTML = data.updates.map(update => `
        <tr>
            <td>${update.date}</td>
            <td>${update.title}</td>
        </tr>
    `).join('');

    $('#homepage-updates').html(`
        <table class="table">
            <thead>
                <tr>
                    <th>วันที่</th>
                    <th>ข่าวสาร</th>
                </tr>
            </thead>
            <tbody>
                ${updatesHTML}
            </tbody>
        </table>
    `);
}

// Render homepage gallery
function renderHomepageGallery(data) {
    if (!data.images || data.images.length === 0) return;

    const galleryHTML = data.images.map(image => `
        <div class="col-md-3">
            <div class="gallery-item">
                <img src="${image.src}" alt="${image.title}" class="img-fluid" 
                     data-bs-toggle="modal" data-bs-target="#imageModal"
                     data-image-src="${image.src}" data-image-title="${image.title}">
            </div>
        </div>
    `).join('');

    $('#homepage-gallery').html(`<div class="row">${galleryHTML}</div>`);
}

// Initialize advanced interactive features
function initializeAdvancedInteractiveFeatures() {
    // Wait for interactive features to be available
    if (typeof window.interactiveFeatures !== 'undefined') {
        console.log('Advanced interactive features initialized');

        // Add scroll animations to existing elements
        addScrollAnimationsToContent();

        // Initialize lightbox for gallery images
        initializeLightboxForGalleries();

        // Add enhanced form interactions
        enhanceExistingForms();

        // Initialize page transition effects
        initializePageTransitions();

        // Add parallax effects to hero sections
        addParallaxEffects();

    } else {
        // Retry after a short delay if interactive features aren't loaded yet
        setTimeout(initializeAdvancedInteractiveFeatures, 100);
    }
}

// Add scroll animations to content elements
function addScrollAnimationsToContent() {
    // Add scroll reveal to service cards
    $('.service-card').each(function (index) {
        $(this).addClass('scroll-reveal');
        $(this).css('transition-delay', (index * 0.1) + 's');
    });

    // Add scroll reveal to featured cards
    $('.featured-card').each(function (index) {
        $(this).addClass('scroll-reveal-scale');
        $(this).css('transition-delay', (index * 0.15) + 's');
    });

    // Add scroll reveal to timeline items
    $('.timeline-item').each(function (index) {
        const isLeft = index % 2 === 0;
        $(this).addClass(isLeft ? 'scroll-reveal-left' : 'scroll-reveal-right');
        $(this).css('transition-delay', (index * 0.2) + 's');
    });

    // Add scroll reveal to gallery items
    $('.gallery-item').each(function (index) {
        $(this).addClass('scroll-reveal-scale');
        $(this).css('transition-delay', (index * 0.1) + 's');
    });

    // Add scroll reveal to news cards
    $('.news-card').each(function (index) {
        $(this).addClass('scroll-reveal');
        $(this).css('transition-delay', (index * 0.1) + 's');
    });
}

// Initialize lightbox for gallery images
function initializeLightboxForGalleries() {
    // Add lightbox functionality to gallery images
    $('.gallery-item img, .history-image, [data-lightbox]').each(function () {
        $(this).css('cursor', 'pointer');
        $(this).attr('data-lightbox', 'gallery');

        // Add click event for lightbox
        $(this).on('click', function (e) {
            e.preventDefault();

            const imageSrc = $(this).attr('src');
            const imageAlt = $(this).attr('alt') || '';
            const imageCaption = $(this).attr('data-caption') || imageAlt;

            // Create gallery array from container
            const container = $(this).closest('.gallery-grid, .history-timeline, [data-gallery]');
            let gallery = [];

            if (container.length > 0) {
                container.find('img').each(function () {
                    gallery.push({
                        src: $(this).attr('src'),
                        alt: $(this).attr('alt') || '',
                        caption: $(this).attr('data-caption') || $(this).attr('alt') || ''
                    });
                });
            }

            if (window.interactiveFeatures && window.interactiveFeatures.openLightbox) {
                window.interactiveFeatures.openLightbox(imageSrc, imageAlt, imageCaption, gallery);
            }
        });
    });
}

// Enhance existing forms with interactive features
function enhanceExistingForms() {
    $('form').each(function () {
        const form = $(this);

        // Add floating label classes to form groups
        form.find('.form-group').each(function () {
            const formGroup = $(this);
            const input = formGroup.find('input, textarea, select');
            const label = formGroup.find('label');

            if (input.length && label.length) {
                formGroup.addClass('form-floating-label');

                // Add validation icons
                if (!formGroup.find('.form-validation-icon').length) {
                    formGroup.append(`
                        <i class="fas fa-check form-validation-icon success"></i>
                        <i class="fas fa-times form-validation-icon error"></i>
                    `);
                }
            }
        });

        // Add interactive button classes
        form.find('.btn').addClass('btn-interactive');
    });
}

// Initialize page transitions
function initializePageTransitions() {
    // Add transition effects to navigation links
    $('a[href$=".html"], .navbar-nav .nav-link').on('click', function (e) {
        const href = $(this).attr('href');

        // Only apply transitions to internal links
        if (href && href.indexOf('http') !== 0 && href !== '#') {
            e.preventDefault();

            if (window.interactiveFeatures && window.interactiveFeatures.navigateWithTransition) {
                window.interactiveFeatures.navigateWithTransition(href);
            } else {
                // Fallback to normal navigation
                window.location.href = href;
            }
        }
    });

    // Hide page transition on load
    $(window).on('load', function () {
        if (window.interactiveFeatures && window.interactiveFeatures.hidePageTransition) {
            window.interactiveFeatures.hidePageTransition();
        }
    });
}

// Add parallax effects to hero sections
function addParallaxEffects() {
    // Add parallax to carousel images
    $('.carousel-item img').each(function () {
        $(this).addClass('parallax-element');
        $(this).attr('data-speed', '0.3');
    });

    // Add parallax to hero sections
    $('.hero-image img, .history-hero img').each(function () {
        $(this).addClass('parallax-element');
        $(this).attr('data-speed', '0.2');
    });

    // Add parallax to background elements
    $('.services-section, .featured-section').each(function () {
        $(this).addClass('parallax-element');
        $(this).attr('data-speed', '0.1');
    });
}

// Enhanced content loading with animations
function loadContentWithAnimation(selector, content) {
    const container = $(selector);

    // Add loading animation
    container.addClass('content-loading');

    // Load content
    container.html(content);

    // Trigger loaded animation
    setTimeout(() => {
        container.removeClass('content-loading').addClass('content-loaded');

        // Re-initialize interactive features for new content
        if (window.interactiveFeatures) {
            window.interactiveFeatures.initializeGalleryLightbox();
            window.interactiveFeatures.addScrollAnimationsToElements();
        }

        // Trigger content loaded event
        $(document).trigger('contentLoaded');
    }, 100);
}

// Enhanced error display with notifications
function showErrorWithNotification(selector, message) {
    showError(selector, message);

    // Show notification if available
    if (window.interactiveFeatures && window.interactiveFeatures.showNotification) {
        window.interactiveFeatures.showNotification('error', 'ข้อผิดพลาด', message);
    }
}

// Enhanced success display with notifications
function showSuccessWithNotification(message) {
    if (window.interactiveFeatures && window.interactiveFeatures.showNotification) {
        window.interactiveFeatures.showNotification('success', 'สำเร็จ', message);
    }
}

// Update existing content loading functions to use animations
const originalLoadHomepageServices = loadHomepageServices;
if (typeof loadHomepageServices === 'function') {
    loadHomepageServices = function () {
        $.getJSON('data/homepage-services.json')
            .done(function (data) {
                const content = renderHomepageServices(data);
                loadContentWithAnimation('#services-section', content);
            })
            .fail(function () {
                showErrorWithNotification('#services-section', 'ไม่สามารถโหลดข้อมูลบริการได้');
            });
    };
}

// Add smooth scrolling for anchor links
$(document).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault();

    const target = $($(this).attr('href'));
    if (target.length) {
        $('html, body').animate({
            scrollTop: target.offset().top - 100
        }, 800, 'easeInOutCubic');
    }
});

// Add easing function for smooth scrolling
$.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

// Initialize enhanced interactions when document is ready
$(document).ready(function () {
    // Add stagger animation to initial content
    $('.service-card, .featured-card, .news-card').addClass('stagger-animation');

    // Trigger stagger animations
    setTimeout(() => {
        $('.stagger-animation').addClass('animate-in');
    }, 500);

    // Add hover effects to interactive elements
    $('.card, .btn, .nav-link').addClass('hover-lift');

    // Add glow effects to special elements
    $('.carousel-item, .hero-section').addClass('hover-glow');

    // Initialize floating animations for decorative elements
    $('.navbar-brand i, .service-icon i').addClass('float-animation');
});

// Handle window resize for responsive interactive features
$(window).on('resize', function () {
    // Reinitialize parallax effects on resize
    if (window.interactiveFeatures) {
        window.interactiveFeatures.initializeParallaxEffects();
    }
});

// Handle visibility change for performance optimization
$(document).on('visibilitychange', function () {
    if (document.hidden) {
        // Pause animations when page is not visible
        $('body').addClass('page-hidden');
    } else {
        // Resume animations when page becomes visible
        $('body').removeClass('page-hidden');
    }
});
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
    insertTarget.insertAdjacentHTML('afterend', errorMessageHTML);
}

// Enhanced image loading with fallbacks for all content
function loadHomepageContent() {
    loadHomepageServices();
    loadHomepageFeatured();
    loadHomepageGallery();
    loadHomepageUpdates();
}

// Load homepage services with error handling
function loadHomepageServices() {
    $.getJSON('data/homepage-services.json')
        .done(function (data) {
            if (data && data.services) {
                renderHomepageServices(data);
            } else {
                renderFallbackServices();
            }
        })
        .fail(function () {
            console.error('Failed to load homepage services data');
            renderFallbackServices();
        });
}

// Render homepage services with image fallbacks
function renderHomepageServices(data) {
    if (!data.services || data.services.length === 0) {
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
                    ${data.services.map(service => `
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="service-card h-100">
                                <div class="service-icon">
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
                        <div class="service-card h-100">
                            <div class="service-icon">
                                <i class="fas fa-swimming-pool"></i>
                            </div>
                            <h4>กิจกรรมน้ำ</h4>
                            <p>เล่นน้ำและกิจกรรมริมอ่างเก็บน้ำ</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100">
                            <div class="service-icon">
                                <i class="fas fa-campground"></i>
                            </div>
                            <h4>แคมป์ปิ้ง</h4>
                            <p>พื้นที่กางเต็นท์และพักค้างคืน</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="service-card h-100">
                            <div class="service-icon">
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

// Load homepage featured content with enhanced image handling
function loadHomepageFeatured() {
    $.getJSON('data/homepage-featured.json')
        .done(function (data) {
            if (data && data.featuredContent) {
                renderHomepageFeatured(data);
            } else {
                renderFallbackFeatured();
            }
        })
        .fail(function () {
            console.error('Failed to load homepage featured data');
            renderFallbackFeatured();
        });
}

// Render homepage featured content with image fallbacks
function renderHomepageFeatured(data) {
    if (!data.featuredContent || data.featuredContent.length === 0) {
        renderFallbackFeatured();
        return;
    }

    const featuredHTML = `
        <section class="featured-section py-5 bg-light">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="section-title">${data.section?.title || 'สิ่งที่น่าสนใจ'}</h2>
                        <p class="section-subtitle">${data.section?.subtitle || 'ค้นพบสิ่งใหม่ๆ และกิจกรรมที่น่าตื่นเต้น'}</p>
                    </div>
                </div>
                <div class="row">
                    ${data.featuredContent.map(item => {
        const imageSrc = item.image ||
            (typeof errorHandler !== 'undefined' ?
                errorHandler.fallbackImages.get('featured') :
                'data:image/svg+xml;base64,' + btoa(`
                                    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="100%" height="100%" fill="#ff6b6b"/>
                                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="24">
                                            ${item.title || 'เนื้อหาเด่น'}
                                        </text>
                                    </svg>
                                `)
            );

        return `
                            <div class="col-lg-3 col-md-6 mb-4">
                                <div class="featured-card h-100">
                                    <div class="featured-image">
                                        <img src="${imageSrc}" 
                                             class="img-fluid featured-image" 
                                             alt="${item.title || 'เนื้อหาเด่น'}"
                                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div class="image-fallback" style="display:none; height:200px; background:#ff6b6b; align-items:center; justify-content:center; color:white;">
                                            <div class="text-center">
                                                <i class="fas fa-star fa-2x mb-2"></i>
                                                <h6>${item.title || 'เนื้อหาเด่น'}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="featured-content">
                                        <h5>${item.title || 'ไม่มีหัวข้อ'}</h5>
                                        <p>${item.description || 'ไม่มีคำอธิบาย'}</p>
                                        ${item.link ? `
                                            <a href="${item.link}" class="btn btn-outline-primary btn-sm">
                                                ดูเพิ่มเติม <i class="fas fa-arrow-right"></i>
                                            </a>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
        </section>
    `;

    $('#featured-content').html(featuredHTML);
}

// Render fallback featured content
function renderFallbackFeatured() {
    const fallbackFeaturedHTML = `
        <section class="featured-section py-5 bg-light">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="section-title">สิ่งที่น่าสนใจ</h2>
                        <p class="section-subtitle">ค้นพบสิ่งใหม่ๆ และกิจกรรมที่น่าตื่นเต้น</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="featured-card h-100">
                            <div class="image-fallback" style="height:200px; background:#ff6b6b; display:flex; align-items:center; justify-content:center; color:white;">
                                <div class="text-center">
                                    <i class="fas fa-camera fa-2x mb-2"></i>
                                    <h6>จุดถ่ายภาพ</h6>
                                </div>
                            </div>
                            <div class="featured-content">
                                <h5>จุดถ่ายภาพสวยงาม</h5>
                                <p>มุมถ่ายภาพที่สวยงามทั่วบริเวณห้วยตึงเฒ่า</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="featured-card h-100">
                            <div class="image-fallback" style="height:200px; background:#50c878; display:flex; align-items:center; justify-content:center; color:white;">
                                <div class="text-center">
                                    <i class="fas fa-leaf fa-2x mb-2"></i>
                                    <h6>ธรรมชาติ</h6>
                                </div>
                            </div>
                            <div class="featured-content">
                                <h5>ธรรมชาติสวยงาม</h5>
                                <p>สัมผัสธรรมชาติและอากาศบริสุทธิ์</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="featured-card h-100">
                            <div class="image-fallback" style="height:200px; background:#4a90e2; display:flex; align-items:center; justify-content:center; color:white;">
                                <div class="text-center">
                                    <i class="fas fa-water fa-2x mb-2"></i>
                                    <h6>กิจกรรมน้ำ</h6>
                                </div>
                            </div>
                            <div class="featured-content">
                                <h5>กิจกรรมน้ำ</h5>
                                <p>เล่นน้ำและกิจกรรมสนุกสนานริมอ่างเก็บน้ำ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="featured-card h-100">
                            <div class="image-fallback" style="height:200px; background:#ffa500; display:flex; align-items:center; justify-content:center; color:white;">
                                <div class="text-center">
                                    <i class="fas fa-utensils fa-2x mb-2"></i>
                                    <h6>อาหาร</h6>
                                </div>
                            </div>
                            <div class="featured-content">
                                <h5>อาหารท้องถิ่น</h5>
                                <p>ลิ้มรสอาหารท้องถิ่นและของดีเชียงใหม่</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    $('#featured-content').html(fallbackFeaturedHTML);
}

// Load homepage gallery with enhanced image handling
function loadHomepageGallery() {
    $.getJSON('data/homepage-gallery.json')
        .done(function (data) {
            if (data && data.gallery && data.gallery.images) {
                renderHomepageGallery(data);
            } else {
                renderFallbackGallery();
            }
        })
        .fail(function () {
            console.error('Failed to load homepage gallery data');
            renderFallbackGallery();
        });
}

// Render homepage gallery with image fallbacks
function renderHomepageGallery(data) {
    const gallery = data.gallery;
    if (!gallery.images || gallery.images.length === 0) {
        renderFallbackGallery();
        return;
    }

    const galleryHTML = `
        <section class="gallery-section py-5">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="section-title">${gallery.title || 'ประมวลภาพ'}</h2>
                        <p class="section-subtitle">${gallery.subtitle || 'ชมภาพบรรยากาศและกิจกรรมต่างๆ'}</p>
                    </div>
                </div>
                <div class="row gallery-grid">
                    ${gallery.images.slice(0, 6).map(image => {
        const imageSrc = image.src || image.thumbnail ||
            (typeof errorHandler !== 'undefined' ?
                errorHandler.fallbackImages.get('gallery') :
                'data:image/svg+xml;base64,' + btoa(`
                                    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="100%" height="100%" fill="#50c878"/>
                                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="18">
                                            ${image.title || 'ภาพ'}
                                        </text>
                                    </svg>
                                `)
            );

        return `
                            <div class="col-lg-4 col-md-6 mb-4">
                                <div class="gallery-item">
                                    <img src="${imageSrc}" 
                                         class="img-fluid gallery-image" 
                                         alt="${image.alt || image.title || 'ภาพประกอบ'}"
                                         data-caption="${image.description || image.title || ''}"
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="image-fallback" style="display:none; height:250px; background:#50c878; align-items:center; justify-content:center; color:white;">
                                        <div class="text-center">
                                            <i class="fas fa-image fa-2x mb-2"></i>
                                            <h6>${image.title || 'ภาพ'}</h6>
                                        </div>
                                    </div>
                                    <div class="gallery-overlay">
                                        <div class="gallery-content">
                                            <h5>${image.title || ''}</h5>
                                            <p>${image.description || ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>
                ${gallery.viewAllLink ? `
                    <div class="text-center mt-4">
                        <a href="${gallery.viewAllLink}" class="btn btn-primary">
                            ดูภาพทั้งหมด <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                ` : ''}
            </div>
        </section>
    `;

    $('#gallery-section').html(galleryHTML);
}

// Render fallback gallery
function renderFallbackGallery() {
    const fallbackGalleryHTML = `
        <section class="gallery-section py-5">
            <div class="container">
                <div class="row text-center mb-5">
                    <div class="col-12">
                        <h2 class="section-title">ประมวลภาพ</h2>
                        <p class="section-subtitle">ชมภาพบรรยากาศและกิจกรรมต่างๆ ที่ห้วยตึงเฒ่า</p>
                    </div>
                </div>
                <div class="row gallery-grid">
                    ${Array.from({ length: 6 }, (_, index) => `
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="gallery-item">
                                <div class="image-fallback" style="height:250px; background:#50c878; display:flex; align-items:center; justify-content:center; color:white;">
                                    <div class="text-center">
                                        <i class="fas fa-image fa-2x mb-2"></i>
                                        <h6>ภาพที่ ${index + 1}</h6>
                                    </div>
                                </div>
                                <div class="gallery-overlay">
                                    <div class="gallery-content">
                                        <h5>ภาพประกอบ ${index + 1}</h5>
                                        <p>ภาพบรรยากาศที่ห้วยตึงเฒ่า</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;

    $('#gallery-section').html(fallbackGalleryHTML);
}

// Load homepage updates with error handling
function loadHomepageUpdates() {
    $.getJSON('data/homepage-updates.json')
        .done(function (data) {
            if (data && data.updates) {
                renderHomepageUpdates(data);
            } else {
                renderFallbackUpdates();
            }
        })
        .fail(function () {
            console.error('Failed to load homepage updates data');
            renderFallbackUpdates();
        });
}

// Render homepage updates
function renderHomepageUpdates(data) {
    if (!data.updates || data.updates.length === 0) {
        renderFallbackUpdates();
        return;
    }

    const updatesHTML = `
        <section class="updates-section py-5 bg-light">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h3 class="section-title text-center mb-4">ข่าวสารและอัปเดต</h3>
                        <div class="updates-list">
                            ${data.updates.slice(0, 5).map(update => `
                                <div class="update-item">
                                    <div class="update-date">${update.date || 'ไม่ระบุวันที่'}</div>
                                    <div class="update-content">
                                        <h5>${update.title || 'ไม่มีหัวข้อ'}</h5>
                                        <p>${update.content || 'ไม่มีเนื้อหา'}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    $('#news-updates').html(updatesHTML);
}

// Render fallback updates
function renderFallbackUpdates() {
    const fallbackUpdatesHTML = `
        <section class="updates-section py-5 bg-light">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h3 class="section-title text-center mb-4">ข่าวสารและอัปเดต</h3>
                        <div class="updates-list">
                            <div class="update-item">
                                <div class="update-date">${new Date().toLocaleDateString('th-TH')}</div>
                                <div class="update-content">
                                    <h5>ยินดีต้อนรับสู่ห้วยตึงเฒ่า</h5>
                                    <p>สถานที่ท่องเที่ยวเชิงนิเวศที่สวยงามในจังหวัดเชียงใหม่</p>
                                </div>
                            </div>
                            <div class="update-item">
                                <div class="update-date">${new Date().toLocaleDateString('th-TH')}</div>
                                <div class="update-content">
                                    <h5>บริการและสิ่งอำนวยความสะดวก</h5>
                                    <p>พร้อมให้บริการนักท่องเที่ยวด้วยสิ่งอำนวยความสะดวกครบครัน</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    $('#news-updates').html(fallbackUpdatesHTML);
}
// Missing functions that are called but not defined

// Initialize interactive elements
function initializeInteractiveElements() {
    console.log('Initializing interactive elements...');

    // Initialize tooltips
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Initialize popovers
    if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
}

// Initialize mobile-specific features
function initializeMobileFeatures() {
    console.log('Initializing mobile features...');

    // Touch-friendly navigation
    const navToggler = document.querySelector('.navbar-toggler');
    if (navToggler) {
        navToggler.addEventListener('click', function () {
            const navCollapse = document.querySelector('.navbar-collapse');
            if (navCollapse) {
                navCollapse.classList.toggle('show');
            }
        });
    }

    // Mobile-specific touch events
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Initialize responsive image handling
function initializeResponsiveImages() {
    console.log('Initializing responsive images...');

    // Add responsive classes to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.classList.contains('img-fluid')) {
            img.classList.add('img-fluid');
        }
    });
}

// Initialize advanced interactive features
function initializeAdvancedInteractiveFeatures() {
    console.log('Initializing advanced interactive features...');

    // Initialize lightbox if available
    if (typeof window.interactiveFeatures !== 'undefined') {
        window.interactiveFeatures.initializeGalleryLightbox();
    }
}

// Initialize carousel enhancements
function initializeCarouselEnhancements() {
    console.log('Initializing carousel enhancements...');

    // Add touch support for carousel
    const carousel = document.querySelector('#mainCarousel');
    if (carousel) {
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', function (e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    // Swipe left - next slide
                    const nextBtn = carousel.querySelector('.carousel-control-next');
                    if (nextBtn) nextBtn.click();
                } else {
                    // Swipe right - previous slide
                    const prevBtn = carousel.querySelector('.carousel-control-prev');
                    if (prevBtn) prevBtn.click();
                }
            }
        });
    }
}

// Initialize navbar scroll effect
function initializeNavbarScrollEffect() {
    console.log('Initializing navbar scroll effect...');

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// Initialize marquee interactions
function initializeMarqueeInteractions() {
    console.log('Initializing marquee interactions...');

    const marquee = document.querySelector('.news-marquee');
    if (marquee) {
        const marqueeContent = marquee.querySelector('.marquee-content');
        if (marqueeContent) {
            marquee.addEventListener('mouseenter', function () {
                marqueeContent.style.animationPlayState = 'paused';
            });

            marquee.addEventListener('mouseleave', function () {
                marqueeContent.style.animationPlayState = 'running';
            });
        }
    }
}

// Initialize history page interactions
function initializeHistoryPageInteractions() {
    console.log('Initializing history page interactions...');

    // Image modal functionality
    const historyImages = document.querySelectorAll('.history-image');
    historyImages.forEach(img => {
        img.addEventListener('click', function () {
            const modalImage = document.querySelector('#modalImage');
            const modalTitle = document.querySelector('#imageModalLabel');

            if (modalImage && modalTitle) {
                modalImage.src = this.getAttribute('data-image-src') || this.src;
                modalTitle.textContent = this.getAttribute('data-image-title') || this.alt;
            }
        });
    });
}

// Show error function
function showError(selector, message) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }
}

// Load services content for services page
function loadServicesContent() {
    $.getJSON('data/services-content.json')
        .done(function (data) {
            renderServicesContent(data);
        })
        .fail(function () {
            console.error('Failed to load services content data');
            showError('#services-content', 'ไม่สามารถโหลดข้อมูลบริการได้ กรุณาลองใหม่อีกครั้ง');
        });
}

// Render services content
function renderServicesContent(data) {
    if (!data || !data.services) {
        showError('#services-content', 'ไม่พบข้อมูลบริการ');
        return;
    }

    const servicesHTML = `
        <div class="services-page">
            <section class="services-hero py-5">
                <div class="container">
                    <div class="text-center">
                        <h1 class="hero-title">${data.title || 'บริการของเรา'}</h1>
                        <p class="hero-description">${data.description || 'บริการและสิ่งอำนวยความสะดวกที่ห้วยตึงเฒ่า'}</p>
                    </div>
                </div>
            </section>
            
            <section class="services-list py-5">
                <div class="container">
                    <div class="row">
                        ${data.services.map(service => `
                            <div class="col-lg-4 col-md-6 mb-4">
                                <div class="service-card h-100">
                                    <div class="service-icon">
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
        </div>
    `;

    $('#services-content').html(servicesHTML);
}

// Load news content for news page
function loadNewsContent() {
    $.getJSON('data/news-content.json')
        .done(function (data) {
            renderNewsContent(data);
        })
        .fail(function () {
            console.error('Failed to load news content data');
            showError('#news-content', 'ไม่สามารถโหลดข้อมูลข่าวสารได้ กรุณาลองใหม่อีกครั้ง');
        });
}

// Render news content
function renderNewsContent(data) {
    if (!data || !data.news) {
        showError('#news-content', 'ไม่พบข้อมูลข่าวสาร');
        return;
    }

    const newsHTML = `
        <div class="news-page">
            <section class="news-hero py-5">
                <div class="container">
                    <div class="text-center">
                        <h1 class="hero-title">ข่าวสาร</h1>
                        <p class="hero-description">ข่าวสารและกิจกรรมต่างๆ ของห้วยตึงเฒ่า</p>
                    </div>
                </div>
            </section>
            
            <section class="news-list py-5">
                <div class="container">
                    <div class="row">
                        ${data.news.map(news => `
                            <div class="col-lg-6 mb-4">
                                <div class="news-card">
                                    <div class="news-date">${news.date || 'ไม่ระบุวันที่'}</div>
                                    <h4>${news.title || 'ไม่มีหัวข้อ'}</h4>
                                    <p>${news.content || 'ไม่มีเนื้อหา'}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        </div>
    `;

    $('#news-content').html(newsHTML);
}

console.log('Main.js loaded successfully with all functions');