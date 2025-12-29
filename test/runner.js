/**
 * CSOP Test Runner
 * Automated testing suite
 */

import { CSOP } from '../src/csop.js';
import { CSPValidator } from '../src/validation.js';
import { ErrorCodes, CSOPError } from '../src/errors.js';

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n🧪 CSOP Test Suite v0.2.0\n');
  
  for (const t of tests) {
    try {
      await t.fn();
      passed++;
      console.log(`✅ ${t.name}`);
    } catch (e) {
      failed++;
      console.log(`❌ ${t.name}`);
      console.log(`   ${e.message}`);
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// ============================================================================
// TESTS
// ============================================================================

test('CSOP initialization', async () => {
  const csop = new CSOP();
  await csop.init();
  if (!csop.capabilities.has('storage')) throw new Error('Storage not registered');
});

test('Validation: valid capability name', () => {
  CSPValidator.validateCapability('test_capability');
});

test('Validation: invalid capability name', () => {
  try {
    CSPValidator.validateCapability('123-invalid');
    throw new Error('Should have thrown');
  } catch (e) {
    if (!e.message.includes('CAPABILITY_NAME_INVALID')) throw e;
  }
});

test('Validation: valid storage key', () => {
  CSPValidator.validateStorageKey('mykey');
});

test('Validation: invalid storage key', () => {
  try {
    CSPValidator.validateStorageKey('');
    throw new Error('Should have thrown');
  } catch (e) {
    if (!e.message.includes('STORAGE_KEY_INVALID')) throw e;
  }
});

test('Validation: valid storage value', () => {
  CSPValidator.validateStorageValue({ test: 'data' });
});

test('Error codes existence', () => {
  if (!ErrorCodes.CAPABILITY_NOT_FOUND) throw new Error('Missing error code');
  if (!ErrorCodes.STORAGE_KEY_INVALID) throw new Error('Missing error code');
});

test('CSOPError creation', () => {
  const err = new CSOPError('CAPABILITY_NOT_FOUND', { name: 'test' });
  if (err.code !== 1001) throw new Error('Wrong error code');
  if (err.details.name !== 'test') throw new Error('Wrong details');
});

test('Storage capability registration', async () => {
  const csop = new CSOP();
  await csop.init();
  const storage = csop.capabilities.get('storage');
  if (!storage) throw new Error('Storage not found');
});

// Run all tests
runTests();
