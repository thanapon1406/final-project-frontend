// JSON Manager JavaScript

// Global variables
let jsonFiles = [];
let backupFiles = [];
let currentEditingFile = null;
let editorContent = '';

// JSON file types and their descriptions
const JSON_FILE_TYPES = {
    'homepage-carousel.json': {
        name: 'Carousel หน้าหลัก',
        description: 'ข้อมูลสไลด์ carousel ในหน้าหลัก',
        icon: 'fas fa-images'
    },
    'homepage-services.json': {
        name: 'บริการหน้าหลัก',
        description: 'ข้อมูลส่วนบริการ 3 คอลัมน์',
        icon: 'fas fa-concierge-bell'
    },
    'homepage-featured.json': {
        name: 'เนื้อหาเด่นหน้าหลัก',
        description: 'ข้อมูลเนื้อหาเด่น 4 คอลัมน์',
        icon: 'fas fa-star'
    },
    'homepage-news.json': {
        name: 'ข่าวประกาศ',
        description: 'ข้อมูลข่าวประกาศแบบ marquee',
        icon: 'fas fa-bullhorn'
    },
    'homepage-updates.json': {
        name: 'ข่าวสารอัปเดต',
        description: 'ข้อมูลตารางข่าวสาร',
        icon: 'fas fa-newspaper'
    },
    'homepage-gallery.json': {
        name: 'แกลเลอรี่หน้าหลัก',
        description: 'ข้อมูลรูปภาพในแกลเลอรี่',
        icon: 'fas fa-photo-video'
    },
    'history-content.json': {
        name: 'เนื้อหาประวัติ',
        description: 'ข้อมูลหน้าประวัติและไทม์ไลน์',
        icon: 'fas fa-history'
    },
    'services-content.json': {
        name: 'เนื้อหาบริการ',
        description: 'ข้อมูลหน้าบริการและกิจกรรม',
        icon: 'fas fa-cogs'
    },
    'about-content.json': {
        name: 'เนื้อหาเกี่ยวกับเรา',
        description: 'ข้อมูลหน้าเกี่ยวกับเรา',
        icon: 'fas fa-info-circle'
    },
    'contact-content.json': {
        name: 'ข้อมูลติดต่อ',
        description: 'ข้อมูลการติดต่อและแผนที่',
        icon: 'fas fa-phone'
    },
    'navigation.json': {
        name: 'เมนูนำทาง',
        description: 'ข้อมูลเมนูนำทางและโลโก้',
        icon: 'fas fa-bars'
    },
    'footer.json': {
        name: 'ส่วนท้าย',
        description: 'ข้อมูลส่วนท้ายเว็บไซต์',
        icon: 'fas fa-window-minimize'
    }
};

// Initialize JSON manager
function initializeJsonManager() {
    loadJsonFiles();
    loadBackupFiles();
    initializeEditor();
    initializeImportExport();
    updateEditorStats();
}

// Load JSON files list
function loadJsonFiles() {
    // Simulate loading JSON files (in real app, this would be an API call)
    jsonFiles = Object.keys(JSON_FILE_TYPES).map(filename => ({
        name: filename,
        ...JSON_FILE_TYPES[filename],
        size: Math.floor(Math.random() * 10000) + 1000, // Random size for demo
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        valid: Math.random() > 0.1 // 90% chance of being valid
    }));
    
    renderJsonFilesList();
    populateEditorFileSelect();
    populateExportFilesList();
}

