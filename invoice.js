document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const amount = params.get('amount');
  const description = params.get('description') || '';
  const email = params.get('email') || '';
  const capture = params.get('capture') !== 'false';
  const method = params.get('payment_method') || 'bank_card';
  const returnUrl = params.get('return_url') || `${location.origin}/result.html`;

  document.getElementById('description').textContent = description;
  document.getElementById('sum').textContent = `${amount} RUB`;

  const payBtn = document.getElementById('pay-btn');
  const message = document.getElementById('message');

  payBtn.addEventListener('click', async () => {
    message.textContent = 'Создание платежа...';
    message.classList.remove('hidden');

    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      localStorage.setItem('latestPaymentId', data.payment_id);
      window.location.href = data.confirmation_url;
    } catch (err) {
      message.textContent = 'Ошибка: ' + err.message;
    }
  });
});
