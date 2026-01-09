import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

import { handleSocketMessage } from './handlers';

export function initWebsocket(server: any) {
  const wsServer = new WebSocketServer({ server });

  wsServer.on('connection', (ws, req: IncomingMessage) => {
    console.log('🔌 WebSocket connected');

    ws.on('message', async (data) => {
      await handleSocketMessage(ws, data as Buffer);
    });

    ws.on('close', () => {
      console.log('❎ WebSocket disconnected');
    });
  });

  return wsServer;
}