// Render JSON files list
function renderJsonFilesList() {
    const container = $('#jsonFilesList');
    container.empty();
    
    if (jsonFiles.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-file-code fa-3x mb-3"></i>
                <p>ไม่พบไฟล์ JSON</p>
            </div>
        `);
        return;
    }
    
    jsonFiles.forEach((file, index) => {
        const statusClass = file.valid ? 'success' : 'danger';
        const statusIcon = file.valid ? 'check-circle' : 'exclamation-triangle';
        const statusText = file.valid ? 'ถูกต้อง' : 'ผิดพลาด';
        
        const fileHTML = `
            <div class="card mb-3 json-file-item" data-filename="${file.name}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-1 text-center">
                            <i class="${file.icon} fa-2x text-primary"></i>
                        </div>
                        <div class="col-md-6">
                            <h6 class="mb-1">${file.name}</h6>
                            <p class="text-muted mb-1 small">${file.description}</p>
                            <div class="file-size">
                                <i class="fas fa-weight me-1"></i>${formatFileSize(file.size)}
                                <i class="fas fa-clock ms-2 me-1"></i>${formatDate(file.lastModified)}
                            </div>
                        </div>
                        <div class="col-md-2 text-center">
                            <span class="badge bg-${statusClass}">
                                <i class="fas fa-${statusIcon} me-1"></i>${statusText}
                            </span>
                        </div>
                        <div class="col-md-3 text-end">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-info" onclick="viewFileInfo('${file.name}')" title="ดูข้อมูล">
                                    <i class="fas fa-info"></i>
                                </button>
                                <button class="btn btn-outline-primary" onclick="editFile('${file.name}')" title="แก้ไข">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-success" onclick="downloadFile('${file.name}')" title="ดาวน์โหลด">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn btn-outline-warning" onclick="validateFile('${file.name}')" title="ตรวจสอบ">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-outline-secondary" onclick="backupFile('${file.name}')" title="สำรอง">
                                    <i class="fas fa-save"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(fileHTML);
    });
}

// View file information
function viewFileInfo(filename) {
    const file = jsonFiles.find(f => f.name === filename);
    if (!file) return;
    
    const infoHTML = `
        <div class="file-info-details">
            <div class="d-flex align-items-center mb-3">
                <i class="${file.icon} fa-2x text-primary me-3"></i>
                <div>
                    <h6 class="mb-0">${file.name}</h6>
                    <small class="text-muted">${file.description}</small>
                </div>
            </div>
            
            <table class="table table-sm">
                <tr>
                    <td><strong>ขนาดไฟล์:</strong></td>
                    <td>${formatFileSize(file.size)}</td>
                </tr>
                <tr>
                    <td><strong>แก้ไขล่าสุด:</strong></td>
                    <td>${formatDateTime(file.lastModified)}</td>
                </tr>
                <tr>
                    <td><strong>สถานะ:</strong></td>
                    <td>
                        <span class="badge bg-${file.valid ? 'success' : 'danger'}">
                            <i class="fas fa-${file.valid ? 'check-circle' : 'exclamation-triangle'} me-1"></i>
                            ${file.valid ? 'ถูกต้อง' : 'ผิดพลาด'}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>ประเภท:</strong></td>
                    <td>JSON Data File</td>
                </tr>
            </table>
            
            <div class="d-grid gap-2">
                <button class="btn btn-admin-primary btn-sm" onclick="editFile('${filename}')">
                    <i class="fas fa-edit me-1"></i>แก้ไขไฟล์
                </button>
                <button class="btn btn-outline-info btn-sm" onclick="previewFile('${filename}')">
                    <i class="fas fa-eye me-1"></i>ดูตัวอย่าง
                </button>
            </div>
        </div>
    `;
    
    $('#fileInfo').html(infoHTML);
}

// Preview file content
function previewFile(filename) {
    // Simulate loading file content
    $.getJSON(`../data/${filename}`)
        .done(function(data) {
            const jsonString = JSON.stringify(data, null, 2);
            const previewHTML = `
                <div class="json-preview">
                    <pre><code class="language-json">${escapeHtml(jsonString)}</code></pre>
                </div>
            `;
            $('#filePreview').html(previewHTML);
            
            // Apply syntax highlighting
            if (window.Prism) {
                Prism.highlightAll();
            }
        })
        .fail(function() {
            $('#filePreview').html(`
                <div class="text-center text-danger py-4">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p>ไม่สามารถโหลดไฟล์ได้</p>
                </div>
            `);
        });
}

// Edit file in editor
function editFile(filename) {
    // Switch to editor tab
    $('#editor-tab').tab('show');
    
    // Set file in select
    $('#editorFileSelect').val(filename);
    
    // Load file content
    loadFileInEditor();
}

