/**
 * CSOP Storage Capability
 * Handles data persistence (IndexedDB + optional Turso)
 */

export class StorageCapability {
    constructor() {
        this.db = null;
        this.dbName = 'csop-storage';
        this.storeName = 'data';
        this.tursoConfig = null;
        this.maxLocalSize = 5 * 1024 * 1024; // 5MB threshold
    }

    /**
     * Initialize IndexedDB
     */
    async init(config = {}) {
        this.maxLocalSize = config.maxLocalSize || this.maxLocalSize;
        
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(new Error('Failed to open IndexedDB'));
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('💾 IndexedDB initialized');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    /**
     * Configure Turso for cloud storage fallback
     */
    configureTurso(config) {
        this.tursoConfig = config;
        console.log('☁️ Turso configured');
    }

    /**
     * SAVE - Store data (auto-routing to IndexedDB or Turso)
     */
    async save({ key, data, options = {} }) {
        if (!key) {
            throw new Error('Key is required');
        }

        const dataStr = JSON.stringify(data);
        const size = new Blob([dataStr]).size;

        // Small data → IndexedDB
        if (size < this.maxLocalSize) {
            await this._saveLocal(key, data);
            return {
                key,
                location: 'indexeddb',
                size
            };
        }

        // Large data → Turso (if configured)
        if (this.tursoConfig) {
            await this._saveCloud(key, data);
            return {
                key,
                location: 'turso',
                size
            };
        }

        // Fallback to IndexedDB with warning
        console.warn(`⚠️ Data size ${size} bytes exceeds threshold but Turso not configured. Using IndexedDB.`);
        await this._saveLocal(key, data);
        return {
            key,
            location: 'indexeddb',
            size,
            warning: 'Large data stored locally'
        };
    }

    /**
     * GET - Retrieve data
     */
    async get({ key }) {
        if (!key) {
            throw new Error('Key is required');
        }

        // Try IndexedDB first
        try {
            const data = await this._getLocal(key);
            if (data !== undefined) {
                return data;
            }
        } catch (err) {
            console.warn('Failed to get from IndexedDB', err);
        }

        // Fallback to Turso
        if (this.tursoConfig) {
            try {
                const data = await this._getCloud(key);
                if (data !== null) {
                    return data;
                }
            } catch (err) {
                console.warn('Failed to get from Turso', err);
            }
        }

        // Not found anywhere
        const error = new Error(`Key "${key}" not found`);
        error.code = 'KEY_NOT_FOUND';
        throw error;
    }

    /**
     * DELETE - Remove data
     */
    async delete({ key }) {
        if (!key) {
            throw new Error('Key is required');
        }

        // Delete from IndexedDB
        await this._deleteLocal(key);

        // Delete from Turso if configured
        if (this.tursoConfig) {
            await this._deleteCloud(key);
        }

        return { deleted: true, key };
    }

    /**
     * LIST - Get all keys (with optional prefix filter)
     */
    async list({ prefix = '' } = {}) {
        const keys = await this._listLocal();
        
        if (prefix) {
            return keys.filter(k => k.startsWith(prefix));
        }
        
        return keys;
    }

    // === PRIVATE METHODS: IndexedDB ===

    async _saveLocal(key, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(data, key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to save to IndexedDB'));
        });
    }

    async _getLocal(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error('Failed to get from IndexedDB'));
        });
    }

    async _deleteLocal(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to delete from IndexedDB'));
        });
    }

    async _listLocal() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error('Failed to list keys from IndexedDB'));
        });
    }

    // === PRIVATE METHODS: Turso (Cloud) ===

    async _saveCloud(key, data) {
        // Note: This is a placeholder for Turso integration
        // Users need to implement their Turso client or use fetch API
        console.warn('⚠️ Turso save not fully implemented in v0.1.0');
        
        if (!this.tursoConfig.url || !this.tursoConfig.authToken) {
            throw new Error('Turso configuration incomplete');
        }

        // Example implementation structure:
        // const response = await fetch(`${this.tursoConfig.url}/execute`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${this.tursoConfig.authToken}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         sql: 'INSERT OR REPLACE INTO storage (key, data) VALUES (?, ?)',
        //         args: [key, JSON.stringify(data)]
        //     })
        // });
    }

    async _getCloud(key) {
        console.warn('⚠️ Turso get not fully implemented in v0.1.0');
        return null;
    }

    async _deleteCloud(key) {
        console.warn('⚠️ Turso delete not fully implemented in v0.1.0');
    }
}