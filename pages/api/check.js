import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const FREE_LIMIT = 3;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { content, userId } = req.body || {};
  if (!content || !content.trim()) return res.status(400).json({ error: 'No content provided.' });
  if (!userId) return res.status(400).json({ error: 'Missing user ID.' });

  const isPaid = await redis.get('paid:' + userId);

  if (!isPaid) {
    const countKey = 'checks:' + userId;
    const count = await redis.get(countKey);
    const used = count ? parseInt(count) : 0;
    if (used >= FREE_LIMIT) {
      return res.status(402).json({ error: 'free_limit_reached', checksUsed: used });
    }
    await redis.set(countKey, used + 1, { ex: 30 * 24 * 60 * 60 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server misconfiguration.' });

  const systemPrompt = 'You are a cybersecurity and scam detection expert. Analyze content and determine if it is a scam, phishing attempt, fraud, or suspicious. Respond in valid JSON only, no markdown, with this exact structure: {"verdict": "SCAM" or "SUSPICIOUS" or "LIKELY SAFE", "confidence": <number 1-100>, "summary": "<one sentence verdict>", "red_flags": ["<flag1>", "<flag2>"], "how_it_works": "<paragraph explaining the scam tactic>", "what_to_do": "<short actionable advice>"}';

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://is-this-a-scam-xi.vercel.app',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Analyze this content:\n\n' + content.slice(0, 3000) }
        ],
        max_tokens: 600,
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'AI request failed.');

    const raw = data.choices?.[0]?.message?.content || '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: 'Analysis failed. Try again.' });
  }
}
