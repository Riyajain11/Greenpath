import sys
import json
import pandas as pd
import os

def predict_price(crop_input, state_input, days_ahead, expected_price_per_kg=None):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_DIR, "data", "clean_mandi_prices.csv")

    df = pd.read_csv(DATA_PATH)

    df["modal_price"] = pd.to_numeric(df["modal_price"], errors="coerce")
    df = df.dropna(subset=["modal_price"])

    crop_input = crop_input.lower().strip()
    state_input = state_input.lower().strip()

    df["crop"] = df["crop"].astype(str).str.lower().str.strip()
    df["state"] = df["state"].astype(str).str.lower().str.strip()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    CROP_ALIASES = {
        "rice": "paddy",
        "paddy": "paddy",
        "wheat": "wheat",
        "tur": "arhar",
        "arhar": "arhar",
        "gram": "gram",
        "chana": "gram",
        "moong": "moong",
        "urad": "urad",
        "maize": "maize",
        "corn": "maize"
    }

    search_crop = CROP_ALIASES.get(crop_input, crop_input)

    filtered = df[
        (df["crop"].str.contains(search_crop, case=False, na=False)) &
        (df["state"].str.contains(state_input, case=False, na=False))
    ]

    if filtered.empty:
        fallback = df[df["crop"].str.contains(search_crop, case=False, na=False)]

        if fallback.empty:
            return {
                "success": False,
                "error": f"No data available for crop='{crop_input}'"
            }

        filtered = fallback

    recent = filtered.sort_values("date").tail(30)

    avg_price = recent["modal_price"].mean()
    last_price = recent["modal_price"].iloc[-1]

    change_percent = round(((last_price - avg_price) / avg_price) * 100, 2)
    predicted_price = round(last_price * (1 + change_percent / 100), 2)

    expected_quintal = expected_price_per_kg * 100 if expected_price_per_kg else None

    price_gap = (
        round(((predicted_price - expected_quintal) / expected_quintal) * 100, 2)
        if expected_quintal else None
    )

    if change_percent > 3:
        suggestion = "HOLD: Prices are rising"
    elif change_percent < -3:
        suggestion = "SELL: Prices are falling"
    else:
        suggestion = "SELL SOON: Market is stable"

    return {
        "success": True,
        "cropMatched": search_crop,
        "predictedMarketPrice": predicted_price,
        "changePercent": change_percent,
        "priceGapPercent": price_gap,
        "suggestion": suggestion
    }


# =========================
# CLI EXECUTION (LOCAL USE)
# =========================
if __name__ == "__main__":

    if len(sys.argv) < 4:
        print(json.dumps({
            "success": False,
            "error": "Usage: crop state daysAhead [expectedPricePerKg]"
        }))
        sys.exit(0)

    crop_input = sys.argv[1]
    state_input = sys.argv[2]
    days_ahead = int(sys.argv[3])
    expected_price_per_kg = float(sys.argv[4]) if len(sys.argv) > 4 else None

    result = predict_price(crop_input, state_input, days_ahead, expected_price_per_kg)

    print(json.dumps(result))