# MODESTA INVESTMENTS — AI Store Assistant

This starter project provides:
- Bilingual Kiswahili/English customer support
- Product and price catalog based on the supplied poster
- Package discovery and basket-total estimates
- An order-request endpoint (does not claim to confirm an order)
- Clear safeguards for stock, delivery, gas products, infant formula, and payments
- Optional OpenAI-powered responses

## 1. Run on a laptop

Install Python 3.10 or newer, then in this folder run:

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
```

Set your API key securely if you want AI-generated replies:
- Windows PowerShell: `$env:OPENAI_API_KEY="YOUR_KEY"`
- macOS/Linux: `export OPENAI_API_KEY="YOUR_KEY"`

Then run:
```bash
uvicorn app:app --reload
```

Open `http://127.0.0.1:8000/docs` to test the API, and `/catalog` to inspect the catalog.
Without an API key, `/chat` uses a simple fallback response. The fallback is not a full AI model.

## 2. Important before going live

- The prices were transcribed from your poster. Check them against your current price list; some poster text is small/unclear.
- Connect a live stock/inventory source before the assistant promises availability.
- Confirm delivery areas, fees, opening hours, and actual package totals.
- Confirm payment instructions with the store. Never collect PINs, passwords, or OTPs.
- Add staff notifications and secure order storage before using this for real orders.
- Add authentication/rate limiting and HTTPS before exposing the API publicly.
- The order endpoint prepares a request only; it does not take payments or create a confirmed order.

## 3. WhatsApp connection

This is the AI backend, not a finished WhatsApp bot by itself. To connect WhatsApp:
1. Create/configure a WhatsApp Business Platform app in Meta.
2. Set up a public HTTPS webhook endpoint and verify token.
3. On incoming WhatsApp messages, call `POST /chat` with the message text.
4. Send the returned `reply` back using the official WhatsApp Cloud API.
5. Store consent, conversation/order records securely and route difficult cases to a human.

Never put Meta access tokens or the OpenAI key in browser/mobile code. Use server-side environment variables.

## 4. Useful endpoints

- `GET /` — service info
- `GET /health` — health check
- `GET /catalog` — current embedded product catalog
- `POST /chat` — customer message to assistant
- `POST /order-request` — prepare an unconfirmed order request

Example `/chat` body:
```json
{"message":"Ninaomba bei ya mchele kilo 5 na mafuta lita 5"}
```

Example `/order-request` body:
```json
{
  "customer_name":"Asha",
  "phone":"+2557XXXXXXXX",
  "area":"Ubungo",
  "items":[
    {"name":"Mchele Safi 5kg","quantity":1},
    {"name":"Mafuta ya Kupikia 5L","quantity":1}
  ],
  "notes":"Tafadhali thibitisha delivery"
}
```
