/**
 * CSOP Utility Functions
 */

/**
 * Generate unique ID
 * @returns {string} UUID-like identifier
 */
export function generateId() {
    return 'csop_' + crypto.randomUUID();
}

/**
 * Delay execution
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise}
 */
export async function retry(fn, maxRetries = 3, baseDelay = 100) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            if (attempt < maxRetries) {
                const waitTime = baseDelay * Math.pow(2, attempt);
                await delay(waitTime);
            }
        }
    }
    
    throw lastError;
}

/**
 * Throttle function execution
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Check if value is plain object
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function mergeDeep(target, source) {
    const output = { ...target };
    
    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach(key => {
            if (isPlainObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    
    return output;
}

/**
 * Safe JSON parse
 * @param {string} str - JSON string
 * @param {*} fallback - Fallback value if parse fails
 * @returns {*} Parsed object or fallback
 */
export function safeJsonParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

/**
 * Get browser info
 * @returns {Object} Browser information
 */
export function getBrowserInfo() {
    const ua = navigator.userAgent;
    
    return {
        userAgent: ua,
        platform: navigator.platform,
        language: navigator.language,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        memory: navigator.deviceMemory || 'unknown',
        connection: navigator.connection?.effectiveType || 'unknown',
        online: navigator.onLine
    };
}

/**
 * Check if feature is supported
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export function isSupported(feature) {
    const features = {
        indexeddb: 'indexedDB' in window,
        workers: 'Worker' in window,
        websocket: 'WebSocket' in window,
        serviceworker: 'serviceWorker' in navigator,
        notifications: 'Notification' in window,
        geolocation: 'geolocation' in navigator,
        crypto: 'crypto' in window && 'subtle' in crypto
    };
    
    return features[feature.toLowerCase()] || false;
}

/**
 * Log with timestamp
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {*} data - Additional data
 */
export function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[CSOP ${timestamp}]`;
    
    switch(level) {
        case 'error':
            console.error(prefix, message, data);
            break;
        case 'warn':
            console.warn(prefix, message, data);
            break;
        default:
            console.log(prefix, message, data);
    }
}