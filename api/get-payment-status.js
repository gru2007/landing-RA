export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const paymentId = req.query.payment_id;
  if (!paymentId) {
    res.status(400).json({ error: 'payment_id required' });
    return;
  }

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const apiKey = process.env.YOOKASSA_API_KEY;
  if (!shopId || !apiKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${shopId}:${apiKey}`).toString('base64')
      }
    });
    const data = await response.json();
    res.status(response.status).json({ status: data.status });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
