'use strict';

function parseExpression(source) {
    const expression = source.trim().replaceAll('−', '-');

    if (!expression) {
        throw new Error('Enter at least one duration, such as 1.30.');
    }

    // A single minute digit is shorthand: 1.3 means 1 hour 30 minutes.
    const term = /\s*([+-]?)\s*(\d{1,9})(?:\.(\d{1,2}))?\s*/y;
    const steps = [];
    let position = 0;
    let total = 0;

    while (position < expression.length) {
        term.lastIndex = position;
        const match = term.exec(expression);
        const nearby = expression.slice(position, position + 16);

        if (!match || (steps.length > 0 && !match[1])) {
            throw new Error(`Check the entry near “${nearby}”. Use H.MM with + or − between entries.`);
        }

        if (term.lastIndex < expression.length && !'+-'.includes(expression[term.lastIndex])) {
            throw new Error(`Check the entry near “${nearby}”. Use one or two minute digits and separate durations with + or −.`);
        }

        const [, sign, hours, fraction] = match;
        const minutes = Number((fraction || '').padEnd(2, '0'));
        const entry = fraction ? `${hours}.${fraction}` : hours;

        if (minutes > 59) {
            throw new Error(`“${entry}” has ${minutes} minutes. Use 00–59.`);
        }

        const duration = Number(hours) * 60 + minutes;
        total += sign === '-' ? -duration : duration;
        steps.push({ entry: sign + entry, duration, sign, total });
        position = term.lastIndex;
    }

    return { total, steps };
}

function formatDuration(total, separator = ':') {
    const absolute = Math.abs(total);
    const hours = Math.floor(absolute / 60);
    const minutes = String(absolute % 60).padStart(2, '0');
    const sign = total < 0 ? '-' : '';

    return `${sign}${hours}${separator}${minutes}`;
}

function describeDuration(total) {
    const absolute = Math.abs(total);
    const hours = Math.floor(absolute / 60);
    const minutes = absolute % 60;
    const sign = total < 0 ? 'Minus ' : '';
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    const minuteLabel = minutes === 1 ? 'minute' : 'minutes';

    return `${sign}${hours} ${hourLabel} ${minutes} ${minuteLabel}`;
}

function excelValue(total, format) {
    switch (format) {
        case 'decimal':
            return (total / 60).toFixed(4);
        case 'duration':
            return formatDuration(total);
        case 'dot':
            return formatDuration(total, '.');
        default:
            return String(total);
    }
}

const get = id => document.getElementById(id);
const input = get('expression');
const inputError = get('input-error');
const totalDisplay = get('total');
const resultMessage = get('result-message');
const breakdown = get('breakdown');
const stepsTable = get('steps');
const excelFormat = get('excel-format');
const copyButton = get('copy');
const copyPreview = get('copy-preview');
const copyStatus = get('copy-status');
const manualCopy = get('manual-copy');

const modeButtons = {
    add: get('add'),
    subtract: get('subtract')
};

const examples = {
    add: '1.3 + 2.4',
    subtract: '5.20 - 1.40 - 0.30'
};

const drafts = {
    add: '',
    subtract: ''
};

const recent = [];
let mode = 'add';
let result = null;
let revision = 0;

function refreshCopyControls() {
    copyStatus.textContent = '';
    manualCopy.hidden = true;
    manualCopy.value = '';
    copyButton.disabled = result === null;

    if (!result) {
        copyPreview.textContent = 'Choose the format your worksheet uses.';
        return;
    }

    const format = excelFormat.value;
    const value = excelValue(result.total, format);
    const textHint = format === 'duration' || format === 'dot'
        ? ' Use an Excel cell formatted as Text to preserve it exactly.'
        : '';

    copyPreview.textContent = `Copies ${value}.${textHint}`;
}

function invalidateResult() {
    revision++;
    result = null;
    inputError.hidden = true;
    input.removeAttribute('aria-invalid');
    totalDisplay.hidden = true;
    totalDisplay.textContent = '';
    breakdown.hidden = true;
    stepsTable.replaceChildren();
    resultMessage.textContent = input.value.trim()
        ? 'Calculate to update the result.'
        : 'Enter flight times to calculate a total.';
    refreshCopyControls();
}

function selectMode(nextMode) {
    if (nextMode === mode) return;

    drafts[mode] = input.value;
    mode = nextMode;
    input.value = drafts[mode];
    input.placeholder = `e.g. ${examples[mode]}`;

    for (const [name, button] of Object.entries(modeButtons)) {
        button.setAttribute('aria-pressed', String(name === mode));
    }

    invalidateResult();
}

function renderBreakdown(steps) {
    for (const step of steps) {
        const row = stepsTable.insertRow();
        const signedDuration = step.sign + formatDuration(step.duration);

        for (const value of [step.entry, signedDuration, formatDuration(step.total)]) {
            row.insertCell().textContent = value;
        }
    }

    breakdown.hidden = false;
}

function rememberCalculation(expression, total) {
    const previous = recent.findIndex(entry => entry.expression === expression && entry.mode === mode);

    if (previous !== -1) {
        recent.splice(previous, 1);
    }

    recent.unshift({ expression, mode, total });
    recent.splice(5);

    const list = get('recent');
    list.replaceChildren();

    for (const entry of recent) {
        const item = document.createElement('li');
        const button = document.createElement('button');

        button.type = 'button';
        button.textContent = `${entry.expression} = ${formatDuration(entry.total)}`;
        button.addEventListener('click', () => {
            selectMode(entry.mode);
            input.value = entry.expression;
            calculate(false);
            input.focus();
        });

        item.append(button);
        list.append(item);
    }

    get('history').hidden = false;
}

function calculate(record = true) {
    invalidateResult();

    try {
        result = parseExpression(input.value);
    } catch (error) {
        input.setAttribute('aria-invalid', 'true');
        inputError.textContent = error.message;
        inputError.hidden = false;
        input.focus();
        return;
    }

    totalDisplay.textContent = formatDuration(result.total);
    totalDisplay.hidden = false;
    resultMessage.textContent = describeDuration(result.total);
    renderBreakdown(result.steps);
    refreshCopyControls();

    if (record) {
        rememberCalculation(input.value.trim(), result.total);

        if (typeof window.gtag === 'function') {
            window.gtag('event', 'calculate', {
                operation: mode === 'add' ? 'addition' : 'subtraction'
            });
        }
    }
}

for (const [name, button] of Object.entries(modeButtons)) {
    button.addEventListener('click', () => selectMode(name));
}

get('calculator').addEventListener('submit', event => {
    event.preventDefault();
    calculate();
});

input.addEventListener('input', invalidateResult);

get('example').addEventListener('click', () => {
    input.value = examples[mode];
    invalidateResult();
    input.focus();
});

get('clear').addEventListener('click', () => {
    input.value = '';
    invalidateResult();
    input.focus();
});

excelFormat.addEventListener('change', () => {
    revision++;
    refreshCopyControls();
});

copyButton.addEventListener('click', async () => {
    if (!result) return;

    const copyRevision = revision;
    const value = excelValue(result.total, excelFormat.value);

    try {
        await navigator.clipboard.writeText(value);

        if (copyRevision === revision) {
            manualCopy.hidden = true;
            copyStatus.textContent = `Copied ${value} for Excel.`;
        }
    } catch {
        if (copyRevision !== revision) return;

        manualCopy.value = value;
        manualCopy.hidden = false;
        manualCopy.focus();
        manualCopy.select();
        copyStatus.textContent = 'Press Ctrl+C or Cmd+C to copy the selected value.';
    }
});
