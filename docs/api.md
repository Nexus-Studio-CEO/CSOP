# 📘 CSOP v0.1.0 - API Reference

Complete reference for all CSOP capabilities and methods.

---

## 🎯 Core API

### CSOP Class

#### `new CSOP()`

Creates a new CSOP instance.

```javascript
import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
const csop = new CSOP();
```

#### `async init(config?)`

Initialize CSOP with optional configuration.

**Parameters:**
- `config.storage` - Storage configuration
- `config.compute` - Compute configuration  
- `config.sync` - Sync configuration

**Returns:** `Promise<void>`

```javascript
await csop.init({
    storage: {
        maxLocalSize: 10 * 1024 * 1024 // 10MB threshold
    },
    compute: {
        numWorkers: 8 // Override auto-detection
    }
});
```

#### `async dispatch(action, payload, options?)`

Main method to execute actions.

**Parameters:**
- `action` (string) - Action in format "domain.operation"
- `payload` (object) - Action-specific data
- `options` (object) - Execution options
  - `timeout` (number) - Timeout in ms (default: 5000)
  - `retry` (number) - Max retry attempts (default: 0)

**Returns:** `Promise<Response>`

**Response format:**
```javascript
{
    id: "csop_abc123",
    status: "ok" | "error",
    data: any,              // If success
    error: {                // If error
        code: "ERROR_CODE",
        message: "Error description",
        retry: boolean
    },
    duration: 123          // Execution time in ms
}
```

**Example:**
```javascript
const result = await csop.dispatch('storage.save', 
    { key: 'my-key', data: {...} },
    { timeout: 10000, retry: 3 }
);
```

#### `getCapability(name)`

Get capability instance for advanced configuration.

**Parameters:**
- `name` (string) - Capability name ("storage", "compute", "sync")

**Returns:** Capability instance

```javascript
const storage = csop.getCapability('storage');
storage.configureTurso({ url, authToken });
```

#### `info()`

Get CSOP information.

**Returns:**
```javascript
{
    version: "0.1.0",
    initialized: boolean,
    capabilities: ["storage", "compute", "sync"]
}
```

---

## 💾 Storage API

### Actions

#### `storage.save`

Save data with intelligent routing (IndexedDB or Turso).

**Payload:**
```javascript
{
    key: string,           // Storage key (required)
    data: any,            // Data to save (required)
    options?: {
        encrypt?: boolean,
        compress?: boolean
    }
}
```

**Response:**
```javascript
{
    key: string,
    location: "indexeddb" | "turso",
    size: number           // Size in bytes
}
```

**Example:**
```javascript
await csop.dispatch('storage.save', {
    key: 'user_profile',
    data: { name: 'Anzize', role: 'CEO' }
});
```

#### `storage.get`

Retrieve data by key.

**Payload:**
```javascript
{
    key: string           // Storage key (required)
}
```

**Response:** The stored data

**Throws:** Error with code `KEY_NOT_FOUND` if not exists

**Example:**
```javascript
const result = await csop.dispatch('storage.get', {
    key: 'user_profile'
});
console.log(result.data); // { name: 'Anzize', role: 'CEO' }
```

#### `storage.delete`

Delete data by key.

**Payload:**
```javascript
{
    key: string           // Storage key (required)
}
```

**Response:**
```javascript
{
    deleted: true,
    key: string
}
```

#### `storage.list`

List all keys with optional prefix filter.

**Payload:**
```javascript
{
    prefix?: string       // Filter by prefix (optional)
}
```

**Response:** Array of key strings

**Example:**
```javascript
// List all keys
const all = await csop.dispatch('storage.list', {});

// List keys with prefix
const users = await csop.dispatch('storage.list', { 
    prefix: 'user_' 
});
```

### Advanced Configuration

#### Turso Integration

```javascript
const storage = csop.getCapability('storage');
storage.configureTurso({
    url: 'libsql://your-db.turso.io',
    authToken: 'your_token_here'
});
```

**Note:** Turso implementation is placeholder in v0.1.0. Full support in v0.2.0.

---

## ⚡ Compute API

### Actions

#### `compute.execute`

Execute a single computational task.

**Payload:**
```javascript
{
    task: string,         // Task name (required)
    data: object,         // Task-specific data
    options?: {
        timeout?: number
    }
}
```

**Built-in tasks:**
- `fibonacci` - Calculate Fibonacci number
  - `data.n` (number) - Position
- `factorial` - Calculate factorial
  - `data.n` (number) - Input
- `isPrime` - Check if number is prime
  - `data.n` (number) - Number to check
- `hash_sha256` - Hash string (simple hash in v0.1.0)
  - `data.message` (string) - Text to hash
- `sum` - Sum array of numbers
  - `data.numbers` (array) - Numbers to sum
- `custom` - Execute custom function
  - `data.fn` (string) - Function body
  - `data.args` (object) - Arguments

**Response:** Task result (type depends on task)

**Example:**
```javascript
// Fibonacci
const fib = await csop.dispatch('compute.execute', {
    task: 'fibonacci',
    data: { n: 100 }
});

// Custom function
const custom = await csop.dispatch('compute.execute', {
    task: 'custom',
    data: {
        fn: 'return data.a + data.b',
        args: { a: 10, b: 20 }
    }
});
```

#### `compute.batch`

Execute multiple tasks in parallel.

**Payload:**
```javascript
{
    tasks: [              // Array of tasks (required)
        {
            task: string,
            data: object
        },
        ...
    ],
    options?: {
        maxConcurrent?: number,
        failFast?: boolean
    }
}
```

