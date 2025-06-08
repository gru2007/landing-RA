import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const {
    payment_data,
    cart,
    delivery_method_data,
    expires_at,
    locale,
    description,
    metadata
  } = req.body || {};

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const apiKey = process.env.YOOKASSA_API_KEY;

  if (!shopId || !apiKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const idempotenceKey = crypto.randomUUID();

  const payload = {
    payment_data,
    cart,
    expires_at,
  };

  if (delivery_method_data) payload.delivery_method_data = delivery_method_data;
  if (locale) payload.locale = locale;
  if (description) payload.description = description;
  if (metadata) payload.metadata = metadata;

  try {
    const response = await fetch('https://api.yookassa.ru/v3/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': 'Basic ' + Buffer.from(`${shopId}:${apiKey}`).toString('base64'),
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json({ invoice_url: data.confirmation.confirmation_url, invoice_id: data.id, status: data.status });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
