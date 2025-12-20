import { createApp } from './app';
import { env } from './config/env';

export function startServer() {
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Auth Service running on port ${env.PORT}`);
  });
}