// Load file in editor
function loadFileInEditor() {
    const filename = $('#editorFileSelect').val();
    if (!filename) {
        $('#jsonEditor').val('');
        $('#currentEditingFile').text('ไม่ได้เลือกไฟล์');
        $('#editorStatus').text('พร้อมใช้งาน');
        currentEditingFile = null;
        return;
    }
    
    currentEditingFile = filename;
    $('#currentEditingFile').text(filename);
    $('#editorStatus').text('กำลังโหลด...');
    
    // Load file content
    $.getJSON(`../data/${filename}`)
        .done(function(data) {
            const jsonString = JSON.stringify(data, null, 2);
            $('#jsonEditor').val(jsonString);
            editorContent = jsonString;
            $('#editorStatus').text('โหลดเรียบร้อย');
            updateEditorStats();
        })
        .fail(function() {
            $('#jsonEditor').val('// ไม่สามารถโหลดไฟล์ได้\n// กรุณาตรวจสอบไฟล์และลองใหม่');
            $('#editorStatus').text('โหลดไฟล์ล้มเหลว');
            showErrorMessage('ไม่สามารถโหลดไฟล์ ' + filename + ' ได้');
        });
}

// Initialize editor
function initializeEditor() {
    const editor = $('#jsonEditor');
    
    // Update stats on input
    editor.on('input', function() {
        updateEditorStats();
        
        // Check if content changed
        if ($(this).val() !== editorContent) {
            $('#editorStatus').text('มีการเปลี่ยนแปลง (ยังไม่ได้บันทึก)');
        } else {
            $('#editorStatus').text('ไม่มีการเปลี่ยนแปลง');
        }
    });
    
    // Add keyboard shortcuts
    editor.on('keydown', function(e) {
        // Ctrl+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveJsonFile();
        }
        
        // Ctrl+Shift+F to format
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            formatJson();
        }
        
        // Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const value = $(this).val();
            
            $(this).val(value.substring(0, start) + '  ' + value.substring(end));
            this.selectionStart = this.selectionEnd = start + 2;
        }
    });
}

// Update editor statistics
function updateEditorStats() {
    const content = $('#jsonEditor').val();
    const lines = content.split('\n').length;
    const chars = content.length;
    
    $('#editorStats').text(`${lines} บรรทัด, ${chars} ตัวอักษร`);
}

// Format JSON in editor
function formatJson() {
    const content = $('#jsonEditor').val();
    
    try {
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        $('#jsonEditor').val(formatted);
        $('#editorStatus').text('จัดรูปแบบเรียบร้อย');
        updateEditorStats();
        showSuccessMessage('จัดรูปแบบ JSON เรียบร้อยแล้ว');
    } catch (error) {
        $('#editorStatus').text('รูปแบบ JSON ไม่ถูกต้อง');
        showErrorMessage('ไม่สามารถจัดรูปแบบได้: ' + error.message);
    }
}

// Validate JSON in editor
function validateJson() {
    const content = $('#jsonEditor').val();
    
    try {
        JSON.parse(content);
        $('#editorStatus').text('JSON ถูกต้อง');
        showSuccessMessage('รูปแบบ JSON ถูกต้อง');
        return true;
    } catch (error) {
        $('#editorStatus').text('JSON ไม่ถูกต้อง: ' + error.message);
        showErrorMessage('รูปแบบ JSON ไม่ถูกต้อง: ' + error.message);
        return false;
    }
}

// Save JSON file
function saveJsonFile() {
    if (!currentEditingFile) {
        showErrorMessage('กรุณาเลือกไฟล์ที่ต้องการบันทึก');
        return;
    }
    
    const content = $('#jsonEditor').val();
    
    // Validate before saving
    if (!validateJson()) {
        return;
    }
    
    $('#editorStatus').text('กำลังบันทึก...');
    
    // Simulate saving (in real app, this would be an API call)
    setTimeout(() => {
        editorContent = content;
        $('#editorStatus').text('บันทึกเรียบร้อย');
        showSuccessMessage('บันทึกไฟล์ ' + currentEditingFile + ' เรียบร้อยแล้ว');
        
        // Update file info
        const file = jsonFiles.find(f => f.name === currentEditingFile);
        if (file) {
            file.lastModified = new Date();
            file.valid = true;
            file.size = content.length;
        }
        
        renderJsonFilesList();
    }, 1000);
}

