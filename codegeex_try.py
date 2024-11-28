import os
import google.generativeai as genai

# API anahtarınızı çevresel değişken olarak alıyoruz
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("Please set the GOOGLE_API_KEY environment variable")

# API anahtarını yapılandırıyoruz
genai.configure(api_key=api_key)

# Modeli başlatıyoruz
model = genai.GenerativeModel("gemini-1.5-flash")

# Çok satırlı metni tanımlıyoruz
story_description = """
Buraya metin gelecek deneme123
"""

# Modeli kullanarak içeriği oluşturuyoruz
response = model.generate_content(story_description)

# Yanıtı yazdırıyoruz
print(response.text)
