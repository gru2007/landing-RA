# ЮKassa: подробное руководство

Этот файл содержит основные сведения из официальной документации ЮKassa и поможет в будущей интеграции системы приёма платежей.

## 1. Создание платежа

Используйте `POST https://api.yookassa.ru/v3/payments`.

В запросе передаются:
- `amount` — сумма и валюта (например, `RUB`).
- `payment_method_data` — способ оплаты. Пример для карты:
  ```json
  {
    "type": "bank_card",
    "card": {
      "number": "4111111111111111",
      "expiry_month": "12",
      "expiry_year": "2027",
      "csc": "123"
    }
  }
  ```
- `confirmation` — метод подтверждения (`redirect` с `return_url`).
- `capture` — `true` или `false`. Если `false`, потребуется отдельный запрос захвата.
- `description` — назначение платежа.

Пример запроса:
```http
POST /v3/payments HTTP/1.1
Idempotence-Key: <unique-key>
Content-Type: application/json

{
  "amount": { "value": "1000.00", "currency": "RUB" },
  "confirmation": { "type": "redirect", "return_url": "https://example.com/return" },
  "payment_method_data": { "type": "bank_card" },
  "description": "Оплата заказа №1"
}
```
Ответ содержит статус (`pending` или `waiting_for_capture`) и ссылку `confirmation_url`.

## 2. Быстрый старт

1. Зарегистрируйтесь и получите `shop_id` и секретный ключ.
2. Выберите способ интеграции: API, CMS-модуль или готовая форма.
3. Создайте тестовый платеж в песочнице.
4. После успешной проверки переходите в рабочий режим.

## 3. Процесс платежа

1. Создание платежа и перенаправление пользователя на `confirmation_url`.
2. Подтверждение оплаты пользователем.
3. Получение итогового статуса через webhooks.

Возможные статусы:
- `pending` — ожидает подтверждения.
- `waiting_for_capture` — требуется холдирование.
- `succeeded` — успешно оплачен.
- `canceled` — отменён, подробности в `cancellation_details`.

## 4. Способы оплаты

- Банковские карты.
- SberPay и СБП.
- Электронные кошельки (ЮMoney, Qiwi).
- QR-коды и наличные через терминалы.
- Apple Pay и Google Pay через форму ЮKassa.

Укажите метод в `payment_method_data` или передайте `payment_method_id` сохранённого способа.

## 5. Выбор сценария интеграции

- **Прямое API** — полная гибкость, требует серверной части.
- **CMS-плагины** — готовые модули для популярных систем.
- **Умный платеж** — минимальная разработка, достаточно разместить ссылку на форму.

## 6. Умный платеж

Форма оплаты, где пользователь сам выбирает метод. Вы генерируете ссылку и размещаете на сайте. ЮKassa обрабатывает все этапы и отправляет чек.

## 7. Автоотправка чеков для самозанятых

1. Включите опцию в настройках магазина.
2. Передавайте объект `receipt` с данными товара и покупателя.
3. YooKassa зарегистрирует чек в сервисе "Мой налог" и вернёт статус в поле `receipt_registration`.

## 8. Неуспешные платежи

При статусе `canceled` возвращается объект `cancellation_details`:
- `party` — кто отменил (`merchant` или `yoo_money`).
- `reason` — причина (`payment_expired`, `general_decline` и т.д.).

Сообщите пользователю о причине и предложите альтернативные варианты оплаты или повторную попытку.

---

Более подробная информация доступна в официальной документации ЮKassa:
[Создание платежа](https://yookassa.ru/developers/api#create_payment)
| [Быстрый старт](https://yookassa.ru/developers/payment-acceptance/getting-started/quick-start)
| [Процесс платежа](https://yookassa.ru/developers/payment-acceptance/getting-started/payment-process)
| [Способы оплаты](https://yookassa.ru/developers/payment-acceptance/getting-started/payment-methods)
| [Выбор сценария интеграции](https://yookassa.ru/developers/payment-acceptance/getting-started/selecting-integration-scenario)
| [Умный платеж](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/smart-payment)
| [Чеки для самозанятых](https://yookassa.ru/developers/payment-acceptance/receipts/self-employed/basics)
| [Неуспешные платежи](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments)