// Populate editor file select
function populateEditorFileSelect() {
    const select = $('#editorFileSelect');
    select.find('option:not(:first)').remove();
    
    jsonFiles.forEach(file => {
        select.append(`<option value="${file.name}">${file.name}</option>`);
    });
}

// Download file
function downloadFile(filename) {
    // Simulate file download
    $.getJSON(`../data/${filename}`)
        .done(function(data) {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showSuccessMessage('ดาวน์โหลดไฟล์ ' + filename + ' เรียบร้อยแล้ว');
        })
        .fail(function() {
            showErrorMessage('ไม่สามารถดาวน์โหลดไฟล์ได้');
        });
}

// Validate single file
function validateFile(filename) {
    $.getJSON(`../data/${filename}`)
        .done(function(data) {
            showSuccessMessage('ไฟล์ ' + filename + ' มีรูปแบบถูกต้อง');
            
            // Update file status
            const file = jsonFiles.find(f => f.name === filename);
            if (file) {
                file.valid = true;
                renderJsonFilesList();
            }
        })
        .fail(function() {
            showErrorMessage('ไฟล์ ' + filename + ' มีรูปแบบไม่ถูกต้อง');
            
            // Update file status
            const file = jsonFiles.find(f => f.name === filename);
            if (file) {
                file.valid = false;
                renderJsonFilesList();
            }
        });
}

// Validate all files
function validateAllFiles() {
    let validCount = 0;
    let totalCount = jsonFiles.length;
    
    showSuccessMessage('กำลังตรวจสอบไฟล์ทั้งหมด...');
    
    jsonFiles.forEach(file => {
        $.getJSON(`../data/${file.name}`)
            .done(function() {
                file.valid = true;
                validCount++;
                checkValidationComplete();
            })
            .fail(function() {
                file.valid = false;
                checkValidationComplete();
            });
    });
    
    function checkValidationComplete() {
        if (validCount + (totalCount - validCount) === totalCount) {
            renderJsonFilesList();
            showSuccessMessage(`ตรวจสอบเสร็จสิ้น: ${validCount}/${totalCount} ไฟล์ถูกต้อง`);
        }
    }
}

// Backup single file
function backupFile(filename) {
    // Simulate backup creation
    showSuccessMessage('กำลังสำรองไฟล์ ' + filename + '...');
    
    setTimeout(() => {
        const backup = {
            originalFile: filename,
            backupFile: `${Date.now()}_${filename}`,
            createdAt: new Date(),
            size: Math.floor(Math.random() * 10000) + 1000
        };
        
        backupFiles.unshift(backup);
        renderBackupsList();
        showSuccessMessage('สำรองไฟล์ ' + filename + ' เรียบร้อยแล้ว');
    }, 1000);
}

// Load backup files
function loadBackupFiles() {
    // Simulate loading backup files
    backupFiles = [
        {
            originalFile: 'homepage-carousel.json',
            backupFile: '1703123456789_homepage-carousel.json',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            size: 2456
        },
        {
            originalFile: 'contact-content.json',
            backupFile: '1703120000000_contact-content.json',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            size: 1234
        },
        {
            originalFile: 'homepage-services.json',
            backupFile: '1703110000000_homepage-services.json',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            size: 3456
        }
    ];
    
    renderBackupsList();
    populateBackupFilter();
    updateBackupStats();
}

