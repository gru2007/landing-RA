document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  const result = document.getElementById('result');
  const invoiceForm = document.getElementById('invoice-form');
  const invoiceResult = document.getElementById('invoice-result');

  // Set default redirect to the status page
  form.return_url.value = `${window.location.origin}/result.html`;

  form.addEventListener('submit', (e) => {
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
        amount: formData.get('inv_amount'),
        currency: 'RUB',
        description: formData.get('inv_description'),
        due_date: formData.get('inv_due') || undefined,
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
