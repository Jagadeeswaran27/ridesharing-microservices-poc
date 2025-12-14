import { Kafka } from 'kafkajs';
export const kafka = new Kafka({
  clientId: 'microservices-poc',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});
