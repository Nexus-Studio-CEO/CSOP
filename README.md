# 🌐 CSOP - Client-Side Orchestration Protocol

[![npm version](https://img.shields.io/npm/v/@tryboy869/csop.svg)](https://www.npmjs.com/package/@tryboy869/csop)
[![npm downloads](https://img.shields.io/npm/dm/@tryboy869/csop.svg)](https://www.npmjs.com/package/@tryboy869/csop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Nexus-Studio-CEO/CSOP.svg)](https://github.com/Nexus-Studio-CEO/CSOP)

> Enterprise-grade client-side orchestration protocol for modern web applications

CSOP provides a unified interface for managing browser capabilities (storage, compute, sync) with enterprise-grade reliability, performance, and developer experience.

## ✨ Features

- 🗄️ **Unified Storage** - IndexedDB wrapper with simple API
- ⚡ **Web Workers** - Parallel computation with worker pool management
- 🔄 **Real-time Sync** - WebSocket/Server-Sent Events integration
- 🎯 **Type-Safe** - Full TypeScript support (coming soon)
- 🧪 **Tested** - Comprehensive test suite
- 📦 **Lightweight** - < 10KB gzipped
- 🌐 **CDN Ready** - Available via unpkg and jsDelivr

## 📦 Installation

### NPM (Recommended)

```bash
npm install @tryboy869/csop
```

### Yarn

```bash
yarn add @tryboy869/csop
```

### PNPM

```bash
pnpm add @tryboy869/csop
```

### CDN

#### unpkg

```html
<script type="module">
  import { CSOP } from 'https://unpkg.com/@tryboy869/csop@0.1.0';
</script>
```

#### jsDelivr

```html
<script type="module">
  import { CSOP } from 'https://cdn.jsdelivr.net/npm/@tryboy869/csop@0.1.0';
</script>
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { CSOP } from '@tryboy869/csop';

// Initialize CSOP
const csop = new CSOP();
await csop.init();

// Use storage capability
const storage = csop.getCapability('storage');
await storage.set('user', { name: 'John', role: 'admin' });
const user = await storage.get('user');
console.log(user); // { name: 'John', role: 'admin' }
```

### With Configuration

```javascript
import { CSOP } from '@tryboy869/csop';

const csop = new CSOP({
  storage: {
    dbName: 'myapp',
    version: 1
  },
  compute: {
    maxWorkers: 4
  }
});

await csop.init();
```

## 📚 API Documentation

### Core API

#### `new CSOP(config?)`

Creates a new CSOP instance with optional configuration.

```javascript
const csop = new CSOP({
  storage: { dbName: 'myapp' },
  compute: { maxWorkers: 4 },
  sync: { endpoint: 'wss://api.example.com' }
});
```

#### `csop.init(): Promise<void>`

Initializes all registered capabilities.

```javascript
await csop.init();
```

#### `csop.getCapability(name: string): Capability`

Retrieves a registered capability.

```javascript
const storage = csop.getCapability('storage');
```

### Storage Capability

#### `storage.set(key: string, value: any): Promise<void>`

Stores a value in IndexedDB.

```javascript
await storage.set('settings', { theme: 'dark', lang: 'en' });
```

#### `storage.get(key: string): Promise<any>`

Retrieves a value from IndexedDB.

```javascript
const settings = await storage.get('settings');
```

#### `storage.delete(key: string): Promise<void>`

Deletes a value from IndexedDB.

```javascript
await storage.delete('settings');
```

#### `storage.clear(): Promise<void>`

Clears all data from IndexedDB.

```javascript
await storage.clear();
```

### Compute Capability

#### `compute.execute(task: Function, data: any): Promise<any>`

Executes a task in a Web Worker.

```javascript
const result = await compute.execute((data) => {
  return data.numbers.reduce((a, b) => a + b, 0);
}, { numbers: [1, 2, 3, 4, 5] });

console.log(result); // 15
```

### Sync Capability

#### `sync.connect(): Promise<void>`

Establishes a real-time connection.

```javascript
await sync.connect();
```

#### `sync.subscribe(channel: string, callback: Function): void`

Subscribes to a channel for real-time updates.

```javascript
sync.subscribe('updates', (data) => {
  console.log('Received:', data);
});
```

## 🌐 CDN Usage

CSOP is available on multiple CDNs for easy integration without a build step.

### unpkg (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <title>CSOP Example</title>
</head>
<body>
  <script type="module">
    import { CSOP } from 'https://unpkg.com/@tryboy869/csop@0.1.0';
    
    const csop = new CSOP();
    await csop.init();
    
    const storage = csop.getCapability('storage');
    await storage.set('message', 'Hello from CDN!');
    const message = await storage.get('message');
    console.log(message);
  </script>
</body>
</html>
```

### jsDelivr

```html
<script type="module">
  import { CSOP } from 'https://cdn.jsdelivr.net/npm/@tryboy869/csop@0.1.0';
  // Your code here
</script>
```

## 🔧 Advanced Configuration

### Custom Storage Database

```javascript
const csop = new CSOP({
  storage: {
    dbName: 'myapp-db',
    version: 2,
    stores: ['users', 'posts', 'settings']
  }
});
```

### Worker Pool Configuration

```javascript
const csop = new CSOP({
  compute: {
    maxWorkers: navigator.hardwareConcurrency || 4,
    timeout: 30000 // 30 seconds
  }
});
```

### Real-time Sync Configuration

```javascript
const csop = new CSOP({
  sync: {
    endpoint: 'wss://api.example.com/realtime',
    reconnect: true,
    reconnectDelay: 1000
  }
});
```

## 🧪 Testing

CSOP includes a comprehensive test suite.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
CSOP/
├── src/
│   ├── csop.js           # Core orchestrator
│   ├── validation.js     # Input validation
│   ├── errors.js         # Error codes
│   ├── utils.js          # Utilities
│   └── capabilities/
│       ├── storage.js    # IndexedDB capability
│       ├── compute.js    # Web Workers capability
│       └── sync.js       # Real-time sync capability
├── test/
│   └── runner.js         # Test suite
├── package.json
├── README.md
└── LICENSE
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**DAOUDA Abdoul Anzize** - [Nexus Studio](https://github.com/Nexus-Studio-CEO)

- GitHub: [@Nexus-Studio-CEO](https://github.com/Nexus-Studio-CEO)
- NPM: [@tryboy869](https://www.npmjs.com/~tryboy869)
- Email: nexusstudio100@gmail.com

## 🔗 Links

- 📦 [NPM Package](https://www.npmjs.com/package/@tryboy869/csop)
- 📖 [GitHub Repository](https://github.com/Nexus-Studio-CEO/CSOP)
- 🐛 [Issue Tracker](https://github.com/Nexus-Studio-CEO/CSOP/issues)
- 📝 [Changelog](https://github.com/Nexus-Studio-CEO/CSOP/releases)
- 🌐 [unpkg CDN](https://unpkg.com/@tryboy869/csop@0.1.0)
- 🌐 [jsDelivr CDN](https://cdn.jsdelivr.net/npm/@tryboy869/csop@0.1.0)

## 🙏 Acknowledgments

- Built with ❤️ by Nexus Studio
- Powered by modern web standards (IndexedDB, Web Workers, WebSockets)
- AI-assisted development with Groq Llama 3.3

---

**Made with ❤️ for the JavaScript community**