import crypto from 'node:crypto';

// Создание заказа в платёжном шлюзе Альфа-Банка

// Коды валют для API Альфа-Банка
const CURRENCY_CODES = {
  'RUB': '810',
  'USD': '840', 
  'EUR': '978'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Читаем параметры платежа из тела запроса
  const { amount, currency = 'RUB', description = '', return_url = '' } = req.body || {};

  // Данные для доступа к API
  const userName = process.env.ALFABANK_USERNAME;
  const password = process.env.ALFABANK_PASSWORD;
  const baseUrl = process.env.ALFABANK_BASE_URL || 'https://pay.alfabank.ru/payment/rest';

  if (!userName || !password) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // Проверяем поддерживаемую валюту
  const currencyCode = CURRENCY_CODES[currency.toUpperCase()];
  if (!currencyCode) {
    res.status(400).json({ 
      error: 'Unsupported currency', 
      supportedCurrencies: Object.keys(CURRENCY_CODES),
      message: 'Supported currencies: RUB, USD, EUR'
    });
    return;
  }

  // Уникальный номер заказа для банка
  const orderNumber = crypto.randomUUID();
  const params = new URLSearchParams({
    userName,
    password,
    orderNumber,
    amount: Math.round(parseFloat(amount) * 100).toString(),
    currency: currencyCode,
    returnUrl: return_url || 'https://example.com',
    description
  });

  try {
    // Отправляем запрос к API банка
    const response = await fetch(`${baseUrl}/register.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await response.json();
    if (data.errorCode) {
      res.status(400).json(data);
      return;
    }
    res.status(200).json({ formUrl: data.formUrl, orderId: data.orderId });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
