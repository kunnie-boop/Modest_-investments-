import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { STORE_INFO, PACKAGES, ALL_ITEMS, buildWhatsAppOrderLink, formatTZS } from './src/data/catalog.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 12000,
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

function buildCatalogSystemPrompt(): string {
  const chunks: string[] = [
    `# Role`,
    `You are Modesta, the helpful bilingual customer-service and sales assistant for MODESTA INVESTMENTS in Tanzania.`,
    `Speak naturally and politely in Kiswahili or English; match the customer's language.`,
    ``,
    `# Store Details`,
    `- Store Name: ${STORE_INFO.name}`,
    `- Tagline: ${STORE_INFO.tagline}`,
    `- Phone / WhatsApp: ${STORE_INFO.phone_whatsapp} (${STORE_INFO.phone_display})`,
    `- Payment: ${STORE_INFO.payment.mobile_money} Lipa Namba: ${STORE_INFO.payment.lipa_namba} (Account Name: ${STORE_INFO.payment.account_name})`,
    `- Delivery: Advertised for Dar es Salaam (Mbweni, Ubungo & surrounding areas). Coverage, fee, and timing must be confirmed by staff.`,
    ``,
    `# Product Catalog & Prices (TZS)`,
  ];

  for (const pkg of PACKAGES) {
    chunks.push(`\n[${pkg.name_sw} / ${pkg.name_en}]`);
    for (const item of pkg.items) {
      const safety = item.safety_note ? ` (Safety note: ${item.safety_note})` : '';
      chunks.push(`- ${item.name}: TZS ${item.price_tzs.toLocaleString()}${safety}`);
    }
  }

  chunks.push(
    ``,
    `# Critical Rules & Safeguards`,
    `1. Never invent prices, discounts, stock availability, opening hours, delivery fees, or delivery times.`,
    `2. Do not say an order is confirmed or that payment has been taken. The assistant only prepares order requests.`,
    `3. Always make clear that calculated basket totals are estimates and exclude unconfirmed delivery fees.`,
    `4. Tell customers to verify payment instructions with the store (+255 759 755 280) before sending money.`,
    `5. Never request or store customer PINs, passwords, or OTPs.`,
    `6. For gas cylinder refills (brand compatibility), infant formula (NAN stages), payment disputes, and delivery fees, refer the customer to human staff.`,
    `7. Be warm, concise, and helpful. Suggest relevant items or packages to assist their shopping.`
  );

  return chunks.join('\n');
}

const SYSTEM_INSTRUCTION = buildCatalogSystemPrompt();

