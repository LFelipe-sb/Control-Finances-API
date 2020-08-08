import express from 'express';
import financesRouter from './Routes/finances.js'
import { promises as fs} from 'fs';

const app = express();
app.use(express.json());

app.use('/finances', financesRouter);

app.listen(3001, async() => {
    try {
        await fs.readFile('finances.json');
        console.log('API Started.');
    } catch (error) {
        const initialJson = {
            nextId: 1,
            finances: [],
        }
        await fs.writeFile('finances.json', JSON.stringify(initialJson, null, 2));
        console.log('API Started and File created.');
    }
});