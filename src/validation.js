/**
 * CSOP Validation Layer
 * Input validation and sanitization
 */

export class CSPValidator {
  static validateCapability(name) {
    if (typeof name !== 'string') {
      throw new Error('CAPABILITY_NAME_INVALID: Must be string');
    }
    if (!/^[a-z_][a-z0-9_]*$/i.test(name)) {
      throw new Error('CAPABILITY_NAME_INVALID: Invalid format');
    }
    return name;
  }

  static validateStorageKey(key) {
    if (typeof key !== 'string') {
      throw new Error('STORAGE_KEY_INVALID: Must be string');
    }
    if (key.length === 0 || key.length > 255) {
      throw new Error('STORAGE_KEY_INVALID: Length must be 1-255');
    }
    return key;
  }

  static validateStorageValue(value) {
    try {
      JSON.stringify(value);
      return value;
    } catch (e) {
      throw new Error('STORAGE_VALUE_INVALID: Must be JSON serializable');
    }
  }

  static validateConfig(config) {
    if (typeof config !== 'object' || config === null) {
      throw new Error('CONFIG_INVALID: Must be object');
    }
    return config;
  }
}
