/**
 * API Usage Examples
 * Demonstrates how to use the AJAX-based CRUD API
 */

// Example 1: Get homepage content
async function loadHomepageContent() {
    try {
        const result = await ContentAPI.get('homepage');
        if (result.success) {
            console.log('Homepage content loaded:', result.data);
            
            // Access specific sections
            const carousel = result.data.carousel;
            const featured = result.data.featured;
            const gallery = result.data.gallery;
            
            // Update UI with content
            updateCarousel(carousel);
            updateFeaturedSection(featured);
            updateGallery(gallery);
        }
    } catch (error) {
        console.error('Failed to load homepage content:', error);
    }
}

// Example 2: Get specific content section
async function loadCarouselContent() {
    try {
        const result = await ContentAPI.get('homepage', 'carousel');
        if (result.success) {
            console.log('Carousel content:', result.data);
            updateCarousel(result.data);
        }
    } catch (error) {
        console.error('Failed to load carousel:', error);
    }
}

// Example 3: Get contact information
async function loadContactInfo() {
    try {
        const result = await ContentAPI.get('contact');
        if (result.success) {
            console.log('Contact info:', result.data);
            updateContactPage(result.data);
        }
    } catch (error) {
        console.error('Failed to load contact info:', error);
    }
}

// Example 4: Update carousel content (Admin)
async function updateCarouselContent() {
    const newCarouselData = {
        slides: [
            {
                id: 1,
                title: "Updated Title",
                description: "Updated description text",
                backgroundClass: "carousel-image-1",
                active: true,
                slideIndex: 0
            },
            {
                id: 2,
                title: "Second Slide",
                description: "Second slide description",
                backgroundClass: "carousel-image-2",
                active: false,
                slideIndex: 1
            }
        ],
        controls: {
            prevButton: true,
            nextButton: true,
            indicators: true
        }
    };
    
    try {
        const result = await AdminAPI.update('homepage-carousel', newCarouselData);
        if (result.success) {
            console.log('Carousel updated successfully:', result.data);
            alert('Carousel updated successfully!');
            
            // Reload the page to show changes
            location.reload();
        }
    } catch (error) {
        console.error('Failed to update carousel:', error);
        alert('Failed to update carousel: ' + error.message);
    }
}

// Example 5: Upload image
async function handleImageUpload(fileInput) {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image file');
        return;
    }
    
    try {
        const result = await AdminAPI.uploadImage(file);
        if (result.success) {
            console.log('Image uploaded:', result.data);
            alert(`Image uploaded successfully: ${result.data.fileName}`);
            
            // You can now use result.data.uploadPath in your content
            return result.data.uploadPath;
        }
    } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image: ' + error.message);
    }
}

// Example 6: Get backup history
async function showBackupHistory(contentType) {
    try {
        const result = await AdminAPI.getBackupHistory(contentType);
        if (result.success) {
            console.log('Backup history:', result.data);
            
            const backupList = result.data.map(backup => 
                `${backup.fileName} (Created: ${new Date(backup.createdAt).toLocaleString()})`
            ).join('\n');
            
            alert(`Backup History for ${contentType}:\n\n${backupList}`);
        }
    } catch (error) {
        console.error('Failed to get backup history:', error);
    }
}

// Example 7: Restore from backup
async function restoreFromBackup(contentType, backupKey) {
    if (!confirm(`Are you sure you want to restore ${contentType} from backup?`)) {
        return;
    }
    
    try {
        const result = await AdminAPI.restoreFromBackup(contentType, backupKey);
        if (result.success) {
            console.log('Restored from backup:', result.data);
            alert('Content restored successfully!');
            location.reload();
        }
    } catch (error) {
        console.error('Failed to restore from backup:', error);
        alert('Failed to restore from backup: ' + error.message);
    }
}

// Helper functions for UI updates
function updateCarousel(carouselData) {
    if (!carouselData || !carouselData.slides) return;
    
    const carouselContainer = $('#carousel-container');
    if (carouselContainer.length === 0) return;
    
    // Clear existing slides
    carouselContainer.empty();
    
    // Add new slides
    carouselData.slides.forEach((slide, index) => {
        const slideHtml = `
            <div class="carousel-slide ${slide.active ? 'active' : ''}" data-slide="${index}">
                <div class="${slide.backgroundClass}">
                    <div class="carousel-content">
                        <h2>${slide.title}</h2>
                        <p>${slide.description}</p>
                    </div>
                </div>
            </div>
        `;
        carouselContainer.append(slideHtml);
    });
}

function updateFeaturedSection(featuredData) {
    if (!featuredData) return;
    
    const featuredContainer = $('#featured-container');
    if (featuredContainer.length === 0) return;
    
    // Update featured content based on data structure
    console.log('Updating featured section:', featuredData);
}

function updateGallery(galleryData) {
    if (!galleryData) return;
    
    const galleryContainer = $('#gallery-container');
    if (galleryContainer.length === 0) return;
    
    // Update gallery content based on data structure
    console.log('Updating gallery:', galleryData);
}

function updateContactPage(contactData) {
    if (!contactData || !contactData.contact) return;
    
    const contact = contactData.contact;
    
    // Update contact information
    $('#contact-title').text(contact.title || '');
    $('#contact-organization').text(contact.organization || '');
    $('#contact-address').text(contact.address?.fullAddress || '');
    $('#contact-phone').text(contact.phone || '');
    $('#contact-email').text(contact.email || '');
}

// jQuery document ready
$(document).ready(function() {
    console.log('API Examples loaded. Available functions:');
    console.log('- loadHomepageContent()');
    console.log('- loadCarouselContent()');
    console.log('- loadContactInfo()');
    console.log('- updateCarouselContent() [Admin]');
    console.log('- handleImageUpload(fileInput) [Admin]');
    console.log('- showBackupHistory(contentType) [Admin]');
    console.log('- restoreFromBackup(contentType, backupKey) [Admin]');
});