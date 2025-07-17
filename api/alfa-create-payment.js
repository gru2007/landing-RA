import crypto from 'node:crypto';

// Создание заказа в платёжном шлюзе Альфа-Банка с расширенным логированием

// Коды валют для API Альфа-Банка
const CURRENCY_CODES = {
  RUB: '810',
  USD: '840',
  EUR: '978',
};

/**
 * Маскируем чувствительные строки в логах
 * @param {string} str исходная строка
 * @param {number} visible сколько символов оставить видимыми
 */
function mask(str = '', visible = 2) {
  return str.length <= visible ? '*'.repeat(str.length) : `${str.slice(0, visible)}***`;
}

export default async function handler(req, res) {
  console.log('[AlfaBank] → incoming request', {
    method: req.method,
    path: req.url,
    body: req.body,
  });

  if (req.method !== 'POST') {
    console.warn('[AlfaBank] ✖ unsupported HTTP method', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Читаем параметры платежа из тела запроса
  const { amount, currency = 'RUB', description = '', return_url = '' } = req.body || {};

  // Данные для доступа к API
  const userName = process.env.ALFABANK_USERNAME;
  const password = process.env.ALFABANK_PASSWORD;
  // Используем официальный production‑URL, если переменная не задана
  const baseUrl = process.env.ALFABANK_BASE_URL || 'https://payment.alfabank.ru/payment/rest';

  console.log('[AlfaBank] • credentials', {
    userName: mask(userName),
    passwordSet: Boolean(password),
    baseUrl,
  });

  if (!userName || !password) {
    console.error('[AlfaBank] ✖ missing API credentials');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // Проверяем поддерживаемую валюту
  const currencyCode = CURRENCY_CODES[currency.toUpperCase()];
  if (!currencyCode) {
    console.warn('[AlfaBank] ✖ unsupported currency', currency);
    res.status(400).json({
      error: 'Unsupported currency',
      supportedCurrencies: Object.keys(CURRENCY_CODES),
      message: 'Supported currencies: RUB, USD, EUR',
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
    description,
  });

  console.log('[AlfaBank] → register.do payload', Object.fromEntries(params));

  try {
    const url = `${baseUrl}/register.do`;
    console.log('[AlfaBank] ⇢ sending POST', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    console.log('[AlfaBank] ← response status', response.status);

    const rawText = await response.text();
    console.log('[AlfaBank] ← raw response', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      console.error('[AlfaBank] ✖ JSON parse error', jsonErr);
      throw new Error('Non‑JSON response from bank');
    }

    console.log('[AlfaBank] ← parsed response', data);

    if (data.errorCode && +data.errorCode !== 0) {
      console.error('[AlfaBank] ✖ bank returned error', data);
      res.status(400).json(data);
      return;
    }

    res.status(200).json({ formUrl: data.formUrl, orderId: data.orderId });
  } catch (err) {
    console.error('[AlfaBank] ✖ request failed', err);
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
