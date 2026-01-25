import { createProxyMiddleware } from 'http-proxy-middleware';

export const catalogProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/catalog': '',
  },
});
