document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  const result = document.getElementById('result');
  const invoiceForm = document.getElementById('invoice-form');
  const invoiceResult = document.getElementById('invoice-result');

  // Set default redirect to the status page
  form.return_url.value = `${window.location.origin}`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const query = new URLSearchParams({
      amount: formData.get('amount'),
      description: formData.get('description'),
      email: formData.get('email'),
      capture: formData.get('capture') ? 'false' : 'true',
      payment_method: formData.get('payment_method'),
      gateway: formData.get('gateway'),
      return_url: formData.get('return_url') || `${window.location.origin}`
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

  const templateForm = document.getElementById('sbp-template-form');
  const templateResult = document.getElementById('sbp-template-result');
  if (templateForm) {
    templateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(templateForm);
      const payload = {
        name: fd.get('template_name'),
        distributionChannel: fd.get('channel'),
        qrTemplate: {
          qrcId: fd.get('qrc_id'),
          paymentPurpose: fd.get('purpose'),
          qrWidth: fd.get('qr_width'),
          qrHeight: fd.get('qr_height')
        }
      };
      try {
        const res = await fetch('/api/alfa-sbp-create-template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка');
        templateResult.textContent = `Создан шаблон. ID: ${data.templateId}`;
      } catch (err) {
        templateResult.textContent = 'Ошибка: ' + err.message;
      }
      templateResult.classList.remove('hidden');
    });
  }

  const refundForm = document.getElementById('sbp-refund-form');
  const refundResult = document.getElementById('sbp-refund-result');
  if (refundForm) {
    refundForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(refundForm);
      const payload = {
        orderId: fd.get('refund_order'),
        amount: fd.get('refund_amount')
      };
      try {
        const res = await fetch('/api/alfa-sbp-refund', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка');
        refundResult.textContent = 'Возврат выполнен';
      } catch (err) {
        refundResult.textContent = 'Ошибка: ' + err.message;
      }
      refundResult.classList.remove('hidden');
    });
  }
});
