import pandas as pd

# Load CSV
df = pd.read_csv("data/raw_mandi_prices.csv")

# Normalize column names
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
    .str.replace(".", "")
    .str.replace("(", "")
    .str.replace(")", "")
)

print("📌 Columns found:")
print(df.columns.tolist())

# ---- auto-detect important columns ----
def find_col(possible_names):
    for col in df.columns:
        for name in possible_names:
            if name in col:
                return col
    return None

date_col  = find_col(["date", "arrival"])
state_col = find_col(["state"])
crop_col  = find_col(["commodity", "crop"])
price_col = find_col(["modal", "price"])

if not all([date_col, state_col, crop_col, price_col]):
    raise Exception(
        f"❌ Required columns not found\n"
        f"date={date_col}, state={state_col}, crop={crop_col}, price={price_col}"
    )

# Rename to standard names
df = df.rename(columns={
    date_col: "date",
    state_col: "state",
    crop_col: "crop",
    price_col: "modal_price"
})

# Keep only required columns
df = df[["date", "state", "crop", "modal_price"]]

# Clean data
df = df.dropna()
df["modal_price"] = pd.to_numeric(df["modal_price"], errors="coerce")
df["date"] = pd.to_datetime(df["date"], errors="coerce")
df = df.dropna()

# Save cleaned file
df.to_csv("data/clean_mandi_prices.csv", index=False)

print("✅ Preprocessing complete")
print(df.head())
