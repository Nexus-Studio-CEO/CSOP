# 🎯 CSOP - Client-Side Orchestration Protocol

**Version:** v0.1.0  
**Status:** Alpha - Early Preview  
**License:** MIT  
**Author:** DAOUDA Abdoul Anzize - CEO, Nexus Studio  
**Contact:** nexusstudio100@gmail.com

---

## 🌟 Qu'est-ce que CSOP ?

CSOP (Client-Side Orchestration Protocol) est un protocole révolutionnaire qui transforme le navigateur en orchestrateur intelligent capable de gérer :

- **Storage** : Données locales (IndexedDB) et cloud (Turso)
- **Compute** : Calculs lourds parallélisés (Web Workers)
- **Sync** : Synchronisation temps réel multi-utilisateurs (Supabase)

**Le tout sans serveur backend.**

---

## ⚡ Installation Ultra-Rapide

### Option 1 : CDN (Recommandé)

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
        
        const csop = new CSOP();
        await csop.init();
        
        // Vous êtes prêt ! 🚀
        console.log('CSOP Ready');
    </script>
</head>
<body>
    <h1>CSOP v0.1.0 Fonctionne !</h1>
</body>
</html>
```

### Option 2 : Download Direct

```bash
# Cloner le repo
git clone https://github.com/Nexus-Studio-CEO/csop.git
cd csop

# Inclure dans votre projet
<script type="module" src="./csop/src/csop.js"></script>
```

---

## 🎯 Quick Start - 3 Exemples

### 1️⃣ Sauvegarder des Données

```javascript
import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';

const csop = new CSOP();
await csop.init();

// Sauvegarder automatiquement (IndexedDB ou Turso selon taille)
const result = await csop.dispatch('storage.save', {
    key: 'user_profile',
    data: { name: 'Anzize', role: 'Architect' }
});

console.log('Saved:', result);
// → { status: 'ok', data: { key: 'user_profile', location: 'indexeddb' } }
```

### 2️⃣ Calculs Lourds Parallélisés

```javascript
// Calculer Fibonacci 1000 en parallèle
const result = await csop.dispatch('compute.execute', {
    task: 'fibonacci',
    data: { n: 1000 }
});

console.log('Result:', result);
```

### 3️⃣ Sync Temps Réel Multi-Users

```javascript
// Broadcaster un événement
await csop.dispatch('sync.broadcast', {
    event: 'user_joined',
    data: { userId: 'anzize', timestamp: Date.now() }
});

// Écouter les événements
await csop.dispatch('sync.subscribe', {
    channel: 'workspace',
    callback: (event) => {
        console.log('Event reçu:', event);
    }
});
```

---

## 📚 API Complète

### STORAGE (Gestion Données)

```javascript
// SAVE - Sauvegarde intelligente
await csop.dispatch('storage.save', {
    key: 'document_1',
    data: { title: 'Mon doc', content: '...' }
});

// GET - Récupération
const data = await csop.dispatch('storage.get', {
    key: 'document_1'
});

// DELETE - Suppression
await csop.dispatch('storage.delete', {
    key: 'document_1'
});

// LIST - Lister les clés
const keys = await csop.dispatch('storage.list', {
    prefix: 'document_'
});
```

### COMPUTE (Calculs)

```javascript
// EXECUTE - Tâche unique
await csop.dispatch('compute.execute', {
    task: 'fibonacci',
    data: { n: 100 }
});

// BATCH - Multiples tâches en parallèle
await csop.dispatch('compute.batch', {
    tasks: [
        { task: 'fibonacci', data: { n: 100 } },
        { task: 'factorial', data: { n: 50 } },
        { task: 'hash_sha256', data: { message: 'hello' } }
    ]
});
```

### SYNC (Synchronisation)

```javascript
// BROADCAST - Envoyer à tous
await csop.dispatch('sync.broadcast', {
    event: 'message_sent',
    data: { text: 'Hello world' }
});

