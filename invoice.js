document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const amount = params.get('amount');
  const description = params.get('description') || '';
  const email = params.get('email') || '';
  const capture = params.get('capture') !== 'false';
  const method = params.get('payment_method') || 'bank_card';
  const gateway = params.get('gateway') || 'yookassa';
  const returnUrl = params.get('return_url') || `${location.origin}`;

  document.getElementById('description').textContent = description;
  document.getElementById('sum').textContent = `${amount} ₽`;

  const payBtn = document.getElementById('pay-btn');
  const message = document.getElementById('message');

  payBtn.addEventListener('click', async () => {
    payBtn.classList.add('loading');
    payBtn.textContent = 'Обработка...';
    message.textContent = 'Создание платежа...';
    message.classList.remove('hidden');

    try {
      let apiUrl = '/api/create-payment';
      let payload;
      if (gateway === 'alfabank') {
        if (method === 'sbp') {
          apiUrl = '/api/alfa-sbp-create-payment';
          payload = { amount, currency: 'RUB', description, return_url: returnUrl };
        } else {
          apiUrl = '/api/alfa-create-payment';
          payload = { amount, currency: 'RUB', description, return_url: returnUrl };
        }
      } else if (gateway === 'robokassa') {
        apiUrl = '/api/robo-create-payment';
        payload = { amount, description, email, return_url: returnUrl };
      } else {
        payload = {
          amount,
          currency: 'RUB',
          description,
          capture,
          payment_method_types: [method],
          return_url: returnUrl,
          receipt: email ? {
            customer: { email },
            items: [{
              description,
              quantity: '1.0',
              amount: { value: amount, currency: 'RUB' },
              vat_code: 1
            }]
          } : undefined
        };
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
        if (gateway === 'alfabank') {
          localStorage.setItem('latestPaymentId', data.orderId);
          if (method === 'sbp') {
            window.location.href = data.payload;
          } else {
            window.location.href = data.formUrl;
          }
        } else if (gateway === 'robokassa') {
        localStorage.setItem('latestPaymentId', data.invoice_id);
        window.location.href = data.payment_url;
      } else {
        localStorage.setItem('latestPaymentId', data.payment_id);
        window.location.href = data.confirmation_url;
      }
    } catch (err) {
      message.textContent = 'Ошибка: ' + err.message;
      message.classList.add('error');
    } finally {
      payBtn.classList.remove('loading');
      payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Оплатить';
    }
  });
});