// Comprehensive and intelligent fallback response generator
function generateIntelligentFallbackReply(userMsg: string, customerName?: string): string {
  const msg = userMsg.toLowerCase().trim();
  const greeting = customerName ? `Habari ${customerName}!` : 'Habari!';

  // Check matching individual items
  const matchedItems: typeof ALL_ITEMS[0][] = [];
  for (const itm of ALL_ITEMS) {
    const itemLower = itm.name.toLowerCase();
    const keywords = itemLower.split(/[\s,()/-]+/).filter((k) => k.length > 3 && !['pack', 'tray', 'refill', 'original', 'litre'].includes(k));
    if (keywords.some((kw) => msg.includes(kw))) {
      matchedItems.push(itm);
    }
  }

  // If specific items were found in the inquiry
  if (matchedItems.length > 0) {
    const itemDetails = matchedItems
      .slice(0, 4)
      .map((i) => `• ${i.name}: ${formatTZS(i.price_tzs)}${i.safety_note ? ` (${i.safety_note})` : ''}`)
      .join('\n');
    return `${greeting} Karibu MODESTA INVESTMENTS. Bei ya bidhaa ulizotaja kwenye katalogi yetu:\n${itemDetails}\n\nBei zote ni makadirio yaliyochukuliwa kwenye bango rasmi na zinathibitishwa na stoo kabla ya malipo. Je, ungependa nikusaidie kuziweka kwenye ombi la oda?`;
  }

  // Delivery inquiries
  if (msg.includes('delivery') || msg.includes('usafirishaji') || msg.includes('peleka') || msg.includes('muda') || msg.includes('ubungo') || msg.includes('mbweni') || msg.includes('eneo')) {
    return `${greeting} MODESTA INVESTMENTS inatangaza huduma ya delivery kwa wateja wetu wa Mbweni, Ubungo na maeneo mengine ya Dar es Salaam. Gharama ya usafirishaji na muda wa kufika huthibitishwa moja kwa moja na timu ya duka kulingana na eneo lako. Unaweza kuweka oda yako kwenye kikapu au kuwasiliana nasi WhatsApp: ${STORE_INFO.phone_display}.`;
  }

  // Gas inquiries
  if (msg.includes('gesi') || msg.includes('gas') || msg.includes('oryx') || msg.includes('o-gas') || msg.includes('yang') || msg.includes('jiko')) {
    return `Kuhusu Kifurushi cha Nishati na Gesi:\n• Gas refill 6kg (O-Gas/Oryx/Yang): TZS 27,000\n• Gas refill 13kg (Oryx/O-Gas): TZS 45,000\n• Gas refill 29kg: TZS 62,000\n• Double-burner gas stove: TZS 85,000\n• Emergency lantern: TZS 20,000\n\n⚠️ Tahadhari ya Usalama: Tafadhali thibitisha aina ya mtungi wako na saizi ya vali na wafanyakazi wetu kabla ya kuletewa. WhatsApp: ${STORE_INFO.phone_display}.`;
  }

  // Baby care inquiries
  if (msg.includes('mtoto') || msg.includes('baby') || msg.includes('nan') || msg.includes('diaper') || msg.includes('pampers') || msg.includes('wipes')) {
    return `Kuhusu Kifurushi cha Mtoto:\n• Maziwa ya mtoto NAN: TZS 35,000\n• Diapers Pampers: TZS 15,000\n• Baby lotion: TZS 8,000\n• Baby oil: TZS 12,000\n• Baby wipes: TZS 3,500\n\n⚠️ Angalizo: Maziwa ya NAN yanahitaji uthibitisho wa hatua ya umri wa mtoto (Stage 1, 2, au 3) na wafanyakazi wetu kabla ya kufunga mzigo.`;
  }

  // Breakfast inquiries
  if (msg.includes('breakfast') || msg.includes('alfajiri') || msg.includes('mkate') || msg.includes('loaf') || msg.includes('maziwa') || msg.includes('asas') || msg.includes('mayai') || msg.includes('eggs')) {
    return `Kifurushi cha Alfajiri (Breakfast):\n• Supa Loaf (sliced): TZS 3,500\n• ASAS Milk 500ml: TZS 2,000 (1 Litre: TZS 4,500)\n• Mayai tray ya 30: TZS 10,000\n• Blue Band Original: TZS 12,000\n• Veo Peanut Butter: TZS 7,000\n• Beef Viennas (pack 12): TZS 10,000\n\nJumla ya kifurushi chote ni TZS 49,000 (kadirio). Unaweza kukiweka chote kwenye kikapu kwa mbofyo mmoja!`;
  }

  // Cooking essentials inquiries
  if (msg.includes('jiko') || msg.includes('cooking') || msg.includes('mchele') || msg.includes('unga') || msg.includes('mafuta') || msg.includes('water') || msg.includes('maji')) {
    return `Kifurushi cha Jiko na Chakula:\n• Mchele Safi 5kg: TZS 17,500\n• Unga wa Mahindi 5kg: TZS 7,000\n• Unga wa Ngano (Soko) 1kg: TZS 3,000\n• Mafuta ya Kupikia 5L: TZS 35,000\n• Maji ya Kunywa 15L: TZS 7,000\n\nJumla ya kifurushi hiki ni TZS 69,500. Bei zinathibitishwa na duka kabla ya malipo.`;
  }

  // Payment inquiries
  if (msg.includes('lipa') || msg.includes('malipo') || msg.includes('namba') || msg.includes('pay') || msg.includes('m-pesa') || msg.includes('vodacom')) {
    return `Taarifa Rasmi za Malipo ya MODESTA INVESTMENTS:\n• Njia: ${STORE_INFO.payment.mobile_money}\n• Lipa Namba: ${STORE_INFO.payment.lipa_namba}\n• Jina la Akaunti: ${STORE_INFO.payment.account_name}\n\n⚠️ Muhimu: Tafadhali thibitisha kwanza upatikanaji wa bidhaa na oda yako na duka kabla ya kutuma fedha. Hatutawahi kukuuliza PIN au OTP yako.`;
  }

  // Order assistance
  if (msg.includes('oda') || msg.includes('order') || msg.includes('agiza') || msg.includes('nunua') || msg.includes('buy')) {
    return `Karibu kuagiza! Unaweza kuchagua bidhaa unazotaka kwenye orodha ya katalogi au kwenye vifurushi vyetu 6. Kisha fungua Kikapu, weka jina lako, namba ya simu na eneo (k.m Ubungo au Mbweni), na utume moja kwa moja WhatsApp: ${STORE_INFO.phone_display}.`;
  }

  // Default warm bilingual welcome
  return `Habari na Karibu MODESTA INVESTMENTS! — "Modesta kwa kila mahitaji yako".\n\nNinaweza kukusaidia:\n1. Kuangalia bei na maelezo ya bidhaa yoyote kwenye katalogi\n2. Kukuonyesha vifurushi vyetu 6 (Alfajiri, Jiko, Nishati/Gesi, Mtoto, Urembo, Usafi)\n3. Kukokotoa makadirio ya kikapu chako na kuandaa ombi la oda kwenda WhatsApp: ${STORE_INFO.phone_display}\n\nTafadhali niambie, ungependa kupata nini leo?`;
}

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    store: STORE_INFO.name,
    has_gemini: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// 2. Catalog endpoint
