import { createApp } from './app';
import { env } from './config/env';

export async function startSever() {
  const app = await createApp();

  app.listen(env.PORT, () => {
    console.log(`Location Service running on port ${env.PORT}`);
  });
}
