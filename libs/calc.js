function summation(array){
    const sum = array.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);
    return sum;
}

function media(array){
    const sum = summation(array);
    const media = sum / array.length;
    return media;
}

export {summation, media};