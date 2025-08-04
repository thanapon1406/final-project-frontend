/**
 * API Response Utility
 * Standardized response format for all API endpoints
 */

class APIResponse {
    
    /**
     * Send successful response
     */
    static success(res, data = null, message = 'Success', code = 200) {
        res.status(code).json({
            success: true,
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Send error response
     */
    static error(res, message = 'Error', code = 400, details = null) {
        res.status(code).json({
            success: false,
            message: message,
            details: details,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Send validation error response
     */
    static validationError(res, errors, message = 'Validation failed') {
        this.error(res, message, 422, errors);
    }
    
    /**
     * Send not found response
     */
    static notFound(res, message = 'Resource not found') {
        this.error(res, message, 404);
    }

    /**
     * Send unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized access') {
        this.error(res, message, 401);
    }

    /**
     * Send forbidden response
     */
    static forbidden(res, message = 'Access forbidden') {
        this.error(res, message, 403);
    }
}

module.exports = APIResponse;