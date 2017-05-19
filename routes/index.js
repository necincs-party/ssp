const router = require('koa-router')();
const DeviceControler = require('./DeviceController');

router.get('/', ctx => {
    console.log('called on root');
    ctx.body = 'Hello world';
});

router.post('/device', DeviceControler.create);

router.post('/position', DeviceControler.pushHistory);

module.exports = router.routes();