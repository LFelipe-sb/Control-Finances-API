import { promises as fs} from 'fs';
import moment from 'moment';
import {summation} from '../libs/calc.js';

async function insertFinances(value, category, date, type) {
    const dataFile = JSON.parse( await fs.readFile('finances.json'));
    const newValue = {
        id: dataFile.nextId++,
        value,
        category,
        date: date,
    }

    if(type === 'D'){
        newValue.value *= -1; 
    }
    dataFile.finances.push(newValue);
    await fs.writeFile('finances.json', JSON.stringify(dataFile, null, 2));
    return newValue;
}

async function totalMonth(month){
    const dataFile = JSON.parse( await fs.readFile('finances.json'));
    
    let finances = dataFile.finances.filter(eachFinance => {
        const m = moment(eachFinance.date, 'DD/MM/YYYY').month() + 1;
        return m === month;
    });

    finances = finances.map((eachFinance) => {
        return eachFinance.value;
    });
    return {total: summation(finances)};
}

export {insertFinances, totalMonth};