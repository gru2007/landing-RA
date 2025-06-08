document.addEventListener('DOMContentLoaded', () => {
  const loginCard = document.getElementById('login-card');
  const loginForm = document.getElementById('login-form');
  const loginMsg = document.getElementById('login-message');
  const formsWrap = document.getElementById('admin-forms');
  const form = document.getElementById('payment-form');
  const result = document.getElementById('result');
  const invoiceForm = document.getElementById('invoice-form');
  const invoiceResult = document.getElementById('invoice-result');
  let adminPassword = '';

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pwd = loginForm.password.value;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      const data = await res.json();
      if (data.ok) {
        adminPassword = pwd;
        loginCard.classList.add('hidden');
        formsWrap.classList.remove('hidden');
      } else {
        loginMsg.textContent = 'Неверный пароль';
        loginMsg.classList.remove('hidden');
      }
    } catch (_) {
      loginMsg.textContent = 'Ошибка сети';
      loginMsg.classList.remove('hidden');
    }
  });

  // Set default redirect to the status page
  form.return_url.value = `${window.location.origin}/result.html`;

  async function signString(str) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(adminPassword), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const buf = await crypto.subtle.sign('HMAC', key, enc.encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const query = new URLSearchParams({
      amount: formData.get('amount'),
      description: formData.get('description'),
      email: formData.get('email'),
      capture: formData.get('capture') ? 'false' : 'true',
      payment_method: formData.get('payment_method'),
      return_url: formData.get('return_url') || `${window.location.origin}/result.html`
    });

    const sig = await signString(query.toString());
    query.append('sig', sig);

    const link = `${window.location.origin}/invoice.html?${query.toString()}`;
    result.innerHTML = `<p>Ссылка для клиента: <a href="${link}" target="_blank">${link}</a></p>`;
    result.classList.remove('hidden');
  });

  if (invoiceForm) {
    invoiceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(invoiceForm);
      const metadataText = formData.get('inv_metadata');
      let metadata;
      try {
        metadata = metadataText ? JSON.parse(metadataText) : undefined;
      } catch (err) {
        invoiceResult.textContent = 'Некорректный JSON в метаданных';
        invoiceResult.classList.remove('hidden');
        return;
      }

      const payload = {
        payment_data: {
          amount: { value: formData.get('inv_amount'), currency: 'RUB' },
          capture: !formData.get('inv_capture')
        },
        cart: [{
          description: formData.get('inv_item_desc'),
          quantity: '1',
          amount: { value: formData.get('inv_amount'), currency: 'RUB' }
        }],
        expires_at: new Date(formData.get('inv_expires')).toISOString(),
        description: formData.get('inv_description') || undefined,
        locale: formData.get('inv_locale') || undefined,
        metadata
      };

      try {
        const res = await fetch('/api/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка');
        invoiceResult.innerHTML = `<p>Ссылка на оплату: <a href="${data.invoice_url}" target="_blank">${data.invoice_url}</a></p>`;
      } catch (err) {
        invoiceResult.textContent = 'Ошибка: ' + err.message;
      }
      invoiceResult.classList.remove('hidden');
    });
  }
});
