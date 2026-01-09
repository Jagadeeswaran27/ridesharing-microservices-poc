import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { initWebsocket } from './websocket';

export async function startServer() {
  const app = await createApp();

  const server = http.createServer(app);

  initWebsocket(server);

  server.listen(env.PORT, () => {
    console.log(`Tracking Service running on port ${env.PORT}`);
  });
}