// SUBSCRIBE - Écouter
await csop.dispatch('sync.subscribe', {
    channel: 'chat',
    callback: (msg) => console.log(msg)
});

// PRESENCE - Qui est en ligne ?
const online = await csop.dispatch('sync.presence', {
    channel: 'workspace'
});
```

---

## ⚙️ Configuration Avancée

### Retry Automatique

```javascript
await csop.dispatch('storage.save', {
    key: 'important_data',
    data: {...}
}, {
    retry: 3,           // 3 tentatives
    timeout: 10000      // 10 secondes max
});
```

### Fallback Cloud (Turso)

```javascript
// Configurer Turso pour gros fichiers
const storage = csop.getCapability('storage');
storage.configureTurso({
    url: 'libsql://votre-db.turso.io',
    authToken: 'votre_token'
});
```

### Sync Supabase

```javascript
// Configurer Supabase Realtime
const sync = csop.getCapability('sync');
sync.configureSupabase({
    url: 'https://votre-projet.supabase.co',
    anonKey: 'votre_anon_key'
});
```

---

## 🏗️ Architecture

```
CSOP Core (csop.js)
    ↓
├── Storage Capability
│   ├── IndexedDB (< 5MB)
│   └── Turso (> 5MB, optionnel)
│
├── Compute Capability
│   ├── Web Workers Pool
│   └── Parallel Task Scheduler
│
└── Sync Capability
    ├── Supabase Realtime
    └── Presence Tracking
```

---

## 📊 Avantages vs Architecture Classique

| Feature | Architecture Classique | CSOP v0.1.0 |
|---------|----------------------|-------------|
| **Backend requis** | Node.js/Python/Go | ❌ Aucun |
| **Coût infra** | $50-500/mois | ✅ $0/mois |
| **Scalabilité** | Limitée par serveur | ✅ Infinie |
| **Latence** | 50-200ms | ✅ 0ms (local) |
| **Offline-first** | Non | ✅ Oui |
| **Complexité** | Haute | ✅ Basse |

---

## 🚧 Limitations v0.1.0 (Alpha)

- ⚠️ **Pas de streaming** : Fichiers > 100MB peuvent bloquer
- ⚠️ **Pas de versioning** : Pas d'historique des modifications
- ⚠️ **Sync basique** : Pas de résolution de conflits avancée
- ⚠️ **Pas de TypeScript** : Types à venir en v0.2.0

---

## 🗺️ Roadmap

### v0.2.0 (Q2 2025)
- ✅ Streaming pour gros fichiers
- ✅ TypeScript definitions
- ✅ Cache intelligent
- ✅ Metrics/Logging

### v0.3.0 (Q3 2025)
- ✅ Conflict resolution (CRDT)
- ✅ Multi-leader sync
- ✅ Progressive Web App support
- ✅ Developer Tools (debugger)

### v1.0.0 (Q4 2025)
- ✅ Production-ready
- ✅ Enterprise features
- ✅ Security audit
- ✅ Performance optimization

---

## 🤝 Contribuer

CSOP est open-source et accueille les contributions !

```bash
# Fork le repo
git clone https://github.com/Nexus-Studio-CEO/csop.git

# Créer une branche
git checkout -b feature/ma-feature

# Commiter
git commit -m "Add: ma super feature"

# Push et Pull Request
git push origin feature/ma-feature
```

---

## 📄 License

MIT License - Utilisation libre, commerciale ou non.

---

## 🙏 Crédits

**Créé par Anzize Daouda**  
Architecture inspirée du Model Context Protocol (MCP) d'Anthropic

**Philosophie** : Client-Side Orchestration > Server-Side Complexity

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/Nexus-Studio-CEO/csop/issues)
- **Discussions** : [GitHub Discussions](https://github.com/Nexus-Studio-CEO/csop/discussions)
- **Email** : nexusstudio100@gmail.com
- **Twitter** : [@NexusStudioCEO](https://twitter.com/NexusStudioCEO)

---

**CSOP v0.1.0** - The Future of Client-Side Architecture 🚀