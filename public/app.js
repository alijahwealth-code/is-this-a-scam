function getUserId() {
  let id = localStorage.getItem('scam_uid');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem('scam_uid', id);
  }
  return id;
}

const PAYMENT_LINK = 'https://wealthyquest67.gumroad.com/l/ypeazl';

document.getElementById('analyze-btn').addEventListener('click', analyze);

async function analyze() {
  const content = document.getElementById('inp-content').value.trim();
  if (!content) { showError('error-msg', 'Paste something to analyze first.'); return; }

  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;
  btn.textContent = '🔍  Analyzing…';
  hideError('error-msg');
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('paywall-section').style.display = 'none';

  try {
    const resp = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId: getUserId() }),
    });

    const data = await resp.json();

    if (resp.status === 402 && data.error === 'free_limit_reached') {
      showPaywall();
      return;
    }

    if (!resp.ok) throw new Error(data.error || 'Analysis failed.');

    showResult(data);

  } catch (e) {
    showError('error-msg', e.message || 'Something went wrong. Try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = '🔍  Analyze This';
  }
}

document.getElementById('pay-btn').addEventListener('click', () => {
  window.open(PAYMENT_LINK, '_blank');
});

document.getElementById('unlock-btn').addEventListener('click', unlock);
document.getElementById('order-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') unlock();
});

async function unlock() {
  const orderId = document.getElementById('order-input').value.trim();
  if (!orderId) { alert('Paste your order ID from the Gumroad confirmation email.'); return; }

  const btn = document.getElementById('unlock-btn');
  btn.textContent = 'Checking…';
  btn.disabled = true;
  hideError('unlock-error');

  try {
    const resp = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, userId: getUserId() }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) throw new Error(data.error || 'Verification failed.');

    document.getElementById('paywall-section').style.display = 'none';
    document.getElementById('inp-content').scrollIntoView({ behavior: 'smooth' });
    showError('error-msg', '✅ Unlocked! Now running your analysis…');
    setTimeout(() => { hideError('error-msg'); analyze(); }, 800);

  } catch (e) {
    showError('unlock-error', e.message || 'Could not verify. Check your order ID and try again.');
    btn.textContent = 'Unlock';
    btn.disabled = false;
  }
}

document.getElementById('check-another-btn').addEventListener('click', () => {
  document.getElementById('inp-content').value = '';
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('inp-content').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function showResult(data) {
  const verdictEl = document.getElementById('verdict-badge');
  const summaryEl = document.getElementById('result-summary');
  const confidenceEl = document.getElementById('confidence-bar-fill');
  const confidenceLabelEl = document.getElementById('confidence-label');
  const flagsEl = document.getElementById('red-flags-list');
  const howEl = document.getElementById('how-it-works');
  const whatEl = document.getElementById('what-to-do');

  const colors = { 'SCAM': '#ff3c3c', 'SUSPICIOUS': '#ffaa00', 'LIKELY SAFE': '#00cc88' };
  const color = colors[data.verdict] || '#aaa';
  verdictEl.textContent = data.verdict;
  verdictEl.style.background = color + '22';
  verdictEl.style.borderColor = color;
  verdictEl.style.color = color;

  summaryEl.textContent = data.summary || '';
  confidenceEl.style.width = (data.confidence || 0) + '%';
  confidenceEl.style.background = color;
  confidenceLabelEl.textContent = (data.confidence || 0) + '% confidence';

  flagsEl.innerHTML = '';
  (data.red_flags || []).forEach(flag => {
    const li = document.createElement('li');
    li.textContent = flag;
    flagsEl.appendChild(li);
  });

  howEl.textContent = data.how_it_works || '';
  whatEl.textContent = data.what_to_do || '';

  document.getElementById('result-section').style.display = 'block';
  document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
}

function showPaywall() {
  document.getElementById('paywall-section').style.display = 'block';
  document.getElementById('paywall-section').scrollIntoView({ behavior: 'smooth' });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError(id) {
  document.getElementById(id).style.display = 'none';
}
