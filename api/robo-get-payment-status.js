import crypto from 'node:crypto';

// Проверка статуса платежа в RoboKassa
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const invId = req.query.invId;
  if (!invId) {
    res.status(400).json({ error: 'invId required' });
    return;
  }

  const login = process.env.ROBOKASSA_LOGIN;
  const password2 = process.env.ROBOKASSA_PASSWORD2;
  if (!login || !password2) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const signSource = `${login}:${invId}:${password2}`;
  const signature = crypto.createHash('md5').update(signSource).digest('hex');
  const url = `https://auth.robokassa.ru/Merchant/WebService/Service.asmx/OpState?MerchantLogin=${login}&InvoiceID=${invId}&Signature=${signature}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) {
      res.status(response.status).send(text);
      return;
    }
    const match = text.match(/<State>\s*<Code>(\d+)<\/Code>/);
    const code = match ? parseInt(match[1], 10) : null;
    res.status(200).json({ stateCode: code });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
