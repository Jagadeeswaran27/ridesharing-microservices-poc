import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | null = null;

export function getRedisClient(connectionUrl: string) {
  if (!client) {
    const redisUrl = connectionUrl;

    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined');
    }

    client = createClient({
      url: redisUrl,
    });

    client.on('connect', () => {
      console.log('[Redis] Connecting...');
    });

    client.on('ready', () => {
      console.log('[Redis] Ready');
    });

    client.on('error', (err) => {
      console.error('[Redis] Error', err);
    });
  }

  return client;
}

export async function connectRedis(connectionUrl: string) {
  const redis = getRedisClient(connectionUrl);

  if (!redis.isOpen) {
    await redis.connect();
  }
}
