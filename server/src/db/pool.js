import { existsSync, unlinkSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pgdataDir = join(__dirname, '../../../database/pgdata');
const migrationsDir = join(__dirname, '../../../database/migrations');
const seedsDir = join(__dirname, '../../../database/seeds');

class PGlitePoolWrapper {
  constructor() {
    this._db = null;
    this._initPromise = null;
    this._listeners = new Map();
  }

  async _getDb() {
    if (this._db) return this._db;
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      // Remove stale postmaster.pid if present from previous ungraceful termination
      const pidPath = join(pgdataDir, 'postmaster.pid');
      if (existsSync(pidPath)) {
        try { unlinkSync(pidPath); } catch {}
      }

      const { PGlite } = await import('@electric-sql/pglite');
      const db = new PGlite(pgdataDir);
      this._db = db;

      // Check if schema is initialized
      try {
        const check = await db.query("SELECT 1 FROM information_schema.tables WHERE table_name = 'fields'");
        if (!check.rows.length) {
          console.log('[SkillFinder DB] Initializing database schema and seeds...');
          const migrationFiles = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
          for (const file of migrationFiles) {
            const sql = readFileSync(join(migrationsDir, file), 'utf8');
            await db.exec(sql);
          }
          const seedFiles = readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
          for (const file of seedFiles) {
            const sql = readFileSync(join(seedsDir, file), 'utf8');
            await db.exec(sql);
          }
          console.log('[SkillFinder DB] Schema and seeds loaded successfully.');
        }

        // Ensure session table exists for connect-pg-simple
        await db.exec(`
          CREATE TABLE IF NOT EXISTS "session" (
            "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
          );
          CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
        `);
      } catch (err) {
        console.warn('[SkillFinder DB] Schema check warning:', err.message);
      }

      return db;
    })();

    return this._initPromise;
  }

  async _runQuery(sql, params = []) {
    const db = await this._getDb();
    const cleanParams = (params || []).map(p => (p === undefined ? null : p));

    if (!cleanParams.length && sql.includes(';')) {
      const execResult = await db.exec(sql);
      const last = Array.isArray(execResult) ? execResult[execResult.length - 1] : execResult;
      return {
        rows: last?.rows || [],
        rowCount: last?.rows ? last.rows.length : (last?.affectedRows || 0),
        fields: last?.fields || [],
        command: last?.command || ''
      };
    }

    const result = await db.query(sql, cleanParams);
    return {
      rows: result.rows || [],
      rowCount: result.rows ? result.rows.length : (result.affectedRows || 0),
      fields: result.fields || [],
      command: result.command || ''
    };
  }

  query(sql, params, callback) {
    let actualParams = params;
    let actualCb = callback;
    if (typeof params === 'function') {
      actualCb = params;
      actualParams = [];
    }

    const promise = this._runQuery(sql, actualParams);
    if (typeof actualCb === 'function') {
      promise.then(
        (res) => actualCb(null, res),
        (err) => actualCb(err)
      );
      return;
    }
    return promise;
  }

  async connect() {
    const db = await this._getDb();
    return {
      query: (sql, params, callback) => this.query(sql, params, callback),
      release: () => {}
    };
  }

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, []);
    this._listeners.get(event).push(handler);
    return this;
  }

  async end() {
    if (this._db) {
      await this._db.close();
      this._db = null;
      this._initPromise = null;
    }
  }
}

let activePool = null;

const isPlaceholderDb = !env.DATABASE_URL || env.DATABASE_URL.includes('<user>') || env.DATABASE_URL.includes('<password>');

if (!isPlaceholderDb) {
  try {
    const { Pool } = pg;
    const realPgPool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    });
    activePool = realPgPool;
    console.log('[SkillFinder DB] Using configured PostgreSQL via pg.Pool');
  } catch (err) {
    console.warn('[SkillFinder DB] Falling back to embedded PostgreSQL:', err.message);
    activePool = new PGlitePoolWrapper();
  }
} else {
  console.log('[SkillFinder DB] Using embedded PostgreSQL (PGlite)');
  activePool = new PGlitePoolWrapper();
}

export const pool = activePool;

export async function checkDatabase() {
  const result = await pool.query('SELECT NOW() AS now');
  return result.rows[0];
}
