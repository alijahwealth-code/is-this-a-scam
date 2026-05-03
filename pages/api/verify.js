const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const THIRTY_DAYS = 30 * 24 * 60 * 60;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, userId } = req.body || {};
  if (!orderId || !userId) return res.status(400).json({ error: 'Missing order ID or user ID.' });

  const exists = await redis.get(`sale:${orderId.trim()}`);
  if (!exists) return res.status(400).json({ error: 'Order ID not found. Check your confirmation email and try again.' });

  await redis.del(`sale:${orderId.trim()}`);
  await redis.set(`paid:${userId}`, '1', { ex: THIRTY_DAYS });

  return res.status(200).json({ success: true });
};
