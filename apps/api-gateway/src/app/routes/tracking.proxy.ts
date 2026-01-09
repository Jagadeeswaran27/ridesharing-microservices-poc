import { createProxyMiddleware } from 'http-proxy-middleware';
import { services } from '../config/services';

export const trackingServiceProxy = createProxyMiddleware({
  target: services.trackingService.baseUrl,
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api/v1/tracking': '',
  },
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.headers.upgrade?.toLowerCase() === 'websocket') {
        return;
      }

      if (req.headers['content-type']) {
        proxyReq.setHeader('content-type', req.headers['content-type']);
      }

      const body = (req as any).body;
      const bodyData = JSON.stringify(body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      proxyReq.end();
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err);
      if ('statusCode' in res) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Proxy error occurred' }));
      }
    },
  },
});
