import { createApp } from './app';
import { env } from './config/env';

export function startServer() {
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`API Gateway running on port ${env.PORT}`);
  });
}
