import { createApp } from './app';
import { env } from './config/env';
import { startLocationConsumer } from './kafka/consumer';

export async function startServer() {
  await startLocationConsumer();
  const app = await createApp();

  app.listen(env.PORT, () => {
    console.log(`Location Service running on port ${env.PORT}`);
  });
}
