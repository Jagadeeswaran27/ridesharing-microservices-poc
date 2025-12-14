import { kafka } from './client.js';

export function createConsumer(groupId: string) {
  return kafka.consumer({ groupId });
}
