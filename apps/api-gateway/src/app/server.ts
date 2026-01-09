import http from 'http';

import { createApp } from './app';
import { env } from './config/env';

export function startServer() {
  const app = createApp();

  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`API Gateway running on port ${env.PORT}`);
  });
}
