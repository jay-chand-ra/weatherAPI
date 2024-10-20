const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/weather',
    createProxyMiddleware({
      target: 'https://api.openweathermap.org/data/2.5',
      changeOrigin: true,
      pathRewrite: {
        '^/api/weather': '/weather'
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      logLevel: 'debug'
    })
  );
};
