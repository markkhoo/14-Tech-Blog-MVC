// 
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

// 
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

// 
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();
const PORT = process.env.PORT || 3002;
const hbs = exphbs.create({ helpers });

// 
const sess = {
  secret: 'How Do I Turn This Thing On',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  }),
  // maxAge: (Date.now() + (5 * 1000)) // Attempt to make the session last 5 seconds for testing 
};

// 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// 
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

// 
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});