import { CSPValidator } from './validation.js';
import { ErrorCodes, CSOPError } from './errors.js';

/**
 * CSOP - Client-Side Orchestration Protocol
 * Version: 0.1.0
 * License: MIT
 * Author: Anzize Daouda
 */

import { StorageCapability } from './capabilities/storage.js';
import { ComputeCapability } from './capabilities/compute.js';
import { SyncCapability } from './capabilities/sync.js';
import { generateId, delay } from './utils.js';
import { validatePayload, ValidationError } from './validation.js';
import { CSOPError, ErrorCodes, createErrorResponse } from './errors.js';


/**
 * Main CSOP Class - Protocol Router
 */
export class CSOP {
    constructor() {
        this.version = '0.2.0';
        this.capabilities = new Map();
        this.pending = new Map();
        this.initialized = false;
    }

    /**
     * Initialize CSOP with default capabilities
     */
    async init(config = {}) {
        if (this.initialized) {
            console.warn('CSOP already initialized');
            return;
        }

        console.log(`🚀 CSOP v${this.version} initializing...`);

        // Initialize capabilities
        const storage = new StorageCapability();
        const compute = new ComputeCapability();
        const sync = new SyncCapability();

        await storage.init(config.storage);
        await compute.init(config.compute);
        await sync.init(config.sync);

        // Register capabilities
        this.register('storage', storage);
        this.register('compute', compute);
        this.register('sync', sync);

        this.initialized = true;
        console.log('✅ CSOP Ready');
    }

    /**
     * Register a capability
     * @param {string} name - Capability name (domain)
     * @param {Object} capability - Capability instance
     */
    register(name, capability) {
        this.capabilities.set(name, capability);
        console.log(`📦 Capability registered: ${name}`);
    }

    /**
     * Get a capability instance (for advanced configuration)
     * @param {string} name - Capability name
     * @returns {Object} Capability instance
     */
    getCapability(name) {
        return this.capabilities.get(name);
    }

    /**
     * Main dispatch method - Routes messages to capabilities
     * @param {string} action - Action in format "domain.operation"
     * @param {Object} payload - Action payload
     * @param {Object} options - Execution options (retry, timeout)
     * @returns {Promise<Object>} Response object
     */
    async dispatch(action, payload = {}, options = {}) {
        if (!this.initialized) {
            throw new Error('CSOP not initialized. Call csop.init() first.');
        }

        // Create message
        const message = {
            id: generateId(),
            action,
            payload,
            options: {
                timeout: 5000,
                retry: 0,
                ...options
            }
        };

        console.log(`📤 Dispatching: ${action}`, message.id);

        // Parse action
        const [domain, operation] = action.split('.');
        
        if (!domain || !operation) {
            return this._errorResponse(message.id, 'INVALID_ACTION', 
                `Action must be in format "domain.operation", got "${action}"`);
        }

        // Get capability
        const capability = this.capabilities.get(domain);
        
        if (!capability) {
            return this._errorResponse(message.id, 'CAPABILITY_NOT_FOUND', 
                `No capability registered for domain "${domain}"`);
        }

        // Check if operation exists
        if (typeof capability[operation] !== 'function') {
            return this._errorResponse(message.id, 'OPERATION_NOT_FOUND', 
                `Operation "${operation}" not found in capability "${domain}"`);
        }

        // Execute with retry
        return await this._executeWithRetry(message, capability, operation);
    }

    /**
     * Execute message with automatic retry and timeout
     * @private
     */
    async _executeWithRetry(message, capability, operation) {
        const maxRetries = message.options.retry;
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                // Execute with timeout
                const startTime = Date.now();
                const result = await this._withTimeout(
                    capability[operation](message.payload),
                    message.options.timeout
                );
                const duration = Date.now() - startTime;

                console.log(`✅ Success: ${message.action} (${duration}ms)`);

                return {
                    id: message.id,
                    status: 'ok',
                    data: result,
                    duration
                };

            } catch (error) {
                lastError = error;
                
                // Log retry attempt
                if (attempt < maxRetries) {
                    const waitTime = Math.pow(2, attempt) * 100; // Exponential backoff
                    console.warn(`⚠️ Retry ${attempt + 1}/${maxRetries} for ${message.action} after ${waitTime}ms`);
                    await delay(waitTime);
                }
            }
        }

        // All retries failed
        console.error(`❌ Failed: ${message.action}`, lastError);
        
        return this._errorResponse(
            message.id, 
            lastError.code || 'EXECUTION_FAILED',
            lastError.message || 'Unknown error'
        );
    }

    /**
     * Wrap promise with timeout
     * @private
     */
    _withTimeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('TIMEOUT')), ms)
            )
        ]);
    }

    /**
     * Create error response
     * @private
     */
    _errorResponse(id, code, message) {
        return {
            id,
            status: 'error',
            error: {
                code,
                message,
                retry: !['INVALID_ACTION', 'CAPABILITY_NOT_FOUND', 'OPERATION_NOT_FOUND'].includes(code)
            }
        };
    }

    /**
     * Get CSOP info
     */
    info() {
        return {
            version: this.version,
            initialized: this.initialized,
            capabilities: Array.from(this.capabilities.keys())
        };
    }
}

// Default export
export default CSOP;