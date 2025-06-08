import crypto from 'node:crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query, sig } = req.body || {};
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  if (!query || !sig) {
    res.status(400).json({ error: 'query and sig required' });
    return;
  }

  const expected = crypto.createHmac('sha256', password).update(query).digest('hex');
  const valid = expected === sig;
  res.status(valid ? 200 : 401).json({ valid });
}
