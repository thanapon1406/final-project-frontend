// Admin Panel JavaScript
$(document).ready(function() {
    initializeAdmin();
});

// Configuration
const ADMIN_CONFIG = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
    CREDENTIALS: {
        'admin': 'huaytueng2024!',
        'manager': 'manager2024!'
    }
};

// Initialize admin functionality
function initializeAdmin() {
    // Check if user is already logged in and redirect
    if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Initialize login page functionality
    if (window.location.pathname.includes('login.html')) {
        initializeLoginPage();
    }
    
    // Initialize dashboard if logged in
    if (isLoggedIn()) {
        initializeDashboard();
        startSessionMonitoring();
    } else if (!window.location.pathname.includes('login.html')) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
}

// Initialize login page functionality
function initializeLoginPage() {
    // Handle login form
    $('#loginForm').on('submit', handleLogin);
    
    // Toggle password visibility
    $('#togglePassword').on('click', togglePasswordVisibility);
    
    // Check for account lockout
    checkAccountLockout();
    
    // Clear any existing sessions
    clearSession();
    
    // Focus on username field
    $('#username').focus();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = $('#username').val().trim();
    const password = $('#password').val();
    const rememberMe = $('#rememberMe').is(':checked');
    
    // Check if account is locked
    if (isAccountLocked()) {
        showLoginError('บัญชีถูกล็อค กรุณารอ 15 นาทีก่อนลองใหม่');
        return;
    }
    
    // Show loading state
    showLoginLoading(true);
    
    // Simulate authentication delay for security
    setTimeout(() => {
        if (authenticateUser(username, password)) {
            // Reset login attempts
            resetLoginAttempts();
            
            // Create session
            createSession(username, rememberMe);
            
            // Show success and redirect
            showLoginSuccess('เข้าสู่ระบบสำเร็จ กำลังเปลี่ยนหน้า...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            // Increment failed attempts
            incrementLoginAttempts();
            
            const attempts = getLoginAttempts();
            const remaining = ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS - attempts;
            
            if (remaining > 0) {
                showLoginError(`ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (เหลือ ${remaining} ครั้ง)`);
            } else {
                lockAccount();
                showLoginError('บัญชีถูกล็อคเนื่องจากพยายามเข้าสู่ระบบผิดหลายครั้ง');
            }
        }
        
        showLoginLoading(false);
    }, 1000);
}

// Authenticate user credentials
function authenticateUser(username, password) {
    return ADMIN_CONFIG.CREDENTIALS[username] === password;
}

// Create user session
function createSession(username, rememberMe) {
    const sessionData = {
        username: username,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        rememberMe: rememberMe
    };
    
    if (rememberMe) {
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
    }
}

// Check if user is logged in
function isLoggedIn() {
    const session = getSession();
    if (!session) return false;
    
    // Check session timeout
    const now = Date.now();
    const timeSinceActivity = now - session.lastActivity;
    
    if (timeSinceActivity > ADMIN_CONFIG.SESSION_TIMEOUT) {
        clearSession();
        return false;
    }
    
    // Update last activity
    updateLastActivity();
    return true;
}

// Get current session
function getSession() {
    let session = sessionStorage.getItem('adminSession');
    if (!session) {
        session = localStorage.getItem('adminSession');
    }
    
    try {
        return session ? JSON.parse(session) : null;
    } catch (e) {
        clearSession();
        return null;
    }
}

// Update last activity timestamp
function updateLastActivity() {
    const session = getSession();
    if (session) {
        session.lastActivity = Date.now();
        
        if (session.rememberMe) {
            localStorage.setItem('adminSession', JSON.stringify(session));
        } else {
            sessionStorage.setItem('adminSession', JSON.stringify(session));
        }
    }
}

// Clear session data
function clearSession() {
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminSession');
}

// Start session monitoring
function startSessionMonitoring() {
    // Check session every minute
    setInterval(() => {
        if (!isLoggedIn()) {
            showSessionExpiredModal();
        }
    }, 60000);
    
    // Update activity on user interaction
    $(document).on('click keypress mousemove', updateLastActivity);
}

// Login attempt management
function getLoginAttempts() {
    return parseInt(localStorage.getItem('loginAttempts') || '0');
}

function incrementLoginAttempts() {
    const attempts = getLoginAttempts() + 1;
    localStorage.setItem('loginAttempts', attempts.toString());
}

function resetLoginAttempts() {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('accountLocked');
}

function lockAccount() {
    localStorage.setItem('accountLocked', Date.now().toString());
}

function isAccountLocked() {
    const lockTime = localStorage.getItem('accountLocked');
    if (!lockTime) return false;
    
    const timeSinceLock = Date.now() - parseInt(lockTime);
    if (timeSinceLock > ADMIN_CONFIG.LOCKOUT_DURATION) {
        resetLoginAttempts();
        return false;
    }
    
    return true;
}

function checkAccountLockout() {
    if (isAccountLocked()) {
        const lockTime = parseInt(localStorage.getItem('accountLocked'));
        const remainingTime = ADMIN_CONFIG.LOCKOUT_DURATION - (Date.now() - lockTime);
        const minutes = Math.ceil(remainingTime / 60000);
        
        showLoginError(`บัญชีถูกล็อค กรุณารอ ${minutes} นาทีก่อนลองใหม่`);
        $('#loginBtn').prop('disabled', true);
        
        // Enable login button when lockout expires
        setTimeout(() => {
            resetLoginAttempts();
            $('#loginAlert').empty();
            $('#loginBtn').prop('disabled', false);
        }, remainingTime);
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordField = $('#password');
    const toggleIcon = $('#togglePassword i');
    
    if (passwordField.attr('type') === 'password') {
        passwordField.attr('type', 'text');
        toggleIcon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        passwordField.attr('type', 'password');
        toggleIcon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}

// Show login loading state
function showLoginLoading(loading) {
    const loginBtn = $('#loginBtn');
    
    if (loading) {
        loginBtn.addClass('btn-loading').prop('disabled', true);
    } else {
        loginBtn.removeClass('btn-loading').prop('disabled', false);
    }
}

// Show login error
function showLoginError(message) {
    const errorHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('#loginAlert').html(errorHTML);
}

// Show login success
function showLoginSuccess(message) {
    const successHTML = `
        <div class="alert alert-success fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>${message}
        </div>
    `;
    $('#loginAlert').html(successHTML);
}

// Show session expired modal
function showSessionExpiredModal() {
    const modalHTML = `
        <div class="modal fade" id="sessionExpiredModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="fas fa-clock me-2"></i>เซสชันหมดอายุ
                        </h5>
                    </div>
                    <div class="modal-body text-center">
                        <i class="fas fa-hourglass-end fa-3x text-warning mb-3"></i>
                        <p>เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-admin-primary" onclick="logout()">
                            เข้าสู่ระบบใหม่
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#sessionExpiredModal').modal('show');
}

// Logout function
function logout() {
    clearSession();
    window.location.href = 'login.html';
}

// Initialize admin dashboard
function initializeDashboard() {
    loadContentStats();
    loadRecentChanges();
    initializeContentEditors();
}

// Load content statistics
function loadContentStats() {
    // This would typically make API calls to get real stats
    const stats = {
        totalPages: 6,
        totalJsonFiles: 11,
        lastUpdate: new Date().toLocaleDateString('th-TH')
    };
    
    displayContentStats(stats);
}

// Display content statistics
function displayContentStats(stats) {
    const statsHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h3>${stats.totalPages}</h3>
                        <p>หน้าเว็บทั้งหมด</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h3>${stats.totalJsonFiles}</h3>
                        <p>ไฟล์ข้อมูลทั้งหมด</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h3>${stats.lastUpdate}</h3>
                        <p>อัปเดตล่าสุด</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#content-stats').html(statsHTML);
}

// Initialize content editors
function initializeContentEditors() {
    // Initialize file upload areas
    $('.file-upload-area').on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    $('.file-upload-area').on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    $('.file-upload-area').on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFileUpload(e.originalEvent.dataTransfer.files);
    });
    
    // Initialize JSON editors
    $('.json-editor').each(function() {
        const editor = $(this);
        editor.on('input', function() {
            validateJSON(editor);
        });
    });
}

// Handle file upload
function handleFileUpload(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            // Handle image upload
            const reader = new FileReader();
            reader.onload = function(e) {
                // Display preview and save file
                console.log('Image uploaded:', file.name);
            };
            reader.readAsDataURL(file);
        }
    }
}

// Validate JSON content
function validateJSON(editor) {
    try {
        JSON.parse(editor.val());
        editor.removeClass('is-invalid').addClass('is-valid');
    } catch (e) {
        editor.removeClass('is-valid').addClass('is-invalid');
    }
}

// Save JSON content
function saveJSONContent(filename, content) {
    try {
        JSON.parse(content);
        // In a real application, this would make an API call
        console.log('Saving JSON content to:', filename);
        showSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (e) {
        showErrorMessage('รูปแบบ JSON ไม่ถูกต้อง');
    }
}

// Show success message
function showSuccessMessage(message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('.admin-content').prepend(alertHTML);
    
    // Auto-dismiss after 3 seconds
    setTimeout(function() {
        $('.alert-success').alert('close');
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const alertHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('.admin-content').prepend(alertHTML);
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}
// Dashboard functionality
function initializeDashboard() {
    loadContentStats();
    loadRecentChanges();
    initializeContentEditors();
    checkSystemStatus();
}

// Load dashboard data
function loadDashboardData() {
    loadContentStats();
    loadRecentActivity();
    checkSystemStatus();
}

// Display user information
function displayUserInfo() {
    const session = getSession();
    if (session) {
        $('#currentUser').text(`ผู้ใช้: ${session.username}`);
        $('#userDisplayName').text(session.username);
        
        const loginTime = new Date(session.loginTime);
        $('#sessionInfo').text(`เข้าสู่ระบบ: ${loginTime.toLocaleString('th-TH')}`);
    }
}

// Load content statistics
function loadContentStats() {
    const session = getSession();
    if (!session) return;
    
    // Make API call to get real stats
    $.ajax({
        url: '/api/admin/stats',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.token || 'dummy-token'}`
        },
        success: function(response) {
            if (response.success) {
                const stats = response.data;
                $('#totalPages').text(stats.totalPages);
                $('#totalJsonFiles').text(stats.totalJsonFiles);
                $('#totalMediaFiles').text(stats.totalMediaFiles);
                
                const lastUpdate = new Date(stats.lastUpdate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                $('#lastUpdate').text(lastUpdate);
                
                // Update system status
                updateSystemStatus('apiStatus', stats.systemStatus.api, 
                    stats.systemStatus.api === 'online' ? 'Online' : 'Offline');
                updateSystemStatus('jsonStatus', stats.systemStatus.jsonFiles, 
                    stats.systemStatus.jsonFiles === 'valid' ? 'Valid' : 'Invalid');
                updateSystemStatus('backupStatus', stats.systemStatus.backupSystem, 
                    stats.systemStatus.backupSystem === 'active' ? 'Active' : 'Inactive');
                updateSystemStatus('storageStatus', stats.systemStatus.storage.status, 
                    stats.systemStatus.storage.used);
            }
        },
        error: function(xhr, status, error) {
            console.error('Failed to load stats:', error);
            // Use fallback data
            $('#totalPages').text('6');
            $('#totalJsonFiles').text('12');
            $('#totalMediaFiles').text('25');
            $('#lastUpdate').text(new Date().toLocaleDateString('th-TH'));
        }
    });
}

// Load recent activity
function loadRecentActivity() {
    const session = getSession();
    if (!session) return;
    
    const tbody = $('#recentActivityBody');
    tbody.html(`
        <tr>
            <td colspan="5" class="text-center text-muted">
                <i class="fas fa-spinner fa-spin me-2"></i>กำลังโหลดข้อมูล...
            </td>
        </tr>
    `);
    
    // Make API call to get recent activity
    $.ajax({
        url: '/api/admin/activity',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.token || 'dummy-token'}`
        },
        success: function(response) {
            tbody.empty();
            
            if (response.success && response.data.length > 0) {
                response.data.forEach(activity => {
                    const time = new Date(activity.timestamp).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    const statusClass = activity.status === 'success' ? 'success' : 'danger';
                    const statusIcon = activity.status === 'success' ? 'check-circle' : 'times-circle';
                    const statusText = activity.status === 'success' ? 'สำเร็จ' : 'ล้มเหลว';
                    
                    const row = `
                        <tr>
                            <td>${time}</td>
                            <td>${activity.action}</td>
                            <td><code>${activity.file}</code></td>
                            <td>${activity.user}</td>
                            <td>
                                <span class="badge bg-${statusClass}">
                                    <i class="fas fa-${statusIcon} me-1"></i>${statusText}
                                </span>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            } else {
                tbody.html(`
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            <i class="fas fa-info-circle me-2"></i>ไม่มีกิจกรรมล่าสุด
                        </td>
                    </tr>
                `);
            }
        },
        error: function(xhr, status, error) {
            console.error('Failed to load recent activity:', error);
            tbody.html(`
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>ไม่สามารถโหลดข้อมูลได้
                    </td>
                </tr>
            `);
        }
    });
}

