import express from 'express';
import { promises as fs } from 'fs';
import {insertFinances, totalMonth} from '../controllers/financesController.js';

const router = express.Router();

router.get('/', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('finances.json'));
    delete dataFile.nextId;
    res.send(dataFile);
});

router.get('/:id', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('finances.json'));
    const index = dataFile.finances.find((register) => register.id === parseInt(req.params.id));
    res.send(index);
});

router.get('/totalMonth/:month', async(req, res) => {
    res.send( await totalMonth(parseInt(req.params.month)));
});

router.post('/balance', async(req, res) => {
    const {value, category, date} = req.body;
    res.send( await insertFinances(Math.abs(value), category, date));
});

router.post('/expenses', async(req, res) => {
    const {value, category, date} = req.body;
    res.send( await insertFinances(Math.abs(value), category, date, 'D'));
});

router.delete('/:id', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('finances.json'));
    dataFile.finances = dataFile.finances.filter((register) => register.id !== parseInt(req.params.id));

    await fs.writeFile('finances.json', JSON.stringify(dataFile, null, 2));
    res.send('Item successfully deleted.');
});

export default router;