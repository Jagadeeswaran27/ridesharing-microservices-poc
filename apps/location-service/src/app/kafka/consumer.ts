import { createConsumer } from '@microservices-poc/kafka';

export async function startLocationConsumer() {
  const consumer = createConsumer('location-service');

  await consumer.connect();
  await consumer.subscribe({
    topic: 'user-events',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      console.log('📍 Location service received event:', event);
    },
  });
}
