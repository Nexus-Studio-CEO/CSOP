/**
 * CSOP Input Validation Layer
 * Version: 0.2.0
 * Author: DAOUDA Abdoul Anzize - Nexus Studio
 */

export const ValidationSchemas = {
    'storage.save': {
        key: { type: 'string', required: true, maxLength: 200 },
        data: { type: 'any', required: true }
    },
    'storage.get': {
        key: { type: 'string', required: true }
    },
    'compute.execute': {
        task: { type: 'string', required: true },
        data: { type: 'object', required: true }
    }
};

export function validatePayload(action, payload) {
    const schema = ValidationSchemas[action];
    if (!schema) {
        throw new ValidationError(`Unknown action: ${action}`);
    }
    
    for (const [field, rules] of Object.entries(schema)) {
        const value = payload[field];
        if (rules.required && value === undefined) {
            throw new ValidationError(`Missing required field: ${field}`);
        }
        if (value !== undefined && !isValidType(value, rules.type)) {
            throw new ValidationError(`Invalid type for ${field}`);
        }
    }
}

function isValidType(value, type) {
    if (type === 'any') return true;
    if (type === 'string') return typeof value === 'string';
    if (type === 'number') return typeof value === 'number';
    if (type === 'object') return typeof value === 'object' && value !== null;
    return false;
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.code = 'VALIDATION_ERROR';
    }
}
