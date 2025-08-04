// Homepage Content Management JavaScript

// Global variables
let carouselData = [];
let servicesData = [];
let featuredData = [];
let newsData = {};
let galleryData = [];

// Initialize homepage content management
function initializeHomepageContent() {
    loadAllHomepageContent();
    initializeImageUpload();
    initializeTabNavigation();
}

// Load all homepage content
function loadAllHomepageContent() {
    loadCarouselContent();
    loadServicesContent();
    loadFeaturedContent();
    loadNewsContent();
    loadGalleryContent();
}

// Load carousel content
function loadCarouselContent() {
    $.ajax({
        url: '/api/content/homepage-carousel',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                carouselData = response.data.slides || [];
                renderCarouselSlides();
            }
        },
        error: function() {
            // Load from local data file as fallback
            $.getJSON('../data/homepage-carousel.json', function(data) {
                carouselData = data.slides || [];
                renderCarouselSlides();
            });
        }
    });
}

// Render carousel slides
function renderCarouselSlides() {
    const container = $('#carouselSlides');
    container.empty();
    
    if (carouselData.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-images fa-3x mb-3"></i>
                <p>ยังไม่มีสไลด์ คลิก "เพิ่มสไลด์" เพื่อเริ่มต้น</p>
            </div>
        `);
        return;
    }
    
    carouselData.forEach((slide, index) => {
        const slideHTML = `
            <div class="card mb-3 slide-item" data-index="${index}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="fas fa-image me-2"></i>สไลด์ที่ ${index + 1}
                        ${slide.active ? '<span class="badge bg-success ms-2">Active</span>' : ''}
                    </h6>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editCarouselSlide(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="toggleSlideActive(${index})">
                            <i class="fas fa-${slide.active ? 'eye-slash' : 'eye'}"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteCarouselSlide(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${slide.backgroundImage || '../images/placeholder.jpg'}" 
                                 class="img-fluid rounded" alt="Slide ${index + 1}"
                                 onerror="this.src='../images/placeholder.jpg'">
                        </div>
                        <div class="col-md-8">
                            <h5>${slide.title || 'ไม่มีหัวข้อ'}</h5>
                            <p class="text-muted">${slide.description || 'ไม่มีคำอธิบาย'}</p>
                            <div class="mt-3">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle me-1"></i>
                                    ID: ${slide.id} | Active: ${slide.active ? 'Yes' : 'No'}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(slideHTML);
    });
}

// Add new carousel slide
function addCarouselSlide() {
    const newSlide = {
        id: Date.now(),
        title: 'สไลด์ใหม่',
        description: 'คำอธิบายสไลด์ใหม่',
        backgroundImage: '',
        active: false
    };
    
    carouselData.push(newSlide);
    renderCarouselSlides();
    editCarouselSlide(carouselData.length - 1);
}

// Edit carousel slide
function editCarouselSlide(index) {
    const slide = carouselData[index];
    if (!slide) return;
    
    const modalHTML = `
        <div class="modal fade" id="editSlideModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-edit me-2"></i>แก้ไขสไลด์ที่ ${index + 1}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editSlideForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">หัวข้อ</label>
                                        <input type="text" class="form-control" id="slideTitle" value="${slide.title}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">คำอธิบาย</label>
                                        <textarea class="form-control" id="slideDescription" rows="4">${slide.description}</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="slideActive" ${slide.active ? 'checked' : ''}>
                                            <label class="form-check-label" for="slideActive">
                                                แสดงสไลด์นี้
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">รูปภาพพื้นหลัง</label>
                                        <div class="text-center">
                                            <img id="slideImagePreview" src="${slide.backgroundImage || '../images/placeholder.jpg'}" 
                                                 class="img-fluid rounded mb-2" style="max-height: 200px;"
                                                 onerror="this.src='../images/placeholder.jpg'">
                                            <div>
                                                <button type="button" class="btn btn-outline-primary btn-sm" onclick="selectSlideImage()">
                                                    <i class="fas fa-image me-1"></i>เลือกรูปภาพ
                                                </button>
                                            </div>
                                        </div>
                                        <input type="hidden" id="slideImagePath" value="${slide.backgroundImage}">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="saveSlideChanges(${index})">
                            <i class="fas fa-save me-1"></i>บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#editSlideModal').modal('show');
    
    // Remove modal after hiding
    $('#editSlideModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Save slide changes
function saveSlideChanges(index) {
    const slide = carouselData[index];
    if (!slide) return;
    
    slide.title = $('#slideTitle').val();
    slide.description = $('#slideDescription').val();
    slide.active = $('#slideActive').is(':checked');
    slide.backgroundImage = $('#slideImagePath').val();
    
    renderCarouselSlides();
    $('#editSlideModal').modal('hide');
    showSuccessMessage('บันทึกการเปลี่ยนแปลงสไลด์เรียบร้อยแล้ว');
}

// Toggle slide active status
function toggleSlideActive(index) {
    const slide = carouselData[index];
    if (!slide) return;
    
    slide.active = !slide.active;
    renderCarouselSlides();
    showSuccessMessage(`${slide.active ? 'เปิด' : 'ปิด'}การแสดงสไลด์เรียบร้อยแล้ว`);
}

// Delete carousel slide
function deleteCarouselSlide(index) {
    if (confirm('คุณต้องการลบสไลด์นี้หรือไม่?')) {
        carouselData.splice(index, 1);
        renderCarouselSlides();
        showSuccessMessage('ลบสไลด์เรียบร้อยแล้ว');
    }
}

// Load services content
function loadServicesContent() {
    $.ajax({
        url: '/api/content/homepage-services',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                servicesData = response.data.services || [];
                renderServiceItems();
            }
        },
        error: function() {
            // Load from local data file as fallback
            $.getJSON('../data/homepage-services.json', function(data) {
                servicesData = data.services || [];
                renderServiceItems();
            });
        }
    });
}

// Render service items
function renderServiceItems() {
    const container = $('#serviceItems');
    container.empty();
    
    if (servicesData.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-concierge-bell fa-3x mb-3"></i>
                <p>ยังไม่มีบริการ คลิก "เพิ่มบริการ" เพื่อเริ่มต้น</p>
            </div>
        `);
        return;
    }
    
    servicesData.forEach((service, index) => {
        const serviceHTML = `
            <div class="card mb-3 service-item" data-index="${index}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="${service.icon || 'fas fa-cog'} me-2"></i>${service.title || 'ไม่มีหัวข้อ'}
                    </h6>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editServiceItem(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteServiceItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            <i class="${service.icon || 'fas fa-cog'} fa-3x text-primary"></i>
                        </div>
                        <div class="col-md-10">
                            <h5>${service.title || 'ไม่มีหัวข้อ'}</h5>
                            <p class="text-muted mb-0">${service.description || 'ไม่มีคำอธิบาย'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(serviceHTML);
    });
}

// Add service item
function addServiceItem() {
    const newService = {
        id: Date.now(),
        icon: 'fas fa-cog',
        title: 'บริการใหม่',
        description: 'คำอธิบายบริการใหม่'
    };
    
    servicesData.push(newService);
    renderServiceItems();
    editServiceItem(servicesData.length - 1);
}

// Edit service item
function editServiceItem(index) {
    const service = servicesData[index];
    if (!service) return;
    
    const modalHTML = `
        <div class="modal fade" id="editServiceModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-edit me-2"></i>แก้ไขบริการ
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editServiceForm">
                            <div class="mb-3">
                                <label class="form-label">ไอคอน (Font Awesome Class)</label>
                                <div class="input-group">
                                    <span class="input-group-text">
                                        <i class="${service.icon}" id="iconPreview"></i>
                                    </span>
                                    <input type="text" class="form-control" id="serviceIcon" value="${service.icon}" 
                                           onchange="updateIconPreview()">
                                </div>
                                <small class="form-text text-muted">เช่น: fas fa-bullhorn, fas fa-phone, fas fa-map</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">หัวข้อ</label>
                                <input type="text" class="form-control" id="serviceTitle" value="${service.title}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">คำอธิบาย</label>
                                <textarea class="form-control" id="serviceDescription" rows="4">${service.description}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="saveServiceChanges(${index})">
                            <i class="fas fa-save me-1"></i>บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#editServiceModal').modal('show');
    
    // Remove modal after hiding
    $('#editServiceModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Update icon preview
function updateIconPreview() {
    const iconClass = $('#serviceIcon').val();
    $('#iconPreview').attr('class', iconClass);
}

// Save service changes
function saveServiceChanges(index) {
    const service = servicesData[index];
    if (!service) return;
    
    service.icon = $('#serviceIcon').val();
    service.title = $('#serviceTitle').val();
    service.description = $('#serviceDescription').val();
    
    renderServiceItems();
    $('#editServiceModal').modal('hide');
    showSuccessMessage('บันทึกการเปลี่ยนแปลงบริการเรียบร้อยแล้ว');
}

// Delete service item
function deleteServiceItem(index) {
    if (confirm('คุณต้องการลบบริการนี้หรือไม่?')) {
        servicesData.splice(index, 1);
        renderServiceItems();
        showSuccessMessage('ลบบริการเรียบร้อยแล้ว');
    }
}

// Load featured content
function loadFeaturedContent() {
    $.ajax({
        url: '/api/content/homepage-featured',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                featuredData = response.data.featured || [];
                renderFeaturedItems();
            }
        },
        error: function() {
            // Load from local data file as fallback
            $.getJSON('../data/homepage-featured.json', function(data) {
                featuredData = data.featured || [];
                renderFeaturedItems();
            });
        }
    });
}

// Render featured items
function renderFeaturedItems() {
    const container = $('#featuredItems');
    container.empty();
    
    if (featuredData.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-star fa-3x mb-3"></i>
                <p>ยังไม่มีเนื้อหาเด่น คลิก "เพิ่มเนื้อหา" เพื่อเริ่มต้น</p>
            </div>
        `);
        return;
    }
    
    const itemsPerRow = 2;
    for (let i = 0; i < featuredData.length; i += itemsPerRow) {
        const rowHTML = `<div class="row mb-3">${
            featuredData.slice(i, i + itemsPerRow).map((item, index) => {
                const actualIndex = i + index;
                return `
                    <div class="col-md-6">
                        <div class="card featured-item" data-index="${actualIndex}">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">
                                    <i class="fas fa-star me-2"></i>${item.title || 'ไม่มีหัวข้อ'}
                                </h6>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-outline-primary" onclick="editFeaturedItem(${actualIndex})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="deleteFeaturedItem(${actualIndex})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-4">
                                        <img src="${item.image || '../images/placeholder.jpg'}" 
                                             class="img-fluid rounded" alt="${item.title}"
                                             onerror="this.src='../images/placeholder.jpg'">
                                    </div>
                                    <div class="col-8">
                                        <h6>${item.title || 'ไม่มีหัวข้อ'}</h6>
                                        <p class="text-muted small mb-1">${item.description || 'ไม่มีคำอธิบาย'}</p>
                                        ${item.link ? `<a href="${item.link}" class="btn btn-sm btn-outline-primary" target="_blank">ดูเพิ่มเติม</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')
        }</div>`;
        container.append(rowHTML);
    }
}

// Add featured item
function addFeaturedItem() {
    const newFeatured = {
        id: Date.now(),
        title: 'เนื้อหาเด่นใหม่',
        description: 'คำอธิบายเนื้อหาเด่นใหม่',
        image: '',
        link: ''
    };
    
    featuredData.push(newFeatured);
    renderFeaturedItems();
    editFeaturedItem(featuredData.length - 1);
}

// Edit featured item
function editFeaturedItem(index) {
    const item = featuredData[index];
    if (!item) return;
    
    const modalHTML = `
        <div class="modal fade" id="editFeaturedModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-edit me-2"></i>แก้ไขเนื้อหาเด่น
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editFeaturedForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">หัวข้อ</label>
                                        <input type="text" class="form-control" id="featuredTitle" value="${item.title}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">คำอธิบาย</label>
                                        <textarea class="form-control" id="featuredDescription" rows="4">${item.description}</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">ลิงก์ (ถ้ามี)</label>
                                        <input type="url" class="form-control" id="featuredLink" value="${item.link || ''}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">รูปภาพ</label>
                                        <div class="text-center">
                                            <img id="featuredImagePreview" src="${item.image || '../images/placeholder.jpg'}" 
                                                 class="img-fluid rounded mb-2" style="max-height: 200px;"
                                                 onerror="this.src='../images/placeholder.jpg'">
                                            <div>
                                                <button type="button" class="btn btn-outline-primary btn-sm" onclick="selectFeaturedImage()">
                                                    <i class="fas fa-image me-1"></i>เลือกรูปภาพ
                                                </button>
                                            </div>
                                        </div>
                                        <input type="hidden" id="featuredImagePath" value="${item.image}">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="saveFeaturedChanges(${index})">
                            <i class="fas fa-save me-1"></i>บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#editFeaturedModal').modal('show');
    
    // Remove modal after hiding
    $('#editFeaturedModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Save featured changes
function saveFeaturedChanges(index) {
    const item = featuredData[index];
    if (!item) return;
    
    item.title = $('#featuredTitle').val();
    item.description = $('#featuredDescription').val();
    item.link = $('#featuredLink').val();
    item.image = $('#featuredImagePath').val();
    
    renderFeaturedItems();
    $('#editFeaturedModal').modal('hide');
    showSuccessMessage('บันทึกการเปลี่ยนแปลงเนื้อหาเด่นเรียบร้อยแล้ว');
}

// Delete featured item
function deleteFeaturedItem(index) {
    if (confirm('คุณต้องการลบเนื้อหาเด่นนี้หรือไม่?')) {
        featuredData.splice(index, 1);
        renderFeaturedItems();
        showSuccessMessage('ลบเนื้อหาเด่นเรียบร้อยแล้ว');
    }
}

// Load news content
function loadNewsContent() {
    // Load news marquee
    $.ajax({
        url: '/api/content/homepage-news',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                newsData.marquee = response.data;
                renderNewsMarquee();
            }
        },
        error: function() {
            $.getJSON('../data/homepage-news.json', function(data) {
                newsData.marquee = data;
                renderNewsMarquee();
            });
        }
    });
    
    // Load news updates
    $.ajax({
        url: '/api/content/homepage-updates',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                newsData.updates = response.data;
                renderNewsUpdates();
            }
        },
        error: function() {
            $.getJSON('../data/homepage-updates.json', function(data) {
                newsData.updates = data;
                renderNewsUpdates();
            });
        }
    });
}

// Render news marquee
function renderNewsMarquee() {
    const container = $('#newsMarquee');
    const marqueeData = newsData.marquee || {};
    
    const marqueeHTML = `
        <div class="mb-3">
            <label class="form-label">ข้อความประกาศ</label>
            <textarea class="form-control" id="marqueeText" rows="3">${marqueeData.text || ''}</textarea>
        </div>
        <div class="mb-3">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="marqueeEnabled" ${marqueeData.enabled ? 'checked' : ''}>
                <label class="form-check-label" for="marqueeEnabled">
                    เปิดใช้งานข้อความประกาศ
                </label>
            </div>
        </div>
        <button type="button" class="btn btn-admin-primary" onclick="saveNewsMarquee()">
            <i class="fas fa-save me-1"></i>บันทึกข้อความประกาศ
        </button>
    `;
    
    container.html(marqueeHTML);
}

// Save news marquee
async function saveNewsMarquee() {
    newsData.marquee = {
        text: $('#marqueeText').val(),
        enabled: $('#marqueeEnabled').is(':checked')
    };
    
    try {
        await saveContentToServer('homepage-news', newsData.marquee, 'ข้อความประกาศ');
        showSuccessMessage('บันทึกข้อความประกาศเรียบร้อยแล้ว - อัปเดตทันทีบนหน้าเว็บ');
    } catch (error) {
        showErrorMessage('ไม่สามารถบันทึกข้อความประกาศได้');
    }
}

// Render news updates
function renderNewsUpdates() {
    const container = $('#newsUpdates');
    const updates = newsData.updates?.updates || [];
    
    let updatesHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted">ข่าวสารและอัปเดต</span>
            <button class="btn btn-admin-primary btn-sm" onclick="addNewsUpdate()">
                <i class="fas fa-plus me-1"></i>เพิ่มข่าว
            </button>
        </div>
    `;
    
    if (updates.length === 0) {
        updatesHTML += `
            <div class="text-center text-muted py-4">
                <i class="fas fa-newspaper fa-3x mb-3"></i>
                <p>ยังไม่มีข่าวสาร</p>
            </div>
        `;
    } else {
        updatesHTML += '<div class="list-group">';
        updates.forEach((update, index) => {
            updatesHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">${update.title}</div>
                        <small class="text-muted">${update.date}</small>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editNewsUpdate(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteNewsUpdate(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        updatesHTML += '</div>';
    }
    
    container.html(updatesHTML);
}

// Add news update
function addNewsUpdate() {
    const newUpdate = {
        id: Date.now(),
        title: 'ข่าวใหม่',
        date: new Date().toLocaleDateString('th-TH'),
        content: 'เนื้อหาข่าว'
    };
    
    if (!newsData.updates) newsData.updates = { updates: [] };
    newsData.updates.updates.push(newUpdate);
    renderNewsUpdates();
    editNewsUpdate(newsData.updates.updates.length - 1);
}

// Edit news update
function editNewsUpdate(index) {
    const update = newsData.updates.updates[index];
    if (!update) return;
    
    const modalHTML = `
        <div class="modal fade" id="editNewsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-edit me-2"></i>แก้ไขข่าวสาร
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editNewsForm">
                            <div class="mb-3">
                                <label class="form-label">หัวข้อข่าว</label>
                                <input type="text" class="form-control" id="newsTitle" value="${update.title}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">วันที่</label>
                                <input type="date" class="form-control" id="newsDate" value="${update.date}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">เนื้อหา</label>
                                <textarea class="form-control" id="newsContent" rows="4">${update.content}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="saveNewsUpdate(${index})">
                            <i class="fas fa-save me-1"></i>บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#editNewsModal').modal('show');
    
    // Remove modal after hiding
    $('#editNewsModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Save news update
function saveNewsUpdate(index) {
    const update = newsData.updates.updates[index];
    if (!update) return;
    
    update.title = $('#newsTitle').val();
    update.date = $('#newsDate').val();
    update.content = $('#newsContent').val();
    
    renderNewsUpdates();
    $('#editNewsModal').modal('hide');
    showSuccessMessage('บันทึกข่าวสารเรียบร้อยแล้ว');
}

// Delete news update
function deleteNewsUpdate(index) {
    if (confirm('คุณต้องการลบข่าวนี้หรือไม่?')) {
        newsData.updates.updates.splice(index, 1);
        renderNewsUpdates();
        showSuccessMessage('ลบข่าวเรียบร้อยแล้ว');
    }
}

// Load gallery content
function loadGalleryContent() {
    $.ajax({
        url: '/api/content/homepage-gallery',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                galleryData = response.data.images || [];
                renderGalleryImages();
            }
        },
        error: function() {
            $.getJSON('../data/homepage-gallery.json', function(data) {
                galleryData = data.images || [];
                renderGalleryImages();
            });
        }
    });
}

// Render gallery images
function renderGalleryImages() {
    const container = $('#galleryImages');
    container.empty();
    
    if (galleryData.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-photo-video fa-3x mb-3"></i>
                <p>ยังไม่มีรูปภาพในแกลเลอรี่</p>
            </div>
        `);
        return;
    }
    
    const imagesPerRow = 4;
    for (let i = 0; i < galleryData.length; i += imagesPerRow) {
        const rowHTML = `<div class="row mb-3">${
            galleryData.slice(i, i + imagesPerRow).map((image, index) => {
                const actualIndex = i + index;
                return `
                    <div class="col-md-3">
                        <div class="card gallery-item" data-index="${actualIndex}">
                            <img src="${image.src || '../images/placeholder.jpg'}" 
                                 class="card-img-top" alt="${image.alt}"
                                 onerror="this.src='../images/placeholder.jpg'"
                                 style="height: 150px; object-fit: cover;">
                            <div class="card-body p-2">
                                <h6 class="card-title small mb-1">${image.title || 'ไม่มีหัวข้อ'}</h6>
                                <div class="btn-group btn-group-sm w-100">
                                    <button class="btn btn-outline-primary" onclick="editGalleryImage(${actualIndex})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="deleteGalleryImage(${actualIndex})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')
        }</div>`;
        container.append(rowHTML);
    }
}

// Add gallery image
function addGalleryImage() {
    $('#imageUploadModal').modal('show');
    
    // Set callback for successful upload
    window.imageUploadCallback = function(imagePath) {
        const newImage = {
            id: Date.now(),
            src: imagePath,
            alt: 'รูปภาพใหม่',
            title: 'รูปภาพใหม่'
        };
        
        galleryData.push(newImage);
        renderGalleryImages();
        showSuccessMessage('เพิ่มรูปภาพในแกลเลอรี่เรียบร้อยแล้ว');
    };
}

// Edit gallery image
function editGalleryImage(index) {
    const image = galleryData[index];
    if (!image) return;
    
    const modalHTML = `
        <div class="modal fade" id="editGalleryModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-edit me-2"></i>แก้ไขรูปภาพ
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <img src="${image.src}" class="img-fluid rounded" style="max-height: 200px;"
                                 onerror="this.src='../images/placeholder.jpg'">
                        </div>
                        <form id="editGalleryForm">
                            <div class="mb-3">
                                <label class="form-label">หัวข้อ</label>
                                <input type="text" class="form-control" id="galleryTitle" value="${image.title}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">ข้อความ Alt</label>
                                <input type="text" class="form-control" id="galleryAlt" value="${image.alt}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="saveGalleryChanges(${index})">
                            <i class="fas fa-save me-1"></i>บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#editGalleryModal').modal('show');
    
    // Remove modal after hiding
    $('#editGalleryModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Save gallery changes
function saveGalleryChanges(index) {
    const image = galleryData[index];
    if (!image) return;
    
    image.title = $('#galleryTitle').val();
    image.alt = $('#galleryAlt').val();
    
    renderGalleryImages();
    $('#editGalleryModal').modal('hide');
    showSuccessMessage('บันทึกการเปลี่ยนแปลงรูปภาพเรียบร้อยแล้ว');
}

// Delete gallery image
function deleteGalleryImage(index) {
    if (confirm('คุณต้องการลบรูปภาพนี้หรือไม่?')) {
        galleryData.splice(index, 1);
        renderGalleryImages();
        showSuccessMessage('ลบรูปภาพเรียบร้อยแล้ว');
    }
}

// Initialize image upload
function initializeImageUpload() {
    const dropZone = $('#imageDropZone');
    const fileInput = $('#imageFileInput');
    
    // Handle file input change
    fileInput.on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    });
    
    // Handle drag and drop
    dropZone.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    dropZone.on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    dropZone.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });
    
    // Handle upload button
    $('#uploadImageBtn').on('click', function() {
        uploadImage();
    });
}

// Handle image file
function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showErrorMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
        showErrorMessage('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        $('#previewImage').attr('src', e.target.result);
        $('#imageInfo').text(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        $('#imagePreview').show();
        $('#uploadImageBtn').prop('disabled', false);
    };
    reader.readAsDataURL(file);
    
    // Store file for upload
    window.selectedImageFile = file;
}

// Upload image
function uploadImage() {
    if (!window.selectedImageFile) return;
    
    const formData = new FormData();
    formData.append('image', window.selectedImageFile);
    
    $('#uploadImageBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>กำลังอัปโหลด...');
    
    $.ajax({
        url: '/api/admin/upload',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                $('#imageUploadModal').modal('hide');
                
                // Call callback if exists
                if (window.imageUploadCallback) {
                    window.imageUploadCallback(response.data.uploadPath);
                    window.imageUploadCallback = null;
                }
                
                showSuccessMessage('อัปโหลดรูปภาพเรียบร้อยแล้ว');
            } else {
                showErrorMessage('อัปโหลดรูปภาพล้มเหลว: ' + response.message);
            }
        },
        error: function() {
            showErrorMessage('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        },
        complete: function() {
            $('#uploadImageBtn').prop('disabled', false).html('<i class="fas fa-upload me-1"></i>อัปโหลด');
        }
    });
}

// Initialize tab navigation
function initializeTabNavigation() {
    // Handle tab changes
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
        const target = $(e.target).attr('data-bs-target');
        
        // Update URL hash
        window.location.hash = target.substring(1);
    });
    
    // Load tab from URL hash
    if (window.location.hash) {
        const hash = window.location.hash;
        const tabButton = $(`button[data-bs-target="${hash}"]`);
        if (tabButton.length) {
            tabButton.tab('show');
        }
    }
}

// Preview homepage
function previewHomepage() {
    window.open('../index.html', '_blank');
}

// Save all changes
async function saveAllChanges() {
    if (confirm('คุณต้องการบันทึกการเปลี่ยนแปลงทั้งหมดหรือไม่?')) {
        try {
            // Save all content types
            await Promise.all([
                saveContentToServer('homepage-carousel', { slides: carouselData }, 'สไลด์'),
                saveContentToServer('homepage-services', { services: servicesData }, 'บริการ'),
                saveContentToServer('homepage-featured', { featured: featuredData }, 'เนื้อหาเด่น'),
                saveContentToServer('homepage-news', newsData.marquee, 'ข้อความประกาศ'),
                saveContentToServer('homepage-updates', newsData.updates, 'ข่าวสาร'),
                saveContentToServer('homepage-gallery', { images: galleryData }, 'แกลเลอรี่')
            ]);
            
            showSuccessMessage('บันทึกการเปลี่ยนแปลงทั้งหมดเรียบร้อยแล้ว - อัปเดตทันทีบนหน้าเว็บ');
        } catch (error) {
            console.error('Error saving all changes:', error);
            showErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    }
}

// Save content to server with real-time update
async function saveContentToServer(contentType, data, displayName) {
    try {
        const session = getSession();
        if (!session) {
            showErrorMessage('กรุณาเข้าสู่ระบบใหม่');
            return;
        }

        // Show loading state
        showLoadingMessage(`กำลังบันทึก${displayName}...`);

        const response = await fetch(`/api/admin/content/${contentType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token || 'dummy-token'}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            console.log(`Content saved and cache invalidated for: ${contentType}`);
            return true;
        } else {
            throw new Error(result.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error saving content:', error);
        throw error;
    }
}

// Show loading message
function showLoadingMessage(message) {
    const alertHTML = `
        <div class="alert alert-info alert-dismissible fade show" role="alert">
            <i class="fas fa-spinner fa-spin me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    if ($('#alertArea').length) {
        $('#alertArea').html(alertHTML);
    } else {
        $('.admin-content').prepend(alertHTML);
    }
}

// Image selection helpers
function selectSlideImage() {
    $('#imageUploadModal').modal('show');
    window.imageUploadCallback = function(imagePath) {
        $('#slideImagePath').val(imagePath);
        $('#slideImagePreview').attr('src', imagePath);
    };
}

function selectFeaturedImage() {
    $('#imageUploadModal').modal('show');
    window.imageUploadCallback = function(imagePath) {
        $('#featuredImagePath').val(imagePath);
        $('#featuredImagePreview').attr('src', imagePath);
    };
}