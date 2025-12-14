import { createApp } from './app';
import { envConfig } from './config/env';
import { connectProducer } from '@microservices-poc/kafka';

export async function startServer() {
  await connectProducer();
  const app = createApp();

  app.listen(envConfig.PORT, () => {
    console.log(`User Service running on port ${envConfig.PORT}`);
  });
}
