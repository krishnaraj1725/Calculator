const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let expression = '';   // raw expression, e.g. "12+5"
let justEvaluated = false;

function updateDisplay() {
  expressionEl.textContent = formatExpression(expression);
  resultEl.textContent = expression === '' ? '0' : formatExpression(expression);
}

function formatExpression(exp) {
  return exp
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

function isOperator(ch) {
  return ['+', '-', '*', '/'].includes(ch);
}

function appendValue(value) {
  if (justEvaluated) {
    // Start fresh if a number is pressed after "=", continue if operator pressed
    if (!isOperator(value)) {
      expression = '';
    }
    justEvaluated = false;
  }

  const lastChar = expression.slice(-1);

  if (isOperator(value)) {
    if (expression === '' && value !== '-') return; // no leading operator except minus
    if (isOperator(lastChar)) {
      expression = expression.slice(0, -1) + value; // replace last operator
      updateDisplay();
      return;
    }
  }

  if (value === '.') {
    // prevent multiple decimals in the current number segment
    const parts = expression.split(/[\+\-\*\/]/);
    const currentSegment = parts[parts.length - 1];
    if (currentSegment.includes('.')) return;
    if (currentSegment === '') value = '0.';
  }

  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = '';
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  updateDisplay();
}

function applyPercent() {
  if (expression === '') return;
  // apply percent to the last number segment
  const match = expression.match(/(\d+\.?\d*)$/);
  if (!match) return;
  const num = parseFloat(match[0]);
  const percentVal = num / 100;
  expression = expression.slice(0, match.index) + percentVal.toString();
  updateDisplay();
}

function evaluateExpression() {
  if (expression === '') return;

  let exp = expression;
  // strip trailing operator if present
  if (isOperator(exp.slice(-1))) {
    exp = exp.slice(0, -1);
  }

  try {
    // Safe evaluation restricted to digits, operators, decimal points
    if (!/^[0-9+\-*/.]+$/.test(exp)) throw new Error('Invalid expression');
    const value = Function('"use strict"; return (' + exp + ')')();

    if (!isFinite(value)) {
      resultEl.textContent = 'Error';
      expressionEl.textContent = formatExpression(expression);
      expression = '';
      justEvaluated = true;
      return;
    }

    const rounded = Math.round(value * 1e10) / 1e10; // avoid floating point noise
    expressionEl.textContent = formatExpression(expression) + ' =';
    resultEl.textContent = rounded;
    expression = rounded.toString();
    justEvaluated = true;
  } catch (e) {
    resultEl.textContent = 'Error';
    expression = '';
    justEvaluated = true;
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteLast();
    if (action === 'percent') return applyPercent();
    if (action === 'equals') return evaluateExpression();
    if (value !== undefined) return appendValue(value);
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/[0-9]/.test(key)) return appendValue(key);
  if (['+', '-', '*', '/'].includes(key)) return appendValue(key);
  if (key === '.') return appendValue('.');
  if (key === 'Enter' || key === '=') { e.preventDefault(); return evaluateExpression(); }
  if (key === 'Backspace') return deleteLast();
  if (key === 'Escape') return clearAll();
  if (key === '%') return applyPercent();
});

updateDisplay();
