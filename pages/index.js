import Head from 'next/head';
import Script from 'next/script';

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    background: linear-gradient(135deg, #000d1a 0%, #001a2e 50%, #000d1a 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #fff;
    padding: 0 16px 80px;
  }
  .header { text-align: center; padding: 52px 0 32px; }
  .tag {
    display: inline-block;
    background: rgba(0,200,120,0.12);
    border: 1px solid rgba(0,200,120,0.3);
    border-radius: 100px;
    padding: 4px 14px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #00cc88;
    margin-bottom: 20px;
  }
  h1 {
    font-size: clamp(30px, 8vw, 56px);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 14px;
    background: linear-gradient(135deg, #fff 40%, #00cc88 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle { font-size: 16px; color: rgba(255,255,255,0.5); max-width: 460px; margin: 0 auto; line-height: 1.55; }
  .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 24px 20px; max-width: 580px; margin: 0 auto 14px; }
  .card-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 12px; display: block; }
  textarea { width: 100%; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 14px; color: #fff; font-size: 15px; outline: none; font-family: inherit; resize: vertical; min-height: 140px; line-height: 1.5; }
  textarea::placeholder { color: rgba(255,255,255,0.3); }
  #analyze-btn { display: block; width: 100%; max-width: 580px; margin: 0 auto; background: linear-gradient(135deg, #00b377 0%, #0077ff 100%); border: none; border-radius: 14px; padding: 16px; color: #fff; font-size: 17px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
  #analyze-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .error-msg { color: #ff6b6b; font-size: 14px; text-align: center; margin-top: 12px; max-width: 580px; margin-left: auto; margin-right: auto; display: none; }
  #result-section { display: none; max-width: 580px; margin: 20px auto 0; }
  .result-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 24px; margin-bottom: 14px; }
  .verdict-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .verdict-badge { display: inline-block; border: 1.5px solid; border-radius: 100px; padding: 5px 18px; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; }
  .result-summary { font-size: 17px; font-weight: 600; line-height: 1.4; }
  .confidence-wrap { margin: 16px 0; }
  .confidence-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 100px; overflow: hidden; margin-bottom: 6px; }
  #confidence-bar-fill { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
  #confidence-label { font-size: 12px; color: rgba(255,255,255,0.4); }
  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin: 20px 0 10px; }
  #red-flags-list { list-style: none; padding: 0; }
  #red-flags-list li { padding: 7px 0 7px 22px; position: relative; font-size: 14px; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }
  #red-flags-list li::before { content: "⚠️"; position: absolute; left: 0; font-size: 13px; }
  #red-flags-list li:last-child { border-bottom: none; }
  .text-block { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.65; }
  .what-to-do-box { background: rgba(0,200,120,0.08); border: 1px solid rgba(0,200,120,0.2); border-radius: 12px; padding: 14px 16px; font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.6; margin-top: 10px; }
  #check-another-btn { display: block; width: 100%; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 13px; color: #fff; font-size: 15px; cursor: pointer; font-family: inherit; margin-top: 6px; }
  #paywall-section { display: none; max-width: 580px; margin: 20px auto 0; }
  .paywall-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; }
  .paywall-body { padding: 28px 24px 24px; text-align: center; }
  .paywall-icon { font-size: 36px; margin-bottom: 12px; }
  .paywall-title { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
  .paywall-sub { font-size: 14px; color: rgba(255,255,255,0.45); margin-bottom: 22px; line-height: 1.5; }
  .perks { text-align: left; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; }
  .perk { font-size: 14px; color: rgba(255,255,255,0.75); padding: 5px 0; }
  .perk::before { content: "✓  "; color: #00cc88; font-weight: 700; }
  #pay-btn { display: block; width: 100%; background: linear-gradient(135deg, #00b377 0%, #0077ff 100%); border: none; border-radius: 12px; padding: 15px; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; margin-bottom: 18px; font-family: inherit; }
  .already-paid { font-size: 11px; color: rgba(255,255,255,0.28); margin-bottom: 10px; }
  .unlock-row { display: flex; gap: 8px; }
  .unlock-input { flex: 1; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 13px; color: #fff; font-size: 14px; outline: none; font-family: monospace; }
  .unlock-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 16px; color: #fff; font-size: 14px; cursor: pointer; white-space: nowrap; font-family: inherit; }
  .unlock-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .footer { text-align: center; padding: 44px 0 0; font-size: 12px; color: rgba(255,255,255,0.18); line-height: 1.9; }
`;

const bodyHTML = `
<div class="header">
  <div class="tag">AI-Powered · Instant Results</div>
  <h1>Is This a Scam?</h1>
  <p class="subtitle">Paste any suspicious text, email, or link.<br>AI analyzes it and tells you exactly what's going on.</p>
</div>

<div class="card">
  <label class="card-label">Paste the suspicious content</label>
  <textarea id="inp-content" placeholder="Paste a text message, email, link, or describe a situation...&#10;&#10;e.g. &quot;Congratulations! You've been selected for a $1,000 gift card. Click here to claim...&quot;"></textarea>
</div>

<button id="analyze-btn">🔍&nbsp; Analyze This</button>
<p class="error-msg" id="error-msg"></p>

<div id="result-section">
  <div class="result-card">
    <div class="verdict-row">
      <span class="verdict-badge" id="verdict-badge">—</span>
      <span class="result-summary" id="result-summary"></span>
    </div>
    <div class="confidence-wrap">
      <div class="confidence-track"><div id="confidence-bar-fill" style="width:0%"></div></div>
      <span id="confidence-label">0% confidence</span>
    </div>
    <div class="section-title">Red Flags Detected</div>
    <ul id="red-flags-list"></ul>
    <div class="section-title">How This Scam Works</div>
    <p class="text-block" id="how-it-works"></p>
    <div class="section-title">What You Should Do</div>
    <div class="what-to-do-box" id="what-to-do"></div>
  </div>
  <button id="check-another-btn">↩&nbsp; Check Something Else</button>
</div>

<div id="paywall-section">
  <div class="paywall-card">
    <div class="paywall-body">
      <div class="paywall-icon">🔒</div>
      <div class="paywall-title">You've used your 3 free checks</div>
      <div class="paywall-sub">Unlock unlimited scam checks for 30 days — one flat fee, no subscription.</div>
      <div class="perks">
        <div class="perk">Unlimited scam checks for 30 days</div>
        <div class="perk">Analyze texts, emails, links &amp; more</div>
        <div class="perk">Detailed red flag breakdowns</div>
        <div class="perk">Actionable advice every time</div>
      </div>
      <button id="pay-btn">🔓&nbsp; Unlock for $4.99</button>
      <div class="already-paid">Already paid? Enter your order ID from your Gumroad confirmation email</div>
      <div class="unlock-row">
        <input class="unlock-input" id="order-input" placeholder="Your Gumroad order ID…" />
        <button class="unlock-btn" id="unlock-btn">Unlock</button>
      </div>
      <p class="error-msg" id="unlock-error" style="margin-top:10px;"></p>
    </div>
  </div>
</div>

<div class="footer">
  <div>Made with Claude AI · Is This a Scam?</div>
  <div>For educational purposes · Always trust your gut 🛡️</div>
</div>
`;

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>🔍 Is This a Scam?</title>
        <meta name="description" content="Paste any suspicious text, email, or link. AI analyzes it instantly and tells you if it's a scam." />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
