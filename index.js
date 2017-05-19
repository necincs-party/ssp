const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const routes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/local');

const app = new koa();

app.use(logger());
app.use(bodyParser({
    enableTypes: ['text', 'json', 'form'],
}));
app.use(routes);

app.listen(process.env.PORT || 8080);
console.info(`App started on ${process.env.PORT || 8080} port`);
