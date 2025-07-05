import crypto from 'node:crypto';

// Создание шаблона статического QR-кода в СБП
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const {
    name,
    currency = 'RUB',
    distributionChannel = '',
    qrTemplate = {}
  } = req.body || {};

  const userName = process.env.ALFABANK_SBP_USERNAME;
  const password = process.env.ALFABANK_SBP_PASSWORD;
  const baseUrl = process.env.ALFABANK_BASE_URL || 'https://pay.alfabank.ru/payment/rest';

  if (!userName || !password) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const payload = {
    username: userName,
    password,
    type: 'SBP_QR',
    name: name || `template-${crypto.randomUUID()}`,
    currency,
    distributionChannel,
    qrTemplate
  };

  try {
    const response = await fetch(`${baseUrl}/templates/createTemplate.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
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
