import express from 'express';
import { createServer as createViteServer } from 'vite';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const clientDir = join(rootDir, 'client');
const clientDistDir = join(rootDir, 'client/dist');

export async function mountClient(app) {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa',
        root: clientDir
      });
      app.use(vite.middlewares);
      console.log('[SkillFinder] Mounted Vite development middleware');
      return;
    } catch (err) {
      console.warn('[SkillFinder] Vite middleware failed to initialize, falling back to static build:', err.message);
    }
  }

  if (existsSync(clientDistDir)) {
    app.use(express.static(clientDistDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(join(clientDistDir, 'index.html'));
    });
    console.log('[SkillFinder] Serving static client build from client/dist');
  }
}
