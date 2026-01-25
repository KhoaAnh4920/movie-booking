import { createProxyMiddleware } from 'http-proxy-middleware';
import { ClientRequest, IncomingMessage } from 'http';

export const bookingProxy = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/bookings': '',
  },
  on: {
    proxyReq: (proxyReq: ClientRequest, req: IncomingMessage) => {
      const userId = req.headers['x-user-id'];
      if (userId) {
        proxyReq.setHeader('x-user-id', userId as string);
      }
    },
  },
});
