document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
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
    const res = await fetch(`/api/get-payment-status?payment_id=${paymentId}`);
    const data = await res.json();
    if (!res.ok) throw new Error('err');

    if (data.status === 'succeeded') {
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
