import streamlit as st
from vosk import Model, KaldiRecognizer
import soundfile as sf
import json
import tempfile
import os

# Sidebar: Model selection
st.sidebar.title("Vosk STT Tester")
language = st.sidebar.selectbox("Choose language model:", ["English", "Hindi", "Kannada"])

# Map language to model folder path
MODEL_PATHS = {
    "English": "models/vosk-model-small-en-us-0.15",
    "Hindi": "models/vosk-model-small-hi-0.22",
    "Kannada": "models/vosk-model-small-kn-0.4"
}

st.title("🗣️ Vosk Speech-to-Text Tester")
st.write("Upload a WAV file (Mono, 16kHz) or record your voice.")

# Upload section
uploaded_file = st.file_uploader("Upload WAV file", type=["wav"])

# Process the uploaded file
if uploaded_file is not None:
    # Save to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(uploaded_file.getvalue())
        tmp_wav_path = tmp_file.name

    # Load Vosk model
    st.info(f"Loading {language} model...")
    model_path = MODEL_PATHS[language]
    if not os.path.exists(model_path):
        st.error(f"Model not found at {model_path}. Please download and extract it.")
    else:
        model = Model(model_path)

        # Open audio file
        data, samplerate = sf.read(tmp_wav_path)
        if len(data.shape) > 1:
            st.warning("Stereo audio detected, taking first channel only.")
            data = data[:, 0]

        # Set up recognizer
        rec = KaldiRecognizer(model, samplerate)

        st.info("Transcribing...")
        # Convert audio to bytes for Vosk
        audio_bytes = data.tobytes()
        rec.AcceptWaveform(audio_bytes)
        result = json.loads(rec.FinalResult())

        st.subheader("📝 Transcription Result")
        st.json(result)

# Instructions if no file
else:
    st.warning("Please upload a WAV file to test.")
    st.markdown("**Tip:** Use a tool like Audacity to record mono WAV at 16kHz.")
