import express from 'express';
import router from './routers/index.js';
import db from './conf/db.js';




const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'))

app.use((req, res, next) => {
    const year = new Date().getFullYear();
    res.locals.year = year;
    next();
});

db.authenticate().then(() => {
    console.log('Base de datos conectada');
}).catch(error => {
    console.log(error);
})

app.listen(port, () => { })
app.set('view engine', 'pug');

app.use('/', router);