// Render backups list
function renderBackupsList() {
    const container = $('#backupsList');
    const filter = $('#backupFileFilter').val();
    
    let filteredBackups = backupFiles;
    if (filter) {
        filteredBackups = backupFiles.filter(backup => backup.originalFile === filter);
    }
    
    container.empty();
    
    if (filteredBackups.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-history fa-3x mb-3"></i>
                <p>ไม่มีไฟล์สำรองข้อมูล</p>
            </div>
        `);
        return;
    }
    
    filteredBackups.forEach((backup, index) => {
        const isOld = (Date.now() - backup.createdAt.getTime()) > 7 * 24 * 60 * 60 * 1000;
        const backupHTML = `
            <div class="card mb-2 backup-item ${isOld ? 'old' : ''}">
                <div class="card-body py-2">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <h6 class="mb-0">${backup.originalFile}</h6>
                            <small class="text-muted">${formatFileSize(backup.size)}</small>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>
                                ${formatDateTime(backup.createdAt)}
                            </small>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-info" onclick="previewBackup('${backup.backupFile}')" title="ดูตัวอย่าง">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-warning" onclick="restoreFromBackup('${backup.originalFile}', '${backup.backupFile}')" title="คืนค่า">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <button class="btn btn-outline-success" onclick="downloadBackup('${backup.backupFile}')" title="ดาวน์โหลด">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="deleteBackup('${backup.backupFile}')" title="ลบ">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(backupHTML);
    });
}

// Populate backup filter
function populateBackupFilter() {
    const select = $('#backupFileFilter');
    select.find('option:not(:first)').remove();
    
    const uniqueFiles = [...new Set(backupFiles.map(backup => backup.originalFile))];
    uniqueFiles.forEach(filename => {
        select.append(`<option value="${filename}">${filename}</option>`);
    });
}

// Filter backups
function filterBackups() {
    renderBackupsList();
}

// Update backup statistics
function updateBackupStats() {
    const total = backupFiles.length;
    const today = backupFiles.filter(backup => {
        const backupDate = new Date(backup.createdAt);
        const todayDate = new Date();
        return backupDate.toDateString() === todayDate.toDateString();
    }).length;
    
    $('#totalBackups').text(total);
    $('#todayBackups').text(today);
}

// Restore from backup
function restoreFromBackup(originalFile, backupFile) {
    const restoreInfo = `
        <p><strong>ไฟล์ต้นฉบับ:</strong> ${originalFile}</p>
        <p><strong>ไฟล์สำรอง:</strong> ${backupFile}</p>
        <p><strong>วันที่สำรอง:</strong> ${formatDateTime(backupFiles.find(b => b.backupFile === backupFile)?.createdAt)}</p>
    `;
    
    $('#restoreInfo').html(restoreInfo);
    $('#restoreModal').modal('show');
    
    $('#confirmRestoreBtn').off('click').on('click', function() {
        // Simulate restore process
        showSuccessMessage('กำลังคืนค่าไฟล์...');
        
        setTimeout(() => {
            showSuccessMessage('คืนค่าไฟล์ ' + originalFile + ' เรียบร้อยแล้ว');
            $('#restoreModal').modal('hide');
            
            // Update file info
            const file = jsonFiles.find(f => f.name === originalFile);
            if (file) {
                file.lastModified = new Date();
                file.valid = true;
            }
            
            renderJsonFilesList();
        }, 1500);
    });
}

// Create manual backup
function createManualBackup() {
    if (confirm('คุณต้องการสำรองข้อมูลทั้งหมดหรือไม่?')) {
        showSuccessMessage('กำลังสำรองข้อมูลทั้งหมด...');
        
        setTimeout(() => {
            jsonFiles.forEach(file => {
                const backup = {
                    originalFile: file.name,
                    backupFile: `${Date.now()}_${file.name}`,
                    createdAt: new Date(),
                    size: file.size
                };
                backupFiles.unshift(backup);
            });
            
            renderBackupsList();
            populateBackupFilter();
            updateBackupStats();
            showSuccessMessage('สำรองข้อมูลทั้งหมดเรียบร้อยแล้ว');
        }, 2000);
    }
}

// Clean old backups
function cleanOldBackups() {
    const oldBackups = backupFiles.filter(backup => {
        return (Date.now() - backup.createdAt.getTime()) > 30 * 24 * 60 * 60 * 1000; // 30 days
    });
    
    if (oldBackups.length === 0) {
        showSuccessMessage('ไม่มีไฟล์สำรองข้อมูลเก่าที่ต้องลบ');
        return;
    }
    
    if (confirm(`พบไฟล์สำรองข้อมูลเก่า ${oldBackups.length} ไฟล์ คุณต้องการลบหรือไม่?`)) {
        backupFiles = backupFiles.filter(backup => !oldBackups.includes(backup));
        renderBackupsList();
        updateBackupStats();
        showSuccessMessage(`ลบไฟล์สำรองข้อมูลเก่า ${oldBackups.length} ไฟล์เรียบร้อยแล้ว`);
    }
}

