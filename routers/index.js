import express from 'express';
const app = express();
const router= express.Router();

router.get('/', (req, res) => {
    const titulo = 'Agencia de viajes';
    res.render('inicio',{
        titulo: titulo
    })
});

router.get('/nosotros', (req, res) => {
    const titulo = 'Sobre nosotros';
    res.render('nosotros', {
        titulo: titulo
    });
});

router.get('/contacto', (req, res) => {
    res.send('Contacto');
});

export default router;