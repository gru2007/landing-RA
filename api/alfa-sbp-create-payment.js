import crypto from 'node:crypto';

// Регистрация заказа и получение динамического QR для оплаты через СБП
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { amount, currency = 'RUB', description = '', return_url = '' } = req.body || {};

  const userName = process.env.ALFABANK_SBP_USERNAME;
  const password = process.env.ALFABANK_SBP_PASSWORD;
  const baseUrl = process.env.ALFABANK_BASE_URL || 'https://pay.alfabank.ru/payment/rest';

  if (!userName || !password) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const orderNumber = crypto.randomUUID();
  const registerParams = new URLSearchParams({
    userName,
    password,
    orderNumber,
    amount: Math.round(parseFloat(amount) * 100).toString(),
    currency,
    returnUrl: return_url || 'https://example.com',
    description,
    paymentWay: 'SBP_C2B'
  });

  try {
    const regRes = await fetch(`${baseUrl}/register.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: registerParams.toString()
    });
    const regData = await regRes.json();
    if (regData.errorCode) {
      res.status(400).json(regData);
      return;
    }
    const orderId = regData.orderId;
    const qrParams = new URLSearchParams({
      userName,
      password,
      mdOrder: orderId,
      redirectUrl: return_url || 'https://example.com',
      qrFormat: 'image'
    });
    const qrRes = await fetch(`${baseUrl}/sbp/c2b/qr/dynamic/get.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: qrParams.toString()
    });
    const qrData = await qrRes.json();
    if (qrData.errorCode) {
      res.status(400).json(qrData);
      return;
    }
    res.status(200).json({ orderId, qrId: qrData.qrId, payload: qrData.payload });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