// Initialize import/export
function initializeImportExport() {
    // Handle file input change
    $('#importFileInput').on('change', function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            previewImportFiles(files);
        }
    });
    
    populateExportFilesList();
}

// Preview import files
function previewImportFiles(files) {
    const container = $('#importFilesList');
    container.empty();
    
    files.forEach(file => {
        const fileHTML = `
            <div class="d-flex justify-content-between align-items-center py-1">
                <span>
                    <i class="fas fa-file-code me-2"></i>${file.name}
                </span>
                <small class="text-muted">${formatFileSize(file.size)}</small>
            </div>
        `;
        container.append(fileHTML);
    });
    
    $('#importPreview').show();
    $('#importBtn').prop('disabled', false);
}

// Import JSON files
function importJsonFiles() {
    const files = $('#importFileInput')[0].files;
    const overwrite = $('#overwriteExisting').is(':checked');
    const createBackup = $('#createBackupBeforeImport').is(':checked');
    
    if (files.length === 0) {
        showErrorMessage('กรุณาเลือกไฟล์ที่ต้องการนำเข้า');
        return;
    }
    
    showSuccessMessage('กำลังนำเข้าไฟล์...');
    
    // Simulate import process
    setTimeout(() => {
        let importedCount = 0;
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    JSON.parse(content); // Validate JSON
                    
                    // Check if file exists
                    const existingFile = jsonFiles.find(f => f.name === file.name);
                    
                    if (existingFile && !overwrite) {
                        showErrorMessage(`ไฟล์ ${file.name} มีอยู่แล้ว`);
                        return;
                    }
                    
                    if (existingFile && createBackup) {
                        backupFile(file.name);
                    }
                    
                    // Update or add file
                    if (existingFile) {
                        existingFile.size = file.size;
                        existingFile.lastModified = new Date();
                        existingFile.valid = true;
                    } else {
                        jsonFiles.push({
                            name: file.name,
                            ...JSON_FILE_TYPES[file.name] || {
                                name: file.name,
                                description: 'ไฟล์ที่นำเข้า',
                                icon: 'fas fa-file-code'
                            },
                            size: file.size,
                            lastModified: new Date(),
                            valid: true
                        });
                    }
                    
                    importedCount++;
                    
                    if (importedCount === files.length) {
                        renderJsonFilesList();
                        populateEditorFileSelect();
                        populateExportFilesList();
                        showSuccessMessage(`นำเข้าไฟล์ ${importedCount} ไฟล์เรียบร้อยแล้ว`);
                        
                        // Reset form
                        $('#importFileInput').val('');
                        $('#importPreview').hide();
                        $('#importBtn').prop('disabled', true);
                    }
                    
                } catch (error) {
                    showErrorMessage(`ไฟล์ ${file.name} มีรูปแบบไม่ถูกต้อง: ${error.message}`);
                }
            };
            reader.readAsText(file);
        });
    }, 1000);
}

// Populate export files list
function populateExportFilesList() {
    const container = $('#exportFilesList');
    container.empty();
    
    jsonFiles.forEach(file => {
        const checkboxHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${file.name}" id="export_${file.name}" checked>
                <label class="form-check-label" for="export_${file.name}">
                    <i class="${file.icon} me-2"></i>${file.name}
                    <small class="text-muted d-block">${file.description}</small>
                </label>
            </div>
        `;
        container.append(checkboxHTML);
    });
}

// Export selected files
function exportSelectedFiles() {
    const selectedFiles = [];
    $('#exportFilesList input:checked').each(function() {
        selectedFiles.push($(this).val());
    });
    
    if (selectedFiles.length === 0) {
        showErrorMessage('กรุณาเลือกไฟล์ที่ต้องการส่งออก');
        return;
    }
    
    const format = $('input[name="exportFormat"]:checked').val();
    const includeBackups = $('#includeBackups').is(':checked');
    const formatJson = $('#formatJsonExport').is(':checked');
    
    showSuccessMessage(`กำลังส่งออกไฟล์ ${selectedFiles.length} ไฟล์...`);
    
    // Simulate export process
    setTimeout(() => {
        if (format === 'zip') {
            // Create a simulated ZIP download
            const blob = new Blob(['Simulated ZIP file content'], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `json-export-${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Download individual files
            selectedFiles.forEach(filename => {
                downloadFile(filename);
            });
        }
        
        showSuccessMessage(`ส่งออกไฟล์ ${selectedFiles.length} ไฟล์เรียบร้อยแล้ว`);
    }, 1500);
}

