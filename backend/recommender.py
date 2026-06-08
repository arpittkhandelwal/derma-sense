import pandas as pd
import random
import os

# Load Data Once
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

print("Loading Product Database...")
INDIAN_AVAILABLE_BRANDS = [
    'belif', 'Benefit Cosmetics', 'Bobbi Brown', 'Charlotte Tilbury', 'Clarins', 'CLINIQUE',
    'Dermalogica', 'Dior', 'Este Lauder', 'First Aid Beauty', 'FOREO', 'innisfree', 'IT Cosmetics',
    "Kiehl's Since 1851", "L'Occitane", 'LANEIGE', 'MAKE UP FOR EVER', 'Mario Badescu', 'Murad',
    'Origins', "Paula's Choice", 'Shiseido', 'The INKEY List', 'The Ordinary', 'Sulwhasoo', 'Caudalie',
    'Fenty Skin', 'Glow Recipe'
]

try:
    df_products = pd.read_csv(os.path.join(DATA_DIR, 'product_info.csv'))
    df_skincare = df_products[df_products['primary_category'] == 'Skincare'].copy()
    
    # Filter for brands available in India
    df_skincare = df_skincare[df_skincare['brand_name'].isin(INDIAN_AVAILABLE_BRANDS)]
except Exception as e:
    print(f"Failed to load products: {e}")
    df_skincare = pd.DataFrame()

def get_recommendations(skin_type: str, concerns: list, limit: int = 3):
    if df_skincare.empty:
        return []
    
    # Simple logic: search for keywords in highlights or ingredients
    keywords = [skin_type.lower()] + [c.lower() for c in concerns]
    
    # Fill NaN highlights with empty string
    df_skincare['highlights'] = df_skincare['highlights'].fillna('')
    
    # Scoring
    def score_row(row):
        text = str(row['highlights']).lower() + " " + str(row['product_name']).lower()
        return sum([1 for k in keywords if k in text])
    
    # Calculate score and sort
    df_scored = df_skincare.copy()
    df_scored['match_score'] = df_scored.apply(score_row, axis=1)
    
    # Filter only products that matched at least something and have high rating
    df_matched = df_scored[(df_scored['match_score'] > 0) & (df_scored['rating'] >= 4.0)]
    
    if df_matched.empty:
        # Fallback to top-rated general skincare if no strict match
        df_matched = df_skincare[df_skincare['rating'] >= 4.5]
        
    df_sorted = df_matched.sort_values(by=['match_score', 'loves_count'], ascending=False)
    
    top_products = df_sorted.head(limit)
    
    recs = []
    import urllib.parse
    for _, row in top_products.iterrows():
        search_query = urllib.parse.quote_plus(f"{row['brand_name']} {row['product_name']}")
        amazon_url = f"https://www.amazon.in/s?k={search_query}"
        
        recs.append({
            "brand": row['brand_name'],
            "name": row['product_name'],
            "rating": row['rating'],
            "price": row['price_usd'],
            "highlights": row['highlights'],
            "amazon_link": amazon_url
        })
    return recs
