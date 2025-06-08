import crypto from "node:crypto";
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { amount, currency = 'RUB', description = '', capture = true, payment_method_types = ['bank_card'], return_url = '', receipt } = req.body || {};

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const apiKey = process.env.YOOKASSA_API_KEY;

  if (!shopId || !apiKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const idempotenceKey = crypto.randomUUID();

  const payload = {
    amount: { value: amount, currency },
    confirmation: { type: 'redirect', return_url: return_url || 'https://example.com' },
    capture,
    description,
    payment_method_data: { type: payment_method_types[0] },
  };

  if (receipt) {
    payload.receipt = receipt;
  }

  try {
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
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

    res.status(200).json({ confirmation_url: data.confirmation.confirmation_url, payment_id: data.id, status: data.status });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
