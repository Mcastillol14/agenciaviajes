import express from 'express';
import router from './routers/index.js';


const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => { })
app.set('view engine', 'pug');

app.use('/',router);

