import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    serviceName: 'api-gateway',
    timestamp: new Date().toISOString(),
    message: 'API Gateway is running!',
  });
});
