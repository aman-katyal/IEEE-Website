#!/usr/bin/env node
/**
 * BoilerBooks 3.0 PIN Management Utility
 * Generates PBKDF2-SHA256 passcode hashes and updates Cloudflare D1 database.
 * 
 * Usage:
 *   node scripts/set_pin.mjs <committee_id|treasurer> <new_pin> [--remote]
 * 
 * Examples:
 *   node scripts/set_pin.mjs rov 5421
 *   node scripts/set_pin.mjs treasurer 9812 --remote
 *   node scripts/set_pin.mjs --hash 1903
 */

import { execSync } from 'child_process';

const DEFAULT_ITERATIONS = 100000;
const KEY_LENGTH_BITS = 256;
const SALT_LENGTH_BYTES = 16;

function bytesToHex(bytes) {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export async function hashPin(pin, iterations = DEFAULT_ITERATIONS) {
  const salt = new Uint8Array(SALT_LENGTH_BYTES);
  globalThis.crypto.getRandomValues(salt);
  const encoder = new TextEncoder();
  const pinBuffer = encoder.encode(pin);

  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    pinBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH_BITS
  );

  const hashBytes = new Uint8Array(derivedBits);
  const saltHex = bytesToHex(salt);
  const hashHex = bytesToHex(hashBytes);

  return `pbkdf2:sha256:${iterations}:${saltHex}:${hashHex}`;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🏛️ Purdue IEEE BoilerBooks 3.0 — PIN Management Utility

Usage:
  node scripts/set_pin.mjs <committee_id|treasurer> <new_pin> [--remote]
  node scripts/set_pin.mjs --hash <pin>

Options:
  --remote    Apply directly to remote Cloudflare D1 production database
  --local     Apply to local dev D1 database (default)
  --hash      Only output the PBKDF2 hash string without executing SQL

Committees:
  general, rov, racing, aerial, embs, mtts, cs, learning,
  social, cornerstones, industrial-relations, president, treasurer
`);
    process.exit(0);
  }

  if (args[0] === '--hash') {
    const pinToHash = args[1];
    if (!pinToHash) {
      console.error('❌ Error: Please provide a PIN to hash.');
      process.exit(1);
    }
    const hash = await hashPin(pinToHash);
    console.log(`\n🔑 PIN: ${pinToHash}`);
    console.log(`🔒 PBKDF2 Hash: ${hash}\n`);
    process.exit(0);
  }

  const targetId = args[0].toLowerCase();
  const newPin = args[1];
  const isRemote = args.includes('--remote');

  if (!targetId || !newPin) {
    console.error('❌ Error: Missing required arguments. Expected: node scripts/set_pin.mjs <committee_id> <new_pin>');
    process.exit(1);
  }

  console.log(`\n🔐 Generating secure PBKDF2-SHA256 hash for "${targetId}"...`);
  const pinHash = await hashPin(newPin);

  const targetFlag = isRemote ? '--remote' : '--local';
  const sql = `UPDATE finance_committees SET passcode_hash = '${pinHash}' WHERE id = '${targetId}';`;

  console.log(`Executing SQL on Cloudflare D1 (${isRemote ? 'PRODUCTION REMOTE' : 'LOCAL DEV'})...`);

  try {
    const output = execSync(`npx wrangler d1 execute DB ${targetFlag} --command "${sql}"`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    console.log(output);
    console.log(`✅ Success! PIN for "${targetId}" updated to "${newPin}".`);
  } catch (err) {
    console.error(`❌ Failed to update PIN:`, err.message);
    process.exit(1);
  }
}

main();