app.get('/api/catalog', (_req: Request, res: Response) => {
  res.json({
    store: STORE_INFO,
    packages: PACKAGES,
    items: ALL_ITEMS,
  });
});

// 3. Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, customer_name, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // If Gemini is available, attempt generateContent with timeout guard
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      let promptContents = message;
      if (Array.isArray(history) && history.length > 0) {
        const formattedHistory = history.slice(-5).map((h: { sender: string; text: string }) => 
          `${h.sender === 'user' ? 'Customer' : 'Modesta'}: ${h.text}`
        ).join('\n');
        promptContents = `${formattedHistory}\nCustomer: ${message}\nModesta:`;
      }

      // 6-second timeout race to ensure lightning-fast UI response
      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), 6500)
      );

      const response: any = await Promise.race([apiPromise, timeoutPromise]);
      if (response && response.text) {
        return res.json({
          reply: response.text,
          mode: 'ai',
          status: 'success',
          suggested_items: detectSuggestedItems(message + ' ' + response.text),
        });
      }
    } catch (err: any) {
      console.warn('Gemini request deferred to smart fallback:', err?.message || err);
    }
  }

  // Fast, accurate, deterministic Swahili & English assistant fallback
  const fallbackText = generateIntelligentFallbackReply(message, customer_name);
  return res.json({
    reply: fallbackText,
    mode: 'smart_agent',
    status: 'success',
    suggested_items: detectSuggestedItems(message + ' ' + fallbackText),
  });
});

// Detect catalog items mentioned in user or assistant text
function detectSuggestedItems(text: string): { name: string; price_tzs: number }[] {
  const lower = text.toLowerCase();
  const suggestions: { name: string; price_tzs: number }[] = [];
  for (const item of ALL_ITEMS) {
    const itemName = item.name.toLowerCase();
    const keywords = itemName.split(/[\s,()/-]+/).filter((k) => k.length > 3 && !['pack', 'tray', 'refill', 'original', 'litre'].includes(k));
    const matched = keywords.some((kw) => lower.includes(kw));
    if (matched && !suggestions.some((s) => s.name === item.name)) {
      suggestions.push({ name: item.name, price_tzs: item.price_tzs });
      if (suggestions.length >= 4) break;
    }
  }
  return suggestions;
}

// 4. Order request endpoint
app.post('/api/order-request', (req: Request, res: Response) => {
  const { customer_name, phone, area, items, notes } = req.body;

  if (!customer_name || !phone || !area || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'Missing required order fields: customer_name, phone, area, and at least one item.',
    });
  }

  let estimatedSubtotal = 0;
  const processedItems: {
    name: string;
    quantity: number;
    unit_price_tzs: number | null;
    subtotal_tzs: number | null;
    needs_staff_confirmation?: boolean;
    safety_note?: string;
  }[] = [];

  const catalogLookup = new Map<string, typeof ALL_ITEMS[0]>();
  for (const itm of ALL_ITEMS) {
    catalogLookup.set(itm.name.toLowerCase(), itm);
  }

  for (const row of items) {
    const name = String(row.name || '').trim();
    const qty = parseInt(row.quantity, 10) || 1;
    const match = catalogLookup.get(name.toLowerCase());

    if (match) {
      const lineTotal = match.price_tzs * qty;
      estimatedSubtotal += lineTotal;
      processedItems.push({
        name: match.name,
        quantity: qty,
        unit_price_tzs: match.price_tzs,
        subtotal_tzs: lineTotal,
        safety_note: match.safety_note,
      });
    } else {
      processedItems.push({
        name,
        quantity: qty,
        unit_price_tzs: null,
        subtotal_tzs: null,
        needs_staff_confirmation: true,
      });
    }
  }

  const whatsappUrl = buildWhatsAppOrderLink({
    customerName: customer_name,
    phone,
    area,
    items: processedItems.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unit_price_tzs || undefined,
    })),
    estimatedTotal: estimatedSubtotal,
    notes,
  });

  return res.json({
    status: 'REQUEST_PREPARED_NOT_CONFIRMED',
    customer: {
      name: customer_name,
      phone,
      area,
    },
    items: processedItems,
    known_items_estimated_subtotal_tzs: estimatedSubtotal,
    delivery_fee_tzs: null,
    delivery_note: 'Gharama ya delivery itathibitishwa na staff kulingana na eneo lako.',
    staff_contact: STORE_INFO.phone_whatsapp,
    lipa_namba: STORE_INFO.payment.lipa_namba,
    account_name: STORE_INFO.payment.account_name,
    whatsapp_url: whatsappUrl,
    message: 'Ombi lako la oda limeandaliwa kikamilifu. Hii sio oda iliyothibitishwa; wasiliana na duka kupitia WhatsApp kuthibitisha upatikanaji wa bidhaa na gharama ya delivery kabla ya kulipa.',
    notes,
  });
});

// Dev / Prod Vite handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Modesta AI Agent Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
