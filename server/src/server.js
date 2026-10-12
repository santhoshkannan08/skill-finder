import app from './app.js';
import { mountClient } from './clientMount.js';

await mountClient(app);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SkillFinder application listening on http://0.0.0.0:${PORT}`);
});
