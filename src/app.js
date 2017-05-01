
require('babel-core/register');
const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');
const ejs = require('ejs');
const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
const routesConfig = require('./client/routesConfig');
const routerContext = require('./client/routerContext');


const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .set('view engine', 'html')
  .engine('html',ejs.renderFile)
  .set('views', path.join(__dirname,'..', 'views'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  
  .use((req, res) => {
    console.log('request.url=',req.url);
  
   let status = 200;

  Router.match(
    {routes: routesConfig, location: req.url},
    function(error, redirectLocation, renderProps)  {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {

        const markup = ReactDom.renderToString(routerContext(renderProps));
        // OR alternative way
        // const markup = ReactDom.renderToString(<Router.RouterContext {...renderProps} />);


       console.log('markup',markup);
      return res.render('index', { markup });
      } else {
        res.status(404).send('Not found..')
      }
    });
  

 })
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);

module.exports = app;
