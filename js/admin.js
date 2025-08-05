// Admin JavaScript Functions

// Handle login form submission
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");

  // Toggle password visibility
  if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);

      const icon = this.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  }

  // Handle login form
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleLogin();
    });
  }

  // Check if already logged in
  checkExistingLogin();
});

// Handle login
function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const loginBtn = document.getElementById("loginBtn");

  // Show loading state
  loginBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>กำลังเข้าสู่ระบบ...';
  loginBtn.disabled = true;

  // Simple authentication (in real app, use proper authentication)
  setTimeout(() => {
    if (username === "admin" && password === "password") {
      // Set login session
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminLoginTime", new Date().toISOString());

      if (rememberMe) {
        localStorage.setItem("adminRememberMe", "true");
      }

      // Log login activity
      logActivity("login", "system");

      // Show success message
      showLoginAlert("เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...", "success");

      // Redirect to JSON editor
      setTimeout(() => {
        window.location.href = "json-editor.html";
      }, 1000);
    } else {
      // Show error
      showLoginAlert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "danger");

      // Reset button
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>เข้าสู่ระบบ';
      loginBtn.disabled = false;

      // Clear password field
      document.getElementById("password").value = "";
      document.getElementById("password").focus();
    }
  }, 1000); // Simulate network delay
}

// Check existing login
function checkExistingLogin() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  const rememberMe = localStorage.getItem("adminRememberMe");

  if (isLoggedIn === "true") {
    // Check session timeout (24 hours, or 7 days if remember me)
    const loginTime = localStorage.getItem("adminLoginTime");
    if (loginTime) {
      const now = new Date();
      const login = new Date(loginTime);
      const hoursDiff = (now - login) / (1000 * 60 * 60);
      const maxHours = rememberMe === "true" ? 168 : 24; // 7 days or 1 day

      if (hoursDiff < maxHours) {
        // Still valid, redirect to editor
        window.location.href = "json-editor.html";
        return;
      } else {
        // Session expired
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminLoginTime");
        if (!rememberMe) {
          localStorage.removeItem("adminRememberMe");
        }
        showLoginAlert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่", "warning");
      }
    }
  }
}

// Show login alert
function showLoginAlert(message, type = "info") {
  const alertArea = document.getElementById("loginAlert");
  if (!alertArea) return;

  const alertClass = `alert-${type}`;

  alertArea.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  // Auto dismiss after 5 seconds for success/info messages
  if (type === "success" || type === "info") {
    setTimeout(() => {
      const alert = alertArea.querySelector(".alert");
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 5000);
  }
}

// Log activity to localStorage
function logActivity(action, fileName) {
  const logs = JSON.parse(localStorage.getItem("admin_logs") || "[]");
  logs.unshift({
    timestamp: new Date().toISOString(),
    action: action,
    fileName: fileName,
    user: "admin",
  });

  // Keep only last 50 logs
  if (logs.length > 50) {
    logs.splice(50);
  }

  localStorage.setItem("admin_logs", JSON.stringify(logs));
}

// Logout function (can be called from other pages)
function logout() {
  if (confirm("ต้องการออกจากระบบหรือไม่?")) {
    // Log logout activity
    logActivity("logout", "system");

    // Clear session data
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoginTime");

    // Redirect to login
    window.location.href = "login.html";
  }
}

// Check authentication (can be called from other pages)
function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
    return false;
  }

  // Check session timeout
  const loginTime = localStorage.getItem("adminLoginTime");
  const rememberMe = localStorage.getItem("adminRememberMe");

  if (loginTime) {
    const now = new Date();
    const login = new Date(loginTime);
    const hoursDiff = (now - login) / (1000 * 60 * 60);
    const maxHours = rememberMe === "true" ? 168 : 24; // 7 days or 1 day

    if (hoursDiff > maxHours) {
      alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      logout();
      return false;
    }
  }

  return true;
}
