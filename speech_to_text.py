import whisper
import sounddevice as sd
from scipy.io.wavfile import write
from transformers import pipeline
import stanza


# Initialize Stanza for Turkish
stanza.download('tr')
nlp_stanza = stanza.Pipeline('tr')


fs = 44100  # Sample rate
seconds = 20

print("Kayıt Başlıyor...")
recorded_audio = sd.rec(int(seconds * fs), samplerate=fs, channels=1)
sd.wait()  # Wait until recording is finished


write('/Users/tugbakoroglu/PycharmProjects/whisper-main/output.wav', fs, recorded_audio)
print("Kayıt tamamlandı, Whisper ile işleniyor...")

# Transcribe audio with Whisper
model = whisper.load_model("large")
result = model.transcribe("/Users/tugbakoroglu/PycharmProjects/whisper-main/output.wav", language="tr")
transcribed_text = result["text"]
print("Transcribed Text:", transcribed_text)

# Analyze transcribed text with Stanza
doc = nlp_stanza(transcribed_text)

# List for sentences containing "hasta" or "sağlıklı"
relevant_sentences = []

# Extract sentences containing "hasta" (sick) or "sağlıklı" (healthy)
for sentence in doc.sentences:
    sentence_text = sentence.text
    if "hasta" in sentence_text or "hasta değil" in sentence_text or "sağlıklı değil" in sentence_text or "sihhatli" in sentence_text or "sihhatli değil" in sentence_text or "sağlıklı" in sentence_text:
        relevant_sentences.append(sentence_text.strip())

print("\nAI ya propmt olacak kısım")
for rel in relevant_sentences:
    print("-", rel)

# Extract family relationships and health statuses using Cosmos LLM
cosmos_model = pipeline("ner", model="cosmos-llm")

# Apply Cosmos LLM to the transcribed text
entities = cosmos_model(transcribed_text)

# Organize extracted information
family_tree = {}
for entity in entities:
    if entity['entity'] in ['Person', 'Disease']:
        # Organize by relationship and health status
        family_tree[entity['word']] = entity['entity']

print("\nExtracted Family and Health Information:", family_tree)