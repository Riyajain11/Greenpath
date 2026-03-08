from fastapi import FastAPI
from ai_predict import predict_price

app = FastAPI()

@app.get("/predict")
def predict(cropType: str, state: str, expectedPricePerKg: float = None):
    
    result = predict_price(cropType, state, expectedPricePerKg)

    return result