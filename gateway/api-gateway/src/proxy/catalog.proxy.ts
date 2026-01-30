import { createProxyMiddleware } from 'http-proxy-middleware';

export const catalogProxy = createProxyMiddleware({
  target: process.env.CATALOG_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/catalog': '',
  },
});
