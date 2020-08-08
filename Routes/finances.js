import express from 'express';
import { promises as fs } from 'fs';
import {insertFinances, totalMonth} from '../controllers/financesController.js';

const router = express.Router();

router.get('/', async(_req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('finances.json'));
        delete dataFile.nextId;
        res.send(dataFile);
    } catch(err) {
        next(err);
    }
});

router.get('/:id', async(req, res) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('finances.json'));
        const index = dataFile.finances.find((register) => register.id === parseInt(req.params.id));
        res.send(index);
    } catch(err) {
        next(err);
    }
});

router.get('/totalMonth/:month', async(req, res) => {
    try{
        res.send( await totalMonth(parseInt(req.params.month)));
    } catch(err) {
        next(err);
    }
});

router.post('/balance', async(req, res) => {
    try{
        const {value, category, date} = req.body;
        res.send( await insertFinances(Math.abs(value), category, date));
    } catch(err){
        next(err);
    }
});

router.post('/expenses', async(req, res) => {
    try{
        const {value, category, date} = req.body;
        res.send( await insertFinances(Math.abs(value), category, date, 'D'));
    } catch(err) {
        next(err);
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('finances.json'));
        dataFile.finances = dataFile.finances.filter((register) => register.id !== parseInt(req.params.id));

        await fs.writeFile('finances.json', JSON.stringify(dataFile, null, 2));
        res.send('Item successfully deleted.');
    } catch(err) {
        next(err);
    }
});

router.use((err, req, res, _next) => {
    global.logger.error(`${req.method} ${req.baseUrl} -> ${err.message}`)
    res.status(500).send('An error has occurred. ' + err);
});

export default router;