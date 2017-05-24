const koa = require('koa');
const bodyParser = require('koa-bodyparser');

const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const logger = require('koa-logger');
const mongoose = require('mongoose');

const routes = require('./routes/index');
const { Users } = require('./models/index');

const { ExtractJwt, Strategy } = passportJWT;
const JWT_SECRET = 'SUPER_SECRET';

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
    },
    (email, password, done) => {
        Users.findOne({ email }, (err, user) => {
            console.log(password, user.checkPassword(password));
            if (err) {
                done(err);
            }

            if (!user || !user.checkPassword(password)) {
                return done(null, false, {
                    message: 'User with such credentials doesn\'t exist'
                });
            }

            return done(null, user);
        });
    }
));

passport.use(new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
        Users.findById(payload.id, (err, user) => {
            if (err) {
                done(err);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }
));

const app = new koa();

app.use(passport.initialize());
app.use(logger());
app.use(bodyParser({
    enableTypes: ['text', 'json', 'form'],
}));
app.use(routes);

app.listen(process.env.PORT || 8080);
console.info(`App started on ${process.env.PORT || 8080} port`);
