// Возврат платежа по заказу, оплаченному через СБП
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { orderId, amount } = req.body || {};
  const userName = process.env.ALFABANK_SBP_USERNAME;
  const password = process.env.ALFABANK_SBP_PASSWORD;
  const baseUrl = process.env.ALFABANK_BASE_URL || 'https://pay.alfabank.ru/payment/rest';

  if (!userName || !password) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  if (!orderId || !amount) {
    res.status(400).json({ error: 'orderId and amount required' });
    return;
  }

  const params = new URLSearchParams({
    userName,
    password,
    orderId,
    amount: Math.round(parseFloat(amount) * 100).toString()
  });

  try {
    const response = await fetch(`${baseUrl}/refund.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await response.json();
    if (data.errorCode) {
      res.status(400).json(data);
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
