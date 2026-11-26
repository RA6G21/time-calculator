'use strict';

function parseFlightTime(expression) {
    const source = expression.trim().replace(/−/g, '-');

    if (!source) {
        throw new Error('Enter a flight time, such as 1.30.');
    }

    const term = /\s*([+-]?)\s*(\d{1,9})(?:\.(\d{1,2}))?\s*/y;
    let position = 0;
    let totalMinutes = 0;

    while (position < source.length) {
        term.lastIndex = position;
        const match = term.exec(source);

        if (!match || (position > 0 && !match[1])) {
            throw new Error('Enter times as H.MM, with + or - between entries.');
        }

        if (term.lastIndex < source.length && !'+-'.includes(source[term.lastIndex])) {
            throw new Error('Check the time format. Use up to two digits after the dot.');
        }

        const [, operator, hours, minuteDigits = ''] = match;

        // Preserve Aero shorthand: 1.3 means 1 hour 30 minutes.
        const minutes = Number(minuteDigits.padEnd(2, '0'));

        if (minutes > 59) {
            throw new Error(`“${hours}.${minuteDigits}” has ${minutes} minutes. Use 00–59.`);
        }

        const duration = Number(hours) * 60 + minutes;
        totalMinutes += operator === '-' ? -duration : duration;
        position = term.lastIndex;
    }

    return totalMinutes;
}

function showFlightTime(inputId, resultId) {
    const input = document.getElementById(inputId);
    const result = document.getElementById(resultId);

    let total;

    try {
        total = parseFlightTime(input.value);
    } catch (error) {
        result.textContent = error.message;
        return;
    }

    const absoluteTotal = Math.abs(total);
    const hours = Math.floor(absoluteTotal / 60);
    const minutes = absoluteTotal % 60;
    const sign = total < 0 ? '-' : '';

    const timeLine = document.createElement('p');
    timeLine.textContent = `${sign}${hours}:${String(minutes).padStart(2, '0')}`;

    const description = document.createElement('p');
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    const minuteLabel = minutes === 1 ? 'minute' : 'minutes';
    const prefix = total < 0 ? 'Minus ' : '';
    description.textContent = `${prefix}${hours} ${hourLabel} ${minutes} ${minuteLabel}`;

    result.replaceChildren(timeLine, description);
}

function addTimes() {
    showFlightTime('addInput', 'addResult');
}

function subtractTimes() {
    showFlightTime('subInput', 'subResult');
}
