document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const gateway = params.get('gateway') || 'yookassa';
  let paymentId = params.get('orderId');
  if (!paymentId) {
    paymentId = localStorage.getItem('latestPaymentId');
  } else {
    localStorage.setItem('latestPaymentId', paymentId);
  }
  const statusBox = document.getElementById('status');

  if (!paymentId) {
    statusBox.innerHTML = '<p>Неизвестный платёж</p>';
    return;
  }

  try {
    let apiUrl;
    if (gateway === 'alfabank') {
      apiUrl = `/api/alfa-get-payment-status?orderId=${paymentId}`;
    } else {
      apiUrl = `/api/get-payment-status?payment_id=${paymentId}`;
    }
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (!res.ok) throw new Error('err');

    let success;
    if (gateway === 'alfabank') {
      success = data.orderStatus === 2;
    } else {
      success = data.status === 'succeeded';
    }

    if (success) {
      statusBox.innerHTML = '<div class="checkmark success"></div><h2>Оплата прошла успешно!</h2>';
      statusBox.classList.add('success');
    } else {
      statusBox.innerHTML = '<div class="checkmark failed"></div><h2>Оплата не прошла.</h2>';
      statusBox.classList.add('failed');
    }
  } catch (err) {
    statusBox.innerHTML = '<p>Ошибка при проверке статуса</p>';
  }
});
