import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { payment_id, amount, currency = 'RUB', receipt } = req.body || {};

  if (!payment_id) {
    res.status(400).json({ error: 'payment_id required' });
    return;
  }

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const apiKey = process.env.YOOKASSA_API_KEY;

  if (!shopId || !apiKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const idempotenceKey = crypto.randomUUID();

  const payload = {};
  if (amount) {
    payload.amount = { value: amount, currency };
  }
  if (receipt) {
    payload.receipt = receipt;
  }

  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${payment_id}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': 'Basic ' + Buffer.from(`${shopId}:${apiKey}`).toString('base64'),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
