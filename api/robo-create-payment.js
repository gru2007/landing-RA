import crypto from 'node:crypto';

// Создание ссылки на оплату в RoboKassa
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { amount, description = '', email = '', return_url = '' } = req.body || {};

  const login = process.env.ROBOKASSA_LOGIN;
  const password1 = process.env.ROBOKASSA_PASSWORD1;
  const isTest = process.env.ROBOKASSA_IS_TEST === 'true';
  const baseUrl = process.env.ROBOKASSA_BASE_URL || 'https://auth.robokassa.ru/Merchant/Index.aspx';

  if (!login || !password1) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const invId = Math.floor(Math.random() * 1_000_000).toString();
  const signSource = `${login}:${amount}:${invId}:${password1}`;
  const signature = crypto.createHash('md5').update(signSource).digest('hex');

  const params = new URLSearchParams({
    MerchantLogin: login,
    OutSum: amount,
    InvId: invId,
    Description: description,
    SignatureValue: signature,
    Culture: 'ru'
  });
  if (email) params.append('Email', email);
  if (return_url) {
    params.append('SuccessURL', return_url);
    params.append('FailURL', return_url);
  }
  if (isTest) params.append('IsTest', '1');

  const paymentUrl = `${baseUrl}?${params.toString()}`;

  res.status(200).json({ payment_url: paymentUrl, invoice_id: invId });
}
