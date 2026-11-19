export interface CatalogItem {
  id?: string;
  name: string;
  name_sw?: string;
  price_tzs: number;
  unit?: string;
  category: string;
  category_name_sw: string;
  category_name_en: string;
  safety_note?: string;
  requires_staff_check?: boolean;
}

export interface CatalogPackage {
  id: string;
  name_sw: string;
  name_en: string;
  description: string;
  image?: string;
  items: {
    name: string;
    price_tzs: number;
    safety_note?: string;
  }[];
}

export interface StoreInfo {
  name: string;
  tagline: string;
  languages: string[];
  phone_whatsapp: string;
  phone_display: string;
  payment: {
    mobile_money: string;
    lipa_namba: string;
    account_name: string;
  };
  delivery: string;
  location_note: string;
  rules: string[];
}

export const STORE_INFO: StoreInfo = {
  name: "MODESTA INVESTMENTS",
  tagline: "Modesta kwa kila mahitaji yako",
  languages: ["Kiswahili", "English"],
  phone_whatsapp: "+255759755280",
  phone_display: "+255 759 755 280",
  payment: {
    mobile_money: "Vodacom Lipa Namba (M-Pesa)",
    lipa_namba: "51102080",
    account_name: "MODESTA INVESTMENTS",
  },
  delivery: "Delivery is available across Dar es Salaam (Mbweni, Ubungo & surrounding areas). Exact fee and delivery schedule are confirmed directly by store staff.",
  location_note: "Mbweni & Ubungo, Dar es Salaam, Tanzania",
  rules: [
    "Prices are transcribed from the store price poster and confirmed before dispatch.",
    "Stock availability must be verified by staff before committing to delivery.",
    "Do not invent delivery fees, delivery times, or unverified package totals.",
    "All basket calculations are transparent estimates until staff approval.",
    "Safety check required on Gas refills (brand/valve fit) and Infant Formula.",
    "Never share or request PINs, OTPs, or secret passwords.",
    "Any dispute or custom request is escalated instantly to human staff."
  ]
};

