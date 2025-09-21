from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile, os, uuid
import librosa
import numpy as np
import google.generativeai as genai
import whisper
from gtts import gTTS
import soundfile as sf
import warnings

# Suppress PyTorch storage deprecation warnings
warnings.filterwarnings("ignore", message="TypedStorage is deprecated")

# Flask app with static folder for serving audio
app = Flask(__name__, static_folder="static")
CORS(app, origins=["https://mannsafar-youthmentalwellness.onrender.com"])
# Gemini API key setup
gemini_api_key = "AIzaSyBtOjFWLdNqm3PrmJFSvSuKVcTiwc6Oaho"
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not set!")

genai.configure(api_key=gemini_api_key)

# Load Whisper model once
whisper_model = whisper.load_model("base")

# Simple emotion analysis
def analyze_emotion(audio_path):
    """
    Analyzes the emotion from an audio file based on acoustic features.
    
    Args:
        audio_path (str): The path to the audio file.
    
    Returns:
        str: A string representing the detected emotion.
    """
    try:
        y, sr = librosa.load(audio_path, sr=None)

        # Basic Feature Extraction
        energy = np.sum(y**2) / len(y)
        pitch = librosa.yin(y=y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        
        # Calculate mean pitch and remove NaN values
        mean_pitch = np.nanmean(pitch) if np.any(np.isfinite(pitch)) else 0
        
        # Simple Rules-based Emotion Classification
        emotion = "calm"  # Default emotion

        if energy > 0.1:  # A higher energy level could indicate excitement or anger
            if mean_pitch > 150: # A higher pitch could indicate excitement or tension
                emotion = "energetic"
            else:
                emotion = "tense"
        elif energy < 0.05: # A lower energy level might indicate sadness or calmness
            if mean_pitch < 120 and mean_pitch > 0: # A lower pitch could indicate calmness or sadness
                emotion = "calm"
            else:
                emotion = "sad"
        else:
            emotion = "neutral"
            
        return emotion

    except Exception as e:
        print(f"Error in emotion analysis: {e}")
        return "neutral"




# Main API endpoint
@app.route("/analyze", methods=["POST"])
def analyze():
    user_text = None
    emotion = "neutral"

    if request.is_json:
        # Handle text input
        data = request.get_json()
        user_text = data.get("text")
        if not user_text:
            return jsonify({"error": "No text provided in JSON"}), 400

    elif "file" in request.files:
        # Handle audio upload (expecting WAV!)
        file = request.files["file"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            file.save(tmp.name)
            wav_path = tmp.name

        try:
            user_text = whisper_model.transcribe(wav_path)["text"]
            emotion = analyze_emotion(wav_path)
        finally:
            if os.path.exists(wav_path):
                os.remove(wav_path)

    else:
        return jsonify({"error": "Invalid input. Provide file or JSON with 'text'."}), 400

    # Gemini response
    prompt = f"""
    The user said: "{user_text}".
    Detected emotion: {emotion}.
    Respond briefly, empathetically, and supportively.
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        reply = response.text.strip() if response.text else "I'm here for you."
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Convert reply to speech
    os.makedirs(app.static_folder, exist_ok=True)
    audio_filename = f"{uuid.uuid4()}.mp3"
    audio_path_out = os.path.join(app.static_folder, audio_filename)

    tts = gTTS(reply)
    tts.save(audio_path_out)

    return jsonify({
        "transcript": user_text,
        "response": reply,
        "audio_url": f"/static/{audio_filename}",
        "emotion": emotion   # ✅ added
    })






@app.route('/api/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "Text is required."}), 400

    try:
        # ⬇️ Update the model name here ⬇️
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""Analyze the sentiment of the following text and categorize it as a single emotion 
        from this list: Happy, Sad, Angry, Stressed, Depressed, Carefree, Emotional, or Neutral. 
        Provide only the emotion word. 
        Text: "{text}" """

        response = model.generate_content(prompt)
        emotion = response.text.strip()

        return jsonify({"emotion": emotion}), 200
    except Exception as e:
        print("Gemini API error:", e)
        return jsonify({"error": "Failed to analyze emotion."}), 500






if __name__ == "__main__":
    app.run(port=5000, debug=True)
