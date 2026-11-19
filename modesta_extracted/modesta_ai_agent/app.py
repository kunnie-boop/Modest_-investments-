import json
import os
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Optional LLM support: pip install openai and set OPENAI_API_KEY.
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

ROOT = Path(__file__).parent
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
app = FastAPI(title="Modesta Investments AI Store Assistant", version="1.0.0")

SYSTEM_PROMPT = """
You are Modesta, the customer-service and sales assistant for MODESTA INVESTMENTS,
a Tanzania-based groceries and household-supplies shop.
Speak naturally and politely in Kiswahili or English; match the customer's language.
Help customers discover items, compare prices, choose a package, estimate basket totals,
and prepare an order request for staff.
Use ONLY the supplied store catalog for prices and product facts.
Prices are from a poster and must be confirmed by staff before payment.
Never claim stock availability, delivery coverage/fees/timing, discounts, or a completed
order/payment unless verified by an authorized store system or staff.
The poster advertises delivery and mentions Mbweni/Ubungo; ask for the customer's area
and say staff must confirm coverage, fee, and time.
Payment information shown on the poster: Vodacom Lipa Namba 51102080; account name
MODESTA INVESTMENTS. Ask customers to confirm payment instructions with the store before
sending money. Never request PINs, passwords, or OTPs.
For gas, infant formula, refunds, disputes, complaints, unclear prices, or requests requiring
live inventory, refer the customer to a human.
Store WhatsApp/phone: +255 759 755 280.
Be concise, transparent, helpful, and never invent details.
"""

def catalog_text():
    chunks = [f"STORE: {CATALOG['store']['name']}",
              f"CONTACT: {CATALOG['store']['phone_whatsapp']}",
              f"PAYMENT: {CATALOG['store']['payment']}",
              f"DELIVERY: {CATALOG['store']['delivery']}"]
    for package in CATALOG["packages"]:
        chunks.append(f"\n{package['name_sw']} / {package['name_en']}:")
        for item in package["items"]:
            chunks.append(f"- {item['name']}: TZS {item['price_tzs']:,}")
    chunks.append("\nImportant: prices and stock must be confirmed by store staff.")
    return "\n".join(chunks)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    language: Optional[str] = None
    customer_name: Optional[str] = None

class OrderRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=5, max_length=40)
    area: str = Field(min_length=1, max_length=200)
    items: list[dict] = Field(min_length=1)
    notes: Optional[str] = None

@app.get("/")
def home():
    return {
        "store": CATALOG["store"]["name"],
        "assistant": "Modesta AI Store Assistant",
        "status": "running",
        "endpoints": ["/chat", "/catalog", "/order-request", "/health"]
    }

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/catalog")
def get_catalog():
    return CATALOG

@app.post("/chat")
def chat(req: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        # Useful fallback when no model/API key is configured yet.
        msg = req.message.lower()
        if any(w in msg for w in ["bei", "price", "gharama", "how much", "kiasi gani"]):
            answer = "Ninaweza kukusaidia kuangalia bei kwenye katalogi. Tafadhali taja bidhaa au kifurushi. Bei zinahitaji kuthibitishwa na duka kabla ya malipo. / I can help check catalog prices; please name the item or package. Prices must be confirmed by the store."
        elif any(w in msg for w in ["delivery", "peleka", "usafirishaji", "delivery fee"]):
            answer = "Tunatangaza huduma ya delivery. Tafadhali taja eneo lako; timu ya MODESTA itathibitisha kama tunafika, gharama na muda. Piga/WhatsApp +255 759 755 280."
        elif any(w in msg for w in ["order", "agiza", "kuagiza", "nunua", "buy"]):
            answer = "Karibu MODESTA INVESTMENTS! Tuma jina la bidhaa, idadi, jina lako na eneo lako. Timu yetu itathibitisha stock, jumla na delivery kabla ya malipo. WhatsApp: +255 759 755 280."
        else:
            answer = "Karibu MODESTA INVESTMENTS! / Welcome to MODESTA INVESTMENTS! Naweza kusaidia kuhusu bidhaa, bei za katalogi, vifurushi na kuandaa ombi la oda. Taja unachohitaji au wasiliana nasi WhatsApp +255 759 755 280."
        return {"reply": answer, "mode": "fallback", "note": "Set OPENAI_API_KEY and install openai for AI-generated responses."}

    client = OpenAI(api_key=api_key)
    try:
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            instructions=SYSTEM_PROMPT + "\n\nSTORE CATALOG:\n" + catalog_text(),
            input=req.message
        )
        return {"reply": response.output_text, "mode": "ai"}
    except Exception as exc:
        raise HTTPException(status_code=502, detail="AI provider request failed. Check API key/model configuration.")

@app.post("/order-request")
def create_order_request(order: OrderRequest):
    # This endpoint only prepares a request; it does NOT take payment or confirm stock.
    total = 0
    lines = []
    item_index = {}
    for package in CATALOG["packages"]:
        for item in package["items"]:
            item_index[item["name"].lower()] = item
    for row in order.items:
        name = str(row.get("name", "")).strip()
        quantity = row.get("quantity", 1)
        if not isinstance(quantity, int) or quantity < 1 or quantity > 1000:
            raise HTTPException(status_code=400, detail=f"Invalid quantity for {name}")
        match = item_index.get(name.lower())
        if match:
            subtotal = match["price_tzs"] * quantity
            total += subtotal
            lines.append({"name": match["name"], "quantity": quantity,
                          "unit_price_tzs": match["price_tzs"], "subtotal_tzs": subtotal})
        else:
            lines.append({"name": name, "quantity": quantity,
                          "unit_price_tzs": None, "subtotal_tzs": None,
                          "needs_staff_price_confirmation": True})
    return {
        "status": "REQUEST_PREPARED_NOT_CONFIRMED",
        "customer": {"name": order.customer_name, "phone": order.phone, "area": order.area},
        "items": lines,
        "known_items_estimated_subtotal_tzs": total,
        "delivery_fee_tzs": None,
        "message": "This is not a confirmed order. Staff must verify prices, stock, delivery fee and final total.",
        "staff_contact": CATALOG["store"]["phone_whatsapp"],
        "notes": order.notes
    }
