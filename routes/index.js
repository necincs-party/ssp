const router = require('koa-router')();
const DeviceControler = require('./DeviceControler');

router.get('/', ctx => {
    console.log('called on root');
    ctx.body = 'Hello world';
});

router.post('/device', DeviceControler);

module.exports = router.routes();