import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    PORT = int(os.getenv("PORT", "5001"))
    ENV = os.getenv("ENV", "development")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")