const router = require('koa-router')();
const passport = require('koa-passport');

const DeviceControler = require('./DeviceController');
const UserController = require('./UserController');



router.get('/', ctx => {
    ctx.body = 'Hello world';
});

router.get('/custom', async (ctx, next) => {
    await passport.authenticate('jwt', function (err, user) {
        if (user) {
            ctx.body = "hello " + user.name;
        } else {
            ctx.body = "No such user";
        }
    } )(ctx, next)
});

router.post('/signup', UserController.create);

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

router.post('/device', DeviceControler.create);

router.post('/device/history', DeviceControler.pushHistory);

router.get('/device/:deviceId/history', DeviceControler.getHistory);

module.exports = router.routes();