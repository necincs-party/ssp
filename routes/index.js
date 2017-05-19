const router = require('koa-router')();
const DeviceControler = require('./DeviceController');

router.get('/', ctx => {
    console.log('called on root');
    ctx.body = 'Hello world';
});

router.post('/device', DeviceControler.create);

router.post('/device/history', DeviceControler.pushHistory);

router.get('/device/:deviceId/history', DeviceControler.getHistory);

module.exports = router.routes();