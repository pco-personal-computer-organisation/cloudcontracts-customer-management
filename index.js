const config = require('./config/config.json');
const packageJson = require('./package.json');
const app = require('atrus');
// const Debug = require('debug');

app.locals.config = config;

// app.use(app.middlewares.timeout(30 * 1000));
app.use(app.middlewares.compression());
app.use(app.middlewares.bodyParser());
app.use(app.middlewares.security.default());
app.use(app.middlewares.validate.errors());
app.use(app.middlewares.errorHandler());

app.use(app.middlewares.staticFiles('client/build'));

app.addRoute({ route: '/api', module: 'src' });

const port = config.listen.port || 3000;
const ip = config.listen.ip || '0.0.0.0';

app.listen(port, ip, () => {
  console.log(`${packageJson.name} listening on port ${ip}:${port}!`); // eslint-disable-line no-console
});

module.exports = app;
