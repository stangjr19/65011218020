// Retro Calculator Logic with Safe Evaluation

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.buttons button');

let expr = '';
let lastResult = '';

/**
 * Update display for expression and result
 */
function updateDisplay() {
    expressionEl.textContent = expr || '\u00A0';
    resultEl.textContent = lastResult || '\u00A0';
}

/**
 * Safely evaluate the expression
 * Only allow digits, operators, parentheses, decimal, percent
 */
function safeEval(rawExpr) {
    // Replace unicode operators with JS equivalents
    let safeExpr = rawExpr
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/%/g, '/100')
        .replace(/[^0-9+\-*/().\/ ]/g, ''); // Remove unsafe chars

    // Prevent dangerous patterns
    if (/[^0-9+\-*/(). ]/.test(safeExpr)) return 'ข้อผิดพลาด';

    try {
        // eslint-disable-next-line no-eval
        let val = eval(safeExpr);
        if (typeof val === 'number' && isFinite(val)) {
            return val;
        }
        return 'ข้อผิดพลาด';
    } catch {
        return 'ข้อผิดพลาด';
    }
}

/**
 * Handle button click
 */
function handleButton(e) {
    const btn = e.currentTarget;
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === 'clear') {
        expr = '';
        lastResult = '';
    } else if (action === 'backspace') {
        expr = expr.slice(0, -1);
    } else if (action === 'equals') {
        if (expr.trim() === '') return;
        const res = safeEval(expr);
        lastResult = res;
    } else if (value) {
        expr += value;
    }
    updateDisplay();
}

/**
 * Keyboard support
 */
function handleKey(e) {
    if (e.key.match(/[0-9]/)) {
        expr += e.key;
    } else if (e.key === '.') {
        expr += '.';
    } else if (e.key === '+') {
        expr += '+';
    } else if (e.key === '-') {
        expr += '-';
    } else if (e.key === '*' || e.key === 'x') {
        expr += '×';
    } else if (e.key === '/' || e.key === '÷') {
        expr += '÷';
    } else if (e.key === '(') {
        expr += '(';
    } else if (e.key === ')') {
        expr += ')';
    } else if (e.key === '%') {
        expr += '%';
    } else if (e.key === 'Enter' || e.key === '=') {
        if (expr.trim() === '') return;
        const res = safeEval(expr);
        lastResult = res;
    } else if (e.key === 'Backspace') {
        expr = expr.slice(0, -1);
    } else if (e.key === 'Escape') {
        expr = '';
        lastResult = '';
    } else {
        return;
    }
    updateDisplay();
    e.preventDefault();
}

// Attach event listeners
buttons.forEach(btn => btn.addEventListener('click', handleButton));
window.addEventListener('keydown', handleKey);

// Initial display
updateDisplay();