// Check system status
function checkSystemStatus() {
    // Simulate system status checks
    setTimeout(() => {
        updateSystemStatus('apiStatus', 'online', 'Online');
        updateSystemStatus('jsonStatus', 'online', 'Valid');
        updateSystemStatus('backupStatus', 'online', 'Active');
        updateSystemStatus('storageStatus', 'warning', '85% Used');
    }, 1000);
}

// Update system status indicator
function updateSystemStatus(elementId, status, text) {
    const element = $(`#${elementId}`);
    const statusClasses = {
        'online': 'bg-success',
        'warning': 'bg-warning',
        'offline': 'bg-danger'
    };
    
    const indicatorClasses = {
        'online': 'online',
        'warning': 'warning',
        'offline': 'offline'
    };
    
    element.removeClass('bg-success bg-warning bg-danger')
           .addClass(statusClasses[status])
           .html(`<span class="status-indicator ${indicatorClasses[status]}"></span>${text}`);
}

// Refresh dashboard
function refreshDashboard() {
    showSuccessMessage('กำลังรีเฟรชข้อมูล...');
    loadDashboardData();
}

// Backup all files
function backupAllFiles() {
    if (confirm('คุณต้องการสำรองข้อมูลทั้งหมดหรือไม่?')) {
        showSuccessMessage('กำลังสำรองข้อมูล...');
        
        // Simulate backup process
        setTimeout(() => {
            showSuccessMessage('สำรองข้อมูลเรียบร้อยแล้ว');
        }, 2000);
    }
}

