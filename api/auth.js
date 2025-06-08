export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password } = req.body || {};
  if (!password) {
    res.status(400).json({ error: 'password required' });
    return;
  }

  if (password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
}
