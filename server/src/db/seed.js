import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const seedsDir = join(dirname(fileURLToPath(import.meta.url)), '../../../database/seeds');
const files = (await readdir(seedsDir)).filter((file) => file.endsWith('.sql')).sort();
for (const file of files) await pool.query(await readFile(join(seedsDir, file), 'utf8'));
await pool.end();
console.log(`Seeds complete: ${files.join(', ')}`);
