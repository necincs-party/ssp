const passport = require('koa-passport');
const jwt = require('jsonwebtoken');

const { Users } = require('../models');

class UserController {
    static async login(ctx, next) {
        await passport.authenticate('local', (err, user) => {
            if (err) {
                ctx.status = 400;
                ctx.body = err;
            }

            if (!user) {
                ctx.body = {
                    error: "Login failed"
                };
            } else {
                const payload = {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                };

                const token = jwt.sign(payload, 'SUPER_SECRET');

                ctx.body = {name: user.name, lastname: user.lastname, token: 'JWT ' + token};
            }

        })(ctx, next);
    }

    static async create(ctx) {
        const { body } = ctx.request;
        try {
            ctx.body = await Users.create(JSON.parse(body));
        } catch (error) {
            ctx.status = 400;
            ctx.body = error;
        }
    }

    static async logout(ctx) {
        console.log(ctx.logout());
        ctx.body = '3232';
    }
}

module.exports = UserController;