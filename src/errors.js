/**
 * CSOP Standardized Error System
 * Version: 0.2.0
 * Author: DAOUDA Abdoul Anzize - Nexus Studio
 */

export const ErrorCodes = {
    NOT_INITIALIZED: 'NOT_INITIALIZED',
    INVALID_ACTION: 'INVALID_ACTION',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TIMEOUT: 'TIMEOUT',
    CAPABILITY_NOT_FOUND: 'CAPABILITY_NOT_FOUND',
    OPERATION_NOT_FOUND: 'OPERATION_NOT_FOUND',
    KEY_NOT_FOUND: 'KEY_NOT_FOUND',
    STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
    COMPUTE_TIMEOUT: 'COMPUTE_TIMEOUT'
};

export class CSOPError extends Error {
    constructor(code, message, retryable = true) {
        super(message);
        this.name = 'CSOPError';
        this.code = code;
        this.retryable = retryable;
    }
}

export function createErrorResponse(id, code, message, retryable = true) {
    return {
        id,
        status: 'error',
        error: { code, message, retry: retryable }
    };
}
