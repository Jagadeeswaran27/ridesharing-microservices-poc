import { createProxyMiddleware } from 'http-proxy-middleware';

import { services } from '../config/services';

export const authServiceProxy = createProxyMiddleware({
  target: services.authService.baseUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.headers['content-type']) {
        proxyReq.setHeader('content-type', req.headers['content-type']);
      }

      const body = (req as any).body;

      if (body && Object.keys(body).length > 0) {
        const bodyData = JSON.stringify(body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();
      }
    },
    error: (err, req, res) => {
      if ('statusCode' in res) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Something went wrong' }));
      }
    },
  },
});
