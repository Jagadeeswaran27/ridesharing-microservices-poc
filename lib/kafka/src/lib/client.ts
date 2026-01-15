import { Kafka } from 'kafkajs';
export const kafka = new Kafka({
  clientId: 'microservices',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});