// Change password function
function changePassword() {
    const modalHTML = `
        <div class="modal fade" id="changePasswordModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-key me-2"></i>เปลี่ยนรหัสผ่าน
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="changePasswordForm">
                            <div class="mb-3">
                                <label for="currentPassword" class="form-label">รหัสผ่านปัจจุบัน</label>
                                <input type="password" class="form-control" id="currentPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">รหัสผ่านใหม่</label>
                                <input type="password" class="form-control" id="newPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">ยืนยันรหัสผ่านใหม่</label>
                                <input type="password" class="form-control" id="confirmPassword" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="button" class="btn btn-admin-primary" onclick="submitPasswordChange()">
                            เปลี่ยนรหัสผ่าน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#changePasswordModal').modal('show');
    
    // Remove modal after hiding
    $('#changePasswordModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// Submit password change
function submitPasswordChange() {
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    
    if (newPassword !== confirmPassword) {
        showErrorMessage('รหัสผ่านใหม่ไม่ตรงกัน');
        return;
    }
    
    if (newPassword.length < 8) {
        showErrorMessage('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
        return;
    }
    
    // Simulate password change
    showSuccessMessage('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
    $('#changePasswordModal').modal('hide');
}

// Initialize content editors
function initializeContentEditors() {
    // Initialize file upload areas
    $('.file-upload-area').on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    $('.file-upload-area').on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    $('.file-upload-area').on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFileUpload(e.originalEvent.dataTransfer.files);
    });
    
    // Initialize JSON editors
    $('.json-editor').each(function() {
        const editor = $(this);
        editor.on('input', function() {
            validateJSON(editor);
        });
    });
}

// Handle file upload
function handleFileUpload(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            // Handle image upload
            const reader = new FileReader();
            reader.onload = function(e) {
                // Display preview and save file
                console.log('Image uploaded:', file.name);
                showSuccessMessage(`อัปโหลดรูปภาพ ${file.name} เรียบร้อยแล้ว`);
            };
            reader.readAsDataURL(file);
        }
    }
}

// Validate JSON content
function validateJSON(editor) {
    try {
        JSON.parse(editor.val());
        editor.removeClass('is-invalid').addClass('is-valid');
        return true;
    } catch (e) {
        editor.removeClass('is-valid').addClass('is-invalid');
        return false;
    }
}

// Save JSON content
function saveJSONContent(filename, content) {
    if (!validateJSON($('<textarea>').val(content))) {
        showErrorMessage('รูปแบบ JSON ไม่ถูกต้อง');
        return;
    }
    
    // In a real application, this would make an API call
    console.log('Saving JSON content to:', filename);
    showSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
}

// Show success message
function showSuccessMessage(message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    if ($('#alertArea').length) {
        $('#alertArea').html(alertHTML);
    } else {
        $('.admin-content').prepend(alertHTML);
    }
    
    // Auto-dismiss after 3 seconds
    setTimeout(function() {
        $('.alert-success').alert('close');
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const alertHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    if ($('#alertArea').length) {
        $('#alertArea').html(alertHTML);
    } else {
        $('.admin-content').prepend(alertHTML);
    }
}// Navigation system for admin panel
function initializeNavigation() {
    // Set active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    $('.admin-sidebar .nav-link').removeClass('active');
    
    switch(currentPage) {
        case 'dashboard.html':
            $('.admin-sidebar .nav-link[href="dashboard.html"]').addClass('active');
            break;
        case 'homepage-content.html':
            $('.admin-sidebar .nav-link[href="homepage-content.html"]').addClass('active');
            break;
        case 'page-content.html':
            $('.admin-sidebar .nav-link[href="page-content.html"]').addClass('active');
            break;
        case 'json-manager.html':
            $('.admin-sidebar .nav-link[href="json-manager.html"]').addClass('active');
            break;
        case 'media-manager.html':
            $('.admin-sidebar .nav-link[href="media-manager.html"]').addClass('active');
            break;
    }
    
    // Add mobile menu toggle functionality
    if ($(window).width() <= 768) {
        addMobileMenuToggle();
    }
}

// Add mobile menu toggle
function addMobileMenuToggle() {
    if (!$('#mobileMenuToggle').length) {
        const toggleButton = `
            <button class="btn btn-outline-secondary d-md-none mb-3" id="mobileMenuToggle">
                <i class="fas fa-bars"></i> เมนู
            </button>
        `;
        $('.admin-content').prepend(toggleButton);
        
        $('#mobileMenuToggle').on('click', function() {
            $('.admin-sidebar').toggleClass('show');
        });
        
        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.admin-sidebar, #mobileMenuToggle').length) {
                $('.admin-sidebar').removeClass('show');
            }
        });
    }
}

// Quick edit actions for commonly modified content
function initializeQuickActions() {
    // Add quick edit buttons to dashboard
    const quickEditActions = [
        {
            title: 'แก้ไขข้อความหน้าหลัก',
            icon: 'fas fa-edit',
            action: 'editHomepageText',
            description: 'แก้ไขข้อความในส่วนต่างๆ ของหน้าหลัก'
        },
        {
            title: 'อัปเดตข้อมูลติดต่อ',
            icon: 'fas fa-phone',
            action: 'editContactInfo',
            description: 'แก้ไขเบอร์โทร อีเมล และที่อยู่'
        },
        {
            title: 'จัดการรูปภาพ',
            icon: 'fas fa-images',
            action: 'manageImages',
            description: 'อัปโหลดและจัดการรูปภาพ'
        },
        {
            title: 'แก้ไขข่าวประกาศ',
            icon: 'fas fa-bullhorn',
            action: 'editNews',
            description: 'อัปเดตข่าวสารและประกาศ'
        }
    ];
    
    // Add quick actions to dashboard if not already present
    if ($('#quickActionsContainer').length === 0) {
        const quickActionsHTML = `
            <div class="card shadow mb-4" id="quickActionsContainer">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">
                        <i class="fas fa-zap me-2"></i>การแก้ไขด่วน
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row" id="quickActionsRow">
                        ${quickEditActions.map(action => `
                            <div class="col-md-6 col-lg-3 mb-3">
                                <div class="card h-100 quick-action-card" onclick="${action.action}()">
                                    <div class="card-body text-center">
                                        <i class="${action.icon} fa-2x text-primary mb-2"></i>
                                        <h6 class="card-title">${action.title}</h6>
                                        <p class="card-text small text-muted">${action.description}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Insert after dashboard statistics
        $('.row.mb-4').first().after(quickActionsHTML);
    }
}

// Quick action functions
function editHomepageText() {
    window.location.href = 'homepage-content.html#carousel';
}

function editContactInfo() {
    window.location.href = 'page-content.html#contact';
}

function manageImages() {
    window.location.href = 'media-manager.html';
}

function editNews() {
    window.location.href = 'homepage-content.html#news';
}

// Content statistics tracking
function trackContentChanges() {
    // Track changes to JSON files and update statistics
    const originalSaveFunction = saveJSONContent;
    
    window.saveJSONContent = function(filename, content) {
        // Call original function
        const result = originalSaveFunction(filename, content);
        
        // Update statistics after successful save
        setTimeout(() => {
            loadContentStats();
            loadRecentActivity();
        }, 1000);
        
        return result;
    };
}

// Initialize dashboard enhancements
function initializeDashboardEnhancements() {
    initializeNavigation();
    initializeQuickActions();
    trackContentChanges();
    
    // Auto-refresh dashboard data every 5 minutes
    setInterval(() => {
        loadContentStats();
        loadRecentActivity();
    }, 5 * 60 * 1000);
    
    // Add keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + R to refresh dashboard
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshDashboard();
        }
        
        // Ctrl/Cmd + L to logout
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            logout();
        }
    });
}

// Call dashboard enhancements when document is ready
$(document).ready(function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboardEnhancements();
    }
});