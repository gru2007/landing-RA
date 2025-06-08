document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  const result = document.getElementById('result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const query = new URLSearchParams({
      amount: formData.get('amount'),
      description: formData.get('description'),
      capture: formData.get('capture') ? 'false' : 'true',
      payment_method: formData.get('payment_method'),
      return_url: formData.get('return_url')
    });

    const link = `${window.location.origin}/invoice.html?${query.toString()}`;
    result.innerHTML = `<p>Ссылка для клиента: <a href="${link}" target="_blank">${link}</a></p>`;
    result.classList.remove('hidden');
  });
});
