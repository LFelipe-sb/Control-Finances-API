import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

router.get('/', async(_req, res) => {
    const dataFile = JSON.parse( await fs.readFile('finances.json'));
    res.send(dataFile);
    delete dataFile.nextId;
});

export default router;