// Запрос статуса заказа СБП в Альфа-Банке
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const orderId = req.query.orderId;
  const userName = process.env.ALFABANK_SBP_USERNAME;
  const password = process.env.ALFABANK_SBP_PASSWORD;
  const baseUrl = process.env.ALFABANK_BASE_URL || 'https://pay.alfabank.ru/payment/rest';

  if (!userName || !password) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  if (!orderId) {
    res.status(400).json({ error: 'orderId required' });
    return;
  }

  const params = new URLSearchParams({ userName, password, orderId });

  try {
    const response = await fetch(`${baseUrl}/getOrderStatusExtended.do?${params.toString()}`);
    const data = await response.json();
    if (data.errorCode) {
      res.status(400).json(data);
      return;
    }
    res.status(200).json({ orderStatus: data.orderStatus, actionCode: data.actionCode });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
