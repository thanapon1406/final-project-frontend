/**
 * Real-time Content Synchronization System
 * Handles automatic content updates when admin makes changes
 */

class RealTimeSync {
    constructor() {
        this.contentTimestamps = new Map();
        this.syncInterval = 5000; // Check every 5 seconds
        this.isActive = false;
        this.syncTimer = null;
        this.contentCallbacks = new Map();
        
        // Initialize sync system
        this.initialize();
    }

    /**
     * Initialize the real-time sync system
     */
    initialize() {
        // Start sync only if we're on a frontend page (not admin)
        if (!window.location.pathname.includes('/admin/')) {
            this.startSync();
            
            // Listen for page visibility changes to pause/resume sync
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseSync();
                } else {
                    this.resumeSync();
                }
            });

            // Listen for window focus/blur events
            window.addEventListener('focus', () => this.resumeSync());
            window.addEventListener('blur', () => this.pauseSync());
        }
    }

    /**
     * Start the synchronization process
     */
    startSync() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('Real-time sync started');
        
        // Initial sync
        this.checkForUpdates();
        
        // Set up periodic sync
        this.syncTimer = setInterval(() => {
            this.checkForUpdates();
        }, this.syncInterval);
    }

    /**
     * Pause synchronization
     */
    pauseSync() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
        console.log('Real-time sync paused');
    }

    /**
     * Resume synchronization
     */
    resumeSync() {
        if (this.isActive) return;
        
        this.startSync();
        console.log('Real-time sync resumed');
    }

    /**
     * Register a content type for monitoring
     */
    registerContent(contentType, callback) {
        this.contentCallbacks.set(contentType, callback);
        
        // Initialize timestamp for this content type
        if (!this.contentTimestamps.has(contentType)) {
            this.contentTimestamps.set(contentType, Date.now());
        }
        
        console.log(`Registered content type for sync: ${contentType}`);
    }

    /**
     * Unregister a content type
     */
    unregisterContent(contentType) {
        this.contentCallbacks.delete(contentType);
        this.contentTimestamps.delete(contentType);
        console.log(`Unregistered content type: ${contentType}`);
    }

    /**
     * Check for content updates
     */
    async checkForUpdates() {
        if (!this.isActive) return;

        const promises = [];
        
        // Check each registered content type
        for (const [contentType, callback] of this.contentCallbacks) {
            const lastUpdate = this.contentTimestamps.get(contentType) || 0;
            promises.push(this.checkContentUpdate(contentType, lastUpdate, callback));
        }

        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    /**
     * Check for updates to a specific content type
     */
    async checkContentUpdate(contentType, lastUpdate, callback) {
        try {
            const response = await fetch(`/api/content/update-status/${contentType}?lastUpdate=${lastUpdate}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data.hasUpdate) {
                console.log(`Content update detected for: ${contentType}`);
                
                // Update our timestamp
                this.contentTimestamps.set(contentType, data.data.timestamp);
                
                // Trigger the callback to reload content
                if (callback && typeof callback === 'function') {
                    await callback(contentType);
                }
                
                // Show notification to user
                this.showUpdateNotification(contentType);
            }
        } catch (error) {
            console.error(`Error checking update for ${contentType}:`, error);
        }
    }

    /**
     * Show update notification to user
     */
    showUpdateNotification(contentType) {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.className = 'content-update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-sync-alt"></i>
                <span>เนื้อหาได้รับการอัปเดตแล้ว</span>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.getElementById('sync-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'sync-notification-styles';
            styles.textContent = `
                .content-update-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    font-size: 14px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                
                .content-update-notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .notification-content i {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Force refresh all registered content
     */
    async forceRefreshAll() {
        console.log('Force refreshing all content...');
        
        const promises = [];
        for (const [contentType, callback] of this.contentCallbacks) {
            if (callback && typeof callback === 'function') {
                promises.push(callback(contentType));
            }
        }
        
        try {
            await Promise.all(promises);
            console.log('All content refreshed successfully');
        } catch (error) {
            console.error('Error during force refresh:', error);
        }
    }

    /**
     * Get sync status
     */
    getStatus() {
        return {
            isActive: this.isActive,
            registeredContentTypes: Array.from(this.contentCallbacks.keys()),
            syncInterval: this.syncInterval,
            lastCheck: Math.max(...Array.from(this.contentTimestamps.values()))
        };
    }
}

// Create global instance
window.realTimeSync = new RealTimeSync();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeSync;
}