const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const multer = require('multer')
const session = require('express-session')
const flash = require('express-flash')

const upload = multer()

const methodOverride = require('method-override');
const basics = require('./server/routes/basic');
const actions = require('./server/routes/actions')
const tags = require('./server/routes/tags')
const logreg = require('./server/routes/logreg')
const commenting = require('./server/routes/commenting')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array()); 
app.use(express.static('public'));

app.use(methodOverride('_method'));

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

app.use(flash());
app.use(session({
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}))

app.use('/', basics);
app.use('/', actions)
app.use('/', tags)
app.use('/', logreg)
app.use('/', commenting)

app.use((req, res, nex) => {
    res.status(404).render('error.hbs', {error_code: '404', error_message: 'Page not found!'})
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});