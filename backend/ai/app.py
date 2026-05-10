from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_predict import predict_price

app = FastAPI()

# ENABLE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ML API Running"}

@app.get("/predict")
def predict(cropType: str, state: str, expectedPricePerKg: float = None):

    result = predict_price(
        cropType,
        state,
        expectedPricePerKg
    )

    return result