**Response:**
```javascript
{
    total: number,        // Total tasks
    completed: number,    // Successfully completed
    failed: number,       // Failed tasks
    results: [            // Array of results
        {
            status: "fulfilled" | "rejected",
            task: string,
            result?: any,
            error?: string
        },
        ...
    ]
}
```

**Example:**
```javascript
const result = await csop.dispatch('compute.batch', {
    tasks: [
        { task: 'fibonacci', data: { n: 50 } },
        { task: 'factorial', data: { n: 10 } },
        { task: 'isPrime', data: { n: 97 } }
    ]
});

console.log(`${result.data.completed}/${result.data.total} succeeded`);
```

### Advanced Configuration

```javascript
const compute = csop.getCapability('compute');
await compute.init({
    numWorkers: 16  // Override auto-detection
});
```

---

## 🔄 Sync API

### Actions

#### `sync.broadcast`

Broadcast message to all subscribers.

**Payload:**
```javascript
{
    event: string,        // Event name (required)
    data: any,           // Message data
    channel?: string     // Channel name (default: "default")
}
```

**Response:**
```javascript
{
    sent: true,
    channel: string,
    event: string,
    mode?: "local"       // If no backend configured
}
```

**Example:**
```javascript
await csop.dispatch('sync.broadcast', {
    event: 'user_joined',
    data: { userId: 'anzize', timestamp: Date.now() }
});
```

#### `sync.subscribe`

Subscribe to channel events.

**Payload:**
```javascript
{
    channel?: string,     // Channel name (default: "default")
    callback: function    // Callback function (required)
}
```

**Callback receives:**
```javascript
{
    event: string,
    data: any,
    timestamp: number
}
```

**Response:**
```javascript
{
    subscribed: true,
    channel: string,
    mode?: "local"
}
```

**Example:**
```javascript
await csop.dispatch('sync.subscribe', {
    channel: 'workspace',
    callback: (message) => {
        console.log(`Received: ${message.event}`, message.data);
    }
});
```

#### `sync.presence`

Track and retrieve online users.

**Payload:**
```javascript
{
    channel?: string,     // Channel name (default: "default")
    userId?: string,      // User ID (auto-generated if omitted)
    metadata?: object     // Additional user data
}
```

**Response:**
```javascript
{
    online: number,       // Number of online users
    users: [              // Array of users
        {
            userId: string,
            onlineAt: string,
            ...metadata
        },
        ...
    ]
}
```

**Example:**
```javascript
const presence = await csop.dispatch('sync.presence', {
    channel: 'editor',
    userId: 'anzize',
    metadata: { name: 'Anzize', role: 'CEO' }
});

console.log(`${presence.data.online} users online`);
```

#### `sync.unsubscribe`

Stop listening to channel.

**Payload:**
```javascript
{
    channel?: string      // Channel name (default: "default")
}
```

**Response:**
```javascript
{
    unsubscribed: true,
    channel: string
}
```

### Advanced Configuration

#### Supabase Integration

```javascript
const sync = csop.getCapability('sync');
await sync.configureSupabase({
    url: 'https://your-project.supabase.co',
    anonKey: 'your_anon_key'
});
```

**Note:** Requires Supabase SDK:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

## 🛠️ Utility Functions

### `generateId()`

Generate unique ID.

```javascript
import { generateId } from './utils.js';
const id = generateId(); // "csop_abc123..."
```

### `delay(ms)`

Async delay.

```javascript
import { delay } from './utils.js';
await delay(1000); // Wait 1 second
```

### `formatBytes(bytes)`

Format bytes to human-readable.

```javascript
import { formatBytes } from './utils.js';
formatBytes(1024); // "1 KB"
```

### `retry(fn, maxRetries, baseDelay)`

Retry function with exponential backoff.

```javascript
import { retry } from './utils.js';
const result = await retry(
    () => fetch('/api/data'),
    3,    // Max retries
    100   // Base delay ms
);
```

---

## ⚠️ Error Codes

### Storage Errors
- `KEY_NOT_FOUND` - Key doesn't exist
- `QUOTA_EXCEEDED` - Storage quota exceeded
- `SAVE_FAILED` - Failed to save data

### Compute Errors
- `TIMEOUT` - Task exceeded timeout
- `WORKER_CRASHED` - Web Worker crashed
- `INVALID_TASK` - Unknown task name

### Sync Errors
- `NOT_CONNECTED` - Backend not configured
- `CHANNEL_ERROR` - Failed to access channel
- `SUBSCRIPTION_FAILED` - Failed to subscribe

### Core Errors
- `INVALID_ACTION` - Malformed action string
- `CAPABILITY_NOT_FOUND` - Unknown capability
- `OPERATION_NOT_FOUND` - Unknown operation
- `EXECUTION_FAILED` - Generic execution error
- `NOT_INITIALIZED` - CSOP not initialized

---

## 📊 Response Examples

### Success Response
```javascript
{
    id: "csop_7f8a9b2c",
    status: "ok",
    data: { /* result */ },
    duration: 234
}
```

### Error Response
```javascript
{
    id: "csop_7f8a9b2c",
    status: "error",
    error: {
        code: "TIMEOUT",
        message: "Operation exceeded 5000ms timeout",
        retry: true
    }
}
```

---

## 🔗 TypeScript Support

TypeScript definitions coming in v0.2.0. For now, use JSDoc:

```javascript
/**
 * @typedef {Object} SavePayload
 * @property {string} key
 * @property {*} data
 */

/** @type {SavePayload} */
const payload = { key: 'test', data: {...} };
```

---

**Created by DAOUDA Abdoul Anzize - CEO, Nexus Studio**  
**Contact:** nexusstudio100@gmail.com  
**GitHub:** https://github.com/Nexus-Studio-CEO/csop