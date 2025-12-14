import { kafka } from './client.js';

export const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log('Kafka producer connected!');
}
