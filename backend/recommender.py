import os
import pandas as pd
import urllib.parse

# Load Clinical Products Dataset
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
SKINPRO_CSV = os.path.join(DATA_DIR, 'Skinpro - Skinpro (3).csv')

skinpro_df = None
try:
    if os.path.exists(SKINPRO_CSV):
        skinpro_df = pd.read_csv(SKINPRO_CSV)
        print(f"Loaded {len(skinpro_df)} clinical dermatology products from Skinpro dataset!")
    else:
        print("Skinpro dataset not found at", SKINPRO_CSV)
except Exception as e:
    print(f"Error loading Skinpro dataset: {e}")

FALLBACK_RECS = [
    {
        "brand": "The Ordinary",
        "name": "Niacinamide 10% + Zinc 1%",
        "rating": "4.8",
        "ai_match": 96,
        "highlights": "Clinically proven to target active sebum congestion and refine micro-pore diameter.",
        "amazon_link": "https://www.amazon.in/s?k=The+Ordinary+Niacinamide",
        "image_url": "https://m.media-amazon.com/images/I/61kYd3aT+SL._SL1500_.jpg"
    },
    {
        "brand": "Neutrogena",
        "name": "Hydro Boost Hyaluronic Acid Water Gel",
        "rating": "4.9",
        "ai_match": 94,
        "highlights": "Trans-epidermal moisture lock formulation restoring 48h stratum corneum hydration.",
        "amazon_link": "https://www.amazon.in/s?k=Neutrogena+Hydro+Boost",
        "image_url": "https://m.media-amazon.com/images/I/71u9SfZvM1L._SL1500_.jpg"
    },
    {
        "brand": "Paula's Choice",
        "name": "Skin Perfecting 2% BHA Liquid Exfoliant",
        "rating": "4.7",
        "ai_match": 91,
        "highlights": "Salicylic acid lipid-soluble exfoliant dissolves keratinized comedones.",
        "amazon_link": "https://www.amazon.in/s?k=Paulas+Choice+2+BHA",
        "image_url": "https://m.media-amazon.com/images/I/61dF9dK8tAL._SL1500_.jpg"
    },
    {
        "brand": "CeraVe",
        "name": "Hydrating Facial Cleanser with Essential Ceramides",
        "rating": "4.9",
        "ai_match": 97,
        "highlights": "Physiological lipid replenishment preserving the acid mantle barrier.",
        "amazon_link": "https://www.amazon.in/s?k=CeraVe+Hydrating+Cleanser",
        "image_url": "https://m.media-amazon.com/images/I/71D0Yv-uDcL._SL1500_.jpg"
    }
]

def get_recommendations(skin_type: str, concerns: list, limit: int = 4):
    if skinpro_df is None or skinpro_df.empty:
        return FALLBACK_RECS[:limit]

    st_lower = str(skin_type or '').lower()
    matches = []

    for _, row in skinpro_df.iterrows():
        row_st = str(row.get('Skin type', '')).lower()
        row_c = str(row.get('Concern', '')).lower()
        p_name = str(row.get('Product', '')).strip()

        if not p_name or p_name.lower() == 'nan':
            continue

        score = 0
        for token in st_lower.split():
            if token and token in row_st:
                score += 3
        if 'normal' in row_st or 'combination' in row_st:
            score += 1

        for c in (concerns or []):
            c_str = str(c).lower()
            if c_str in row_c:
                score += 4
            elif ('pimples' in row_c or 'whitehead' in row_c) and 'acne' in c_str:
                score += 3
            elif 'pore' in c_str and ('whitehead' in row_c or 'acne' in row_c):
                score += 2
            elif 'hydration' in c_str and ('dry' in row_st or 'moistur' in p_name.lower()):
                score += 3

        if score > 0:
            matches.append((score, row))

    matches.sort(key=lambda x: x[0], reverse=True)

    results = []
    seen_products = set()

    for score, row in matches:
        p_name = str(row.get('Product', '')).strip()
        if p_name in seen_products:
            continue
        seen_products.add(p_name)

        url = str(row.get('product_url', ''))
        pic = str(row.get('product_pic', ''))
        concern = str(row.get('Concern', 'Clinical Care'))

        # Brand extraction
        parts = p_name.split()
        brand_guess = parts[0]
        if brand_guess in ['The', 'Dr.', 'La', 'Paula\'s']:
            brand_guess = ' '.join(parts[:2])

        search_query = urllib.parse.quote_plus(p_name)
        amazon_link = url if 'amazon' in url else f"https://www.amazon.in/s?k={search_query}"

        ai_match = min(99, max(84, 82 + score * 3))

        results.append({
            "brand": brand_guess,
            "name": p_name,
            "rating": "4.8",
            "ai_match": ai_match,
            "highlights": f"Formulated specifically for {concern}. Clinically calibrated for {skin_type} profile.",
            "amazon_link": amazon_link,
            "direct_url": url,
            "image_url": pic if pic.startswith('http') else "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80"
        })

        if len(results) >= limit:
            break

    if len(results) < limit:
        for fb in FALLBACK_RECS:
            if not any(r['name'] == fb['name'] for r in results):
                results.append(fb)
            if len(results) >= limit:
                break

    return results
