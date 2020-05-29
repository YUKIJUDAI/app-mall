// const path = require('path');
// const debug = process.env.NODE_ENV !== 'production';

// vue.config.js
module.exports = {
    publicPath: './',
    lintOnSave: false,
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        // port: 8888, // 服务器临时部署端口
        proxy: {
            '/api': {
                target: 'http://hao.lethink.net',
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
            }
        }
    }
};