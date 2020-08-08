import express from 'express';
import financesRouter from './Routes/finances.js'
import { promises as fs} from 'fs';
import cors from 'cors';
import winston from 'winston';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/finances', financesRouter);

const {combine, label, timestamp, printf} = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] -> ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: "finances-control-api.log"})
    ],
    format: combine(
        label({label: "finances-control"}),
        timestamp(),
        myFormat
    )
});

app.listen(3001, async() => {
    try {
        await fs.readFile('finances.json');
        global.logger.info('API Started.');
    } catch (error) {
        const initialJson = {
            nextId: 1,
            finances: [],
        }
        await fs.writeFile('finances.json', JSON.stringify(initialJson, null, 2));
        global.logger.info('API Started and File created.');
    }
});