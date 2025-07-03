export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const apiKey = process.env.YOOKASSA_API_KEY;
  const alfaUser = process.env.ALFABANK_USERNAME;
  const alfaPass = process.env.ALFABANK_PASSWORD;

  res.status(200).json({
    YOOKASSA_SHOP_ID: shopId ? 'present' : 'missing',
    YOOKASSA_API_KEY: apiKey ? 'present' : 'missing',
    ALFABANK_USERNAME: alfaUser ? 'present' : 'missing',
    ALFABANK_PASSWORD: alfaPass ? 'present' : 'missing'
  });
}
