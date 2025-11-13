from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import joblib
import spacy
nlp = spacy.load("en_core_web_sm")

import os
import sys

from .utils import clean_text, get_email_embeddings

## Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
MODEL_PATH = os.path.join(BASE_DIR, "..", "FinalModel", "kmeans_model.joblib")

## Global Variables
app = FastAPI(title="KMeans Clustering Model API", version="1.0")
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

## Load Model
model = joblib.load(MODEL_PATH)

## Email Data Model
class EmailData(BaseModel):
    sender: str
    receiver: str
    subject: str
    body: str
    url: str

## Home Endpoint
@app.get("/")
def read_root():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

## Cluster Predict Endpoint
@app.post("/predict")
def predict_email_cluster(email: EmailData):
    email_df = pd.DataFrame([email.dict()])
    
    clean_text(email_df)
    X, _ = get_email_embeddings(email_df, nlp)

    cluster = model.predict(X)   
    return {"cluster": int(cluster[0])}