export const PACKAGES: CatalogPackage[] = [
  {
    id: "breakfast",
    name_sw: "Kifurushi cha Alfajiri",
    name_en: "Breakfast Package",
    description: "Daily breakfast essentials, fresh bakery, milk, eggs and spreads",
    image: "/src/assets/images/package_fresh_breakfast_1793311007258.jpg",
    items: [
      { name: "Supa Loaf (sliced)", price_tzs: 3500 },
      { name: "ASAS Milk 500ml", price_tzs: 2000 },
      { name: "ASAS Milk 1 litre", price_tzs: 4500 },
      { name: "Mayai / Eggs, tray of 30", price_tzs: 10000 },
      { name: "Blue Band Original", price_tzs: 12000 },
      { name: "Veo Peanut Butter", price_tzs: 7000 },
      { name: "Beef Viennas, pack of 12", price_tzs: 10000 }
    ]
  },
  {
    id: "daily_cooking",
    name_sw: "Kifurushi cha Jiko na Chakula",
    name_en: "Kitchen & Cooking Package",
    description: "Core household grains, flours, premium cooking oil, and bottled water",
    image: "/src/assets/images/package_cooking_staples_1793311007620.jpg",
    items: [
      { name: "Mchele Safi 5kg", price_tzs: 17500 },
      { name: "Unga wa Mahindi 5kg", price_tzs: 7000 },
      { name: "Unga wa Ngano (Soko) 1kg", price_tzs: 3000 },
      { name: "Mafuta ya Kupikia 5L", price_tzs: 35000 },
      { name: "Maji ya Kunywa 15L", price_tzs: 7000 }
    ]
  },
  {
    id: "night",
    name_sw: "Kifurushi cha Nishati na Gesi",
    name_en: "Energy & Gas Package",
    description: "Certified cooking gas refills, double-burner stoves, and emergency lighting",
    image: "/src/assets/images/package_household_energy_1793311007775.jpg",
    items: [
      { name: "Gas refill (O-Gas/Oryx/Yang) 6kg", price_tzs: 27000, safety_note: "Thibitisha chapa na vali na duka / Verify cylinder brand and valve with staff" },
      { name: "Gas refill (Oryx/O-Gas) 13kg", price_tzs: 45000, safety_note: "Thibitisha chapa na vali na duka / Verify cylinder brand and valve with staff" },
      { name: "Gas refill 29kg", price_tzs: 62000, safety_note: "Thibitisha chapa na vali na duka / Verify cylinder brand and valve with staff" },
      { name: "Double-burner gas stove", price_tzs: 85000 },
      { name: "Rechargeable emergency lantern", price_tzs: 20000 }
    ]
  },
  {
    id: "baby",
    name_sw: "Kifurushi cha Mtoto",
    name_en: "Baby Care Package",
    description: "Pediatric-friendly infant nutrition, Pampers diapers, wipes, and sensitive lotions",
    items: [
      { name: "Maziwa ya mtoto (NAN 1/2/3)", price_tzs: 3500, safety_note: "Thibitisha umri na hatua ya NAN na staff / Confirm stage with staff" },
      { name: "Diapers (Pampers)", price_tzs: 15000 },
      { name: "Baby lotion", price_tzs: 8000 },
      { name: "Baby oil", price_tzs: 12000 },
      { name: "Baby wipes", price_tzs: 3500 }
    ]
  },
  {
    id: "beauty",
    name_sw: "Kifurushi cha Urembo na Mwili",
    name_en: "Beauty & Personal Care",
    description: "Quality fragrances, body care lotions, shampoos, and oral hygiene",
    items: [
      { name: "Perfume (CK One)", price_tzs: 25000 },
      { name: "Body lotion", price_tzs: 17000 },
      { name: "Shampoo", price_tzs: 12000 },
      { name: "Deodorant spray", price_tzs: 6000 },
      { name: "Toothpaste", price_tzs: 6000 },
      { name: "Bar soap (Lux)", price_tzs: 3000 }
    ]
  },
  {
    id: "cleaning",
    name_sw: "Kifurushi cha Usafi na Nyumbani",
    name_en: "Cleaning & Home Hygiene",
    description: "Laundry detergents, bathing soaps, sanitary essentials, and cleaning utilities",
    items: [
      { name: "Laundry soap", price_tzs: 10000 },
      { name: "Pads", price_tzs: 4000 },
      { name: "Bathing soap", price_tzs: 4000 },
      { name: "Plastic bucket", price_tzs: 6000 },
      { name: "Cleaning brush", price_tzs: 1500 }
    ]
  }
];

export const ALL_ITEMS: CatalogItem[] = PACKAGES.flatMap((pkg) =>
  pkg.items.map((item, idx) => ({
    id: `${pkg.id}_${idx}`,
    name: item.name,
    price_tzs: item.price_tzs,
    category: pkg.id,
    category_name_sw: pkg.name_sw,
    category_name_en: pkg.name_en,
    safety_note: item.safety_note,
    requires_staff_check: !!item.safety_note
  }))
);

export function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString("en-US")}`;
}

export function buildWhatsAppOrderLink(order: {
  customerName: string;
  phone: string;
  area: string;
  items: { name: string; quantity: number; unitPrice?: number }[];
  estimatedTotal: number;
  notes?: string;
}): string {
  const lines = [
    `*OMBI LA ODA — MODESTA INVESTMENTS*`,
    `----------------------------------------`,
    `👤 Mteja / Customer: ${order.customerName}`,
    `📞 Simu / Phone: ${order.phone}`,
    `📍 Eneo / Area: ${order.area}`,
    `----------------------------------------`,
    `🛒 BIDHAA ZILIZOOMBWA / REQUESTED ITEMS:`,
    ...order.items.map(
      (item) => `• ${item.quantity}x ${item.name} (${item.unitPrice ? formatTZS(item.unitPrice * item.quantity) : 'Bei itathibitishwa'})`
    ),
    `----------------------------------------`,
    `💰 Kadirio la Bidhaa (Subtotal): ${formatTZS(order.estimatedTotal)}`,
    `⚠️ *Kumbuka:* Hii ni oda ya awali. Gharama ya usafirishaji na upatikanaji wa bidhaa utathibitishwa na duka kabla ya malipo.`,
    order.notes ? `📝 Maelezo / Notes: ${order.notes}` : "",
    `----------------------------------------`,
    `Lipa Namba (Vodacom): 51102080 (MODESTA INVESTMENTS)`
  ].filter(Boolean);

  const encoded = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/255759755280?text=${encoded}`;
}
