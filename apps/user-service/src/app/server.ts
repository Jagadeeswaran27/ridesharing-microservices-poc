import { createApp } from './app';
import { envConfig } from './config/env';

export function startServer() {
  const app = createApp();

  app.listen(envConfig.PORT, () => {
    console.log(`User Service running on port ${envConfig.PORT}`);
  });
}
