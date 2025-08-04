# Huay Tueng Thao Website API Documentation

## Overview
This API provides content management functionality for the Huay Tueng Thao tourism website, handling JSON file operations for content retrieval and updates.

## Installation

```bash
cd api
npm install
```

## Running the API

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will run on `http://localhost:3001` by default.

## API Endpoints

### Content Retrieval (GET)

#### Get All Content by Type
```
GET /api/content/{type}
```

**Supported Types:**
- `homepage` - Homepage content (carousel, featured, gallery, news, services, updates)
- `history` - History page content
- `services` - Services page content  
- `contact` - Contact page content
- `about` - About page content
- `navigation` - Navigation menu data
- `footer` - Footer content

**Example Request:**
```bash
curl http://localhost:3001/api/content/homepage
```

**Example Response:**
```json
{
  "success": true,
  "message": "homepage content retrieved successfully",
  "data": {
    "carousel": { ... },
    "featured": { ... },
    "gallery": { ... },
    "news": { ... },
    "services": { ... },
    "updates": { ... }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Specific Content Section
```
GET /api/content/{type}/{section}
```

**Example Request:**
```bash
curl http://localhost:3001/api/content/homepage/carousel
```

**Example Response:**
```json
{
  "success": true,
  "message": "homepage/carousel content retrieved successfully",
  "data": {
    "slides": [
      {
        "id": 1,
        "title": "พ่อ แม่ ลูก",
        "description": "พ่อตึงเฒ่า แม่ขวัญข้าว น้องแรมเพจ ครบทีม พ่อแม่ลูกแห่งห้วยตึงเฒ่า",
        "backgroundClass": "carousel-image-1",
        "active": true,
        "slideIndex": 0
      }
    ],
    "controls": {
      "prevButton": true,
      "nextButton": true,
      "indicators": true
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Health Check
```
GET /api/health
```

Returns API status and timestamp.

## Admin Endpoints (POST)

### Update Content
```
POST /api/admin/content/{type}
```

Updates content for the specified type with backup functionality.

**Request Body:** JSON object with the updated content structure

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/admin/content/homepage-carousel \
  -H "Content-Type: application/json" \
  -d '{
    "slides": [
      {
        "id": 1,
        "title": "Updated Title",
        "description": "Updated description",
        "backgroundClass": "carousel-image-1",
        "active": true,
        "slideIndex": 0
      }
    ],
    "controls": {
      "prevButton": true,
      "nextButton": true,
      "indicators": true
    }
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "homepage-carousel content updated successfully",
  "data": {
    "type": "homepage-carousel",
    "fileName": "homepage-carousel.json",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Upload Image
```
POST /api/admin/upload
```

Uploads an image file for content management.

**Request:** Multipart form data with 'image' field

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/admin/upload \
  -F "image=@/path/to/image.jpg"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "fileName": "1642248600000_image.jpg",
    "originalName": "image.jpg",
    "size": 245760,
    "mimetype": "image/jpeg",
    "uploadPath": "/uploads/1642248600000_image.jpg",
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Get Backup History
```
GET /api/admin/backups/{type}
```

Retrieves backup history for a specific content type.

**Example Response:**
```json
{
  "success": true,
  "message": "Backup history retrieved successfully",
  "data": [
    {
      "fileName": "2024-01-15T10-30-00-000Z_homepage-carousel.json",
      "timestamp": "2024-01-15T10-30-00-000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Restore from Backup
```
POST /api/admin/restore/{type}/{backupFile}
```

Restores content from a specific backup file.

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/admin/restore/homepage-carousel/2024-01-15T10-30-00-000Z_homepage-carousel.json
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional error details (optional)",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Frontend Integration

### JavaScript Fetch Example

```javascript
// Get homepage content
async function getHomepageContent() {
  try {
    const response = await fetch('http://localhost:3001/api/content/homepage');
    const result = await response.json();
    
    if (result.success) {
      console.log('Homepage content:', result.data);
      return result.data;
    } else {
      console.error('API Error:', result.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
}

// Get specific carousel data
async function getCarouselData() {
  try {
    const response = await fetch('http://localhost:3001/api/content/homepage/carousel');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching carousel:', error);
  }
}
```

### jQuery Example

```javascript
// Get contact information
$.ajax({
  url: 'http://localhost:3001/api/content/contact',
  method: 'GET',
  success: function(result) {
    if (result.success) {
      console.log('Contact data:', result.data);
    }
  },
  error: function(xhr, status, error) {
    console.error('API Error:', error);
  }
});
```

### Admin Operations Examples

```javascript
// Update carousel content
async function updateCarousel(carouselData) {
  try {
    const response = await fetch('http://localhost:3001/api/admin/content/homepage-carousel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(carouselData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Carousel updated successfully');
      return result.data;
    } else {
      console.error('Update failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Upload image
async function uploadImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('http://localhost:3001/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Image uploaded:', result.data.uploadPath);
      return result.data;
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Get backup history
async function getBackupHistory(contentType) {
  try {
    const response = await fetch(`http://localhost:3001/api/admin/backups/${contentType}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching backups:', error);
  }
}
```

## Data Validation

The API includes built-in data validation for:
- JSON structure integrity
- Required fields validation
- Content type validation
- Input sanitization

## File Structure

```
api/
├── server.js              # Main API server
├── package.json           # Dependencies and scripts
├── modules/
│   ├── ContentAPI.js      # Content retrieval logic
│   └── AdminAPI.js        # Admin content updates (Task 4.2)
├── utils/
│   ├── APIResponse.js     # Response formatting
│   └── DataValidator.js   # Data validation utilities
└── README.md             # This documentation
```

## Development Notes

- The API reads JSON files from the `../data/` directory
- All responses include timestamps
- CORS is enabled for cross-origin requests
- Input sanitization prevents XSS attacks
- Comprehensive error handling with detailed logging