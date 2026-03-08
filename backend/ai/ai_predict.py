# import sys
# import json
# import pandas as pd


# # -------------------------
# # Read CLI arguments
# # -------------------------
# crop = sys.argv[1]
# state = sys.argv[2]
# days_ahead = int(sys.argv[3])
# expected_price_per_kg = float(sys.argv[4]) if len(sys.argv) > 4 else None

# # -------------------------
# # Load dataset
# # -------------------------
# df = pd.read_csv("data/clean_mandi_prices.csv")

# # Normalize
# df.columns = df.columns.str.lower().str.strip()
# df["crop"] = df["crop"].str.lower().str.strip()
# df["state"] = df["state"].str.lower().str.strip()
# df["date"] = pd.to_datetime(df["date"], errors="coerce")

# df = df.dropna(subset=["date", "modal_price"])

# crop = crop.lower().strip()
# state = state.lower().strip()

# print("Searching crop:", crop)
# print("Searching state:", state)
# # -------------------------
# # Filter (robust)
# # -------------------------
# filtered = df[
#     df["crop"].str.lower().str.contains(crop.lower(), na=False) &
#     df["state"].str.lower().str.contains(state.lower(), na=False)
# ]

# if filtered.empty:
#     print(json.dumps({
#         "success": False,
#         "error": "No data available for this crop/state"
#     }))
#     sys.exit(0)

# # -------------------------
# # AI Logic
# # -------------------------
# recent = filtered.sort_values("date").tail(30)

# avg_price = recent["modal_price"].mean()
# last_price = recent["modal_price"].iloc[-1]

# if avg_price == 0:
#     change_percent = 0
# else:
#     change_percent = round(((last_price - avg_price) / avg_price) * 100, 2)

# predicted_price = round(last_price * (1 + change_percent / 100), 2)

# expected_quintal = expected_price_per_kg * 100 if expected_price_per_kg else None
# price_gap = (
#     round(((predicted_price - expected_quintal) / expected_quintal) * 100, 2)
#     if expected_quintal else None
# )

# # -------------------------
# # Suggestion
# # -------------------------
# if change_percent > 3:
#     suggestion = "HOLD: Prices are rising"
# elif change_percent < -3:
#     suggestion = "SELL: Prices are falling"
# else:
#     suggestion = "SELL SOON: Market is stable"

# # -------------------------
# # Output
# # -------------------------
# print(json.dumps({
#     "success": True,
#     "predictedMarketPrice": predicted_price,
#     "changePercent": change_percent,
#     "priceGapPercent": price_gap,
#     "suggestion": suggestion
# }))

import sys
import json
import pandas as pd
import os

# =========================
# READ CLI ARGUMENTS
# =========================
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

# =========================
# LOAD DATASET (FIXED PATH)
# =========================
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_DIR, "data", "clean_mandi_prices.csv")

    df = pd.read_csv(DATA_PATH)

    df["modal_price"] = pd.to_numeric(df["modal_price"], errors="coerce")
    df = df.dropna(subset=["modal_price"])

except Exception as e:
    print(json.dumps({
        "success": False,
        "error": "Dataset not found or unreadable"
    }))
    sys.exit(0)

# =========================
# NORMALIZE INPUT
# =========================
crop_input = crop_input.lower().strip()
state_input = state_input.lower().strip()

df["crop"] = df["crop"].astype(str).str.lower().str.strip()
df["state"] = df["state"].astype(str).str.lower().str.strip()
df["date"] = pd.to_datetime(df["date"], errors="coerce")

# =========================
# SMART CROP MAPPING
# =========================
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

# =========================
# FILTER DATA
# =========================
filtered = df[
    (df["crop"].str.contains(search_crop, case=False, na=False)) &
    (df["state"].str.contains(state_input, case=False, na=False))
]

# fallback if state not found
if filtered.empty:

    fallback = df[df["crop"].str.contains(search_crop, case=False, na=False)]

    if fallback.empty:
        print(json.dumps({
            "success": False,
            "error": f"No data available for crop='{crop_input}'"
        }))
        sys.exit(0)

    filtered = fallback

# =========================
# AI PRICE LOGIC
# =========================
recent = filtered.sort_values("date").tail(30)

avg_price = recent["modal_price"].mean()
last_price = recent["modal_price"].iloc[-1]

change_percent = round(((last_price - avg_price) / avg_price) * 100, 2)
predicted_price = round(last_price * (1 + change_percent / 100), 2)

# =========================
# USER EXPECTATION
# =========================
expected_quintal = expected_price_per_kg * 100 if expected_price_per_kg else None

price_gap = (
    round(((predicted_price - expected_quintal) / expected_quintal) * 100, 2)
    if expected_quintal else None
)

# =========================
# SUGGESTION ENGINE
# =========================
if change_percent > 3:
    suggestion = "HOLD: Prices are rising"
elif change_percent < -3:
    suggestion = "SELL: Prices are falling"
else:
    suggestion = "SELL SOON: Market is stable"

# =========================
# OUTPUT
# =========================
print(json.dumps({
    "success": True,
    "cropMatched": search_crop,
    "predictedMarketPrice": predicted_price,
    "changePercent": change_percent,
    "priceGapPercent": price_gap,
    "suggestion": suggestion
}))
