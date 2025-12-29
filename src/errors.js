/**
 * CSOP Error Codes
 * Standardized error handling
 */

export const ErrorCodes = {
  // Capability errors
  CAPABILITY_NOT_FOUND: { code: 1001, message: 'Capability not registered' },
  CAPABILITY_INIT_FAILED: { code: 1002, message: 'Capability initialization failed' },
  CAPABILITY_NAME_INVALID: { code: 1003, message: 'Invalid capability name' },
  
  // Storage errors
  STORAGE_KEY_INVALID: { code: 2001, message: 'Invalid storage key' },
  STORAGE_VALUE_INVALID: { code: 2002, message: 'Invalid storage value' },
  STORAGE_QUOTA_EXCEEDED: { code: 2003, message: 'Storage quota exceeded' },
  STORAGE_OPERATION_FAILED: { code: 2004, message: 'Storage operation failed' },
  
  // Config errors
  CONFIG_INVALID: { code: 3001, message: 'Invalid configuration' },
  
  // General errors
  UNKNOWN_ERROR: { code: 9999, message: 'Unknown error occurred' }
};

export class CSOPError extends Error {
  constructor(errorCode, details = {}) {
    const error = ErrorCodes[errorCode] || ErrorCodes.UNKNOWN_ERROR;
    super(error.message);
    this.name = 'CSOPError';
    this.code = error.code;
    this.errorCode = errorCode;
    this.details = details;
  }
}
