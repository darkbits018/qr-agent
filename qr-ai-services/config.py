import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    PORT = int(os.getenv("AI_AGENT_PORT"))
    ENV = os.getenv("ENV", "development")
    BACKEND_URL = os.getenv("BACKEND_URL")
    # RASA_NLU_MODEL_PATH = "models/latest.tar.gz"  # Or use specific model name