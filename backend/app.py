from fastapi import FastAPI, Body
from pydantic import BaseModel
from datetime import datetime, timedelta
import numpy as np

# Dummy model (replace with actual ML model)
def predict_failure_probability(features: np.ndarray) -> float:
    # Example: simple linear combo
    return min(1.0, 0.5 + 0.1 * np.mean(features))

class InfraData(BaseModel):
    id: str
    type: str
    age: int
    lastMaintenance: str  # ISO date string
    usageRate: float
    sensorReadings: list[float]

class PredictionResult(BaseModel):
    infrastructureId: str
    failureProbability: float
    predictedFailureDate: str
    recommendedAction: str
    priority: str

app = FastAPI()

@app.post("/api/predictive", response_model=PredictionResult)
def predict(data: InfraData = Body(...)):
    # Prepare input for model
    days_since_maintenance = (datetime.now() - datetime.fromisoformat(data.lastMaintenance)).days
    features = np.array([data.age, days_since_maintenance, data.usageRate] + data.sensorReadings)
    probability = predict_failure_probability(features)

    # Suggest next maintenance
    days_to_failure = int((1.0 - probability) * 60)
    predicted_failure_date = (datetime.now() + timedelta(days=days_to_failure)).isoformat()
    recommendation = (
        f"Immediate inspection required for {data.type}" if probability > 0.8 else
        "Schedule maintenance within 2 weeks" if probability > 0.6 else
        "Monitor closely, plan maintenance" if probability > 0.4 else
        "Routine monitoring sufficient"
    )
    priority = (
        "critical" if probability > 0.8 else
        "high" if probability > 0.6 else
        "medium" if probability > 0.4 else
        "low"
    )

    return PredictionResult(
        infrastructureId=data.id,
        failureProbability=probability,
        predictedFailureDate=predicted_failure_date,
        recommendedAction=recommendation,
        priority=priority
    )