// Export all files
function exportAllFiles() {
    $('#exportFilesList input[type="checkbox"]').prop('checked', true);
    exportSelectedFiles();
}

// Refresh JSON files
function refreshJsonFiles() {
    showSuccessMessage('กำลังรีเฟรชรายการไฟล์...');
    setTimeout(() => {
        loadJsonFiles();
        showSuccessMessage('รีเฟรชรายการไฟล์เรียบร้อยแล้ว');
    }, 1000);
}

// Backup all files
function backupAllFiles() {
    createManualBackup();
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date) {
    return date.toLocaleDateString('th-TH');
}

function formatDateTime(date) {
    return date.toLocaleString('th-TH');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Preview backup
function previewBackup(backupFile) {
    // Simulate loading backup content
    const sampleData = {
        "message": "This is a backup file preview",
        "backupFile": backupFile,
        "timestamp": new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(sampleData, null, 2);
    const previewHTML = `
        <div class="json-preview">
            <pre><code class="language-json">${escapeHtml(jsonString)}</code></pre>
        </div>
    `;
    
    // Show in a modal or update preview area
    $('#filePreview').html(previewHTML);
    
    if (window.Prism) {
        Prism.highlightAll();
    }
    
    // Switch to files tab to show preview
    $('#files-tab').tab('show');
}

// Download backup
function downloadBackup(backupFile) {
    // Simulate backup download
    const sampleData = {
        "message": "This is a backup file",
        "backupFile": backupFile,
        "timestamp": new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('ดาวน์โหลดไฟล์สำรอง ' + backupFile + ' เรียบร้อยแล้ว');
}

// Delete backup
function deleteBackup(backupFile) {
    if (confirm('คุณต้องการลบไฟล์สำรองนี้หรือไม่?')) {
        backupFiles = backupFiles.filter(backup => backup.backupFile !== backupFile);
        renderBackupsList();
        updateBackupStats();
        showSuccessMessage('ลบไฟล์สำรอง ' + backupFile + ' เรียบร้อยแล้ว');
    }
}

// Schedule auto backup
function scheduleAutoBackup() {
    const modalHTML = `
        <div class="modal fade" id="scheduleBackupModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-clock me-2"></i>ตั้งเวลาสำรองอัตโนมัติ
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ความถี่ในการสำรอง</label>
                            <select class="form-select" id="backupFrequency">
                                <option value="daily">ทุกวัน</option>
                                <option value="weekly">ทุกสัปดาห์</option>
                                <option value="monthly">ทุกเดือน</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">เวลา</label>
                            <input type="time" class="form-control" id="backupTime" value="02:00">
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="enableAutoBackup" checked>
                                <label class="form-check-label" for="enableAutoBackup">
                                    เปิดใช้งานการสำรองอัตโนมัติ
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="saveBackupSchedule()">
                            <i class="fas fa-save me-1"></i>บันทึกการตั้งค่า
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#scheduleBackupModal').modal('show');
    
    // Remove modal after hiding
    $('#scheduleBackupModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Save backup schedule
function saveBackupSchedule() {
    const frequency = $('#backupFrequency').val();
    const time = $('#backupTime').val();
    const enabled = $('#enableAutoBackup').is(':checked');
    
    // Simulate saving schedule
    showSuccessMessage(`ตั้งค่าการสำรองอัตโนมัติเรียบร้อยแล้ว: ${frequency} เวลา ${time}`);
    $('#scheduleBackupModal').modal('hide');
}