from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import json
import re
from flask_cors import CORS
import logging

# Loglama ayarları
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
# CORS ayarlarını düzgün şekilde yapılandır
CORS(app, resources={r"/api/*": {"origins": "*"}})

# API anahtarını ayarla
# Güvenlik için bunu .env dosyasından veya ortam değişkeninden almanız tavsiye edilir
API_KEY = 'kendi API keyinizi girin'

try:
    genai.configure(api_key=API_KEY)
    logger.info("Gemini API yapılandırması başarılı")
except Exception as e:
    logger.error(f"Gemini API yapılandırma hatası: {str(e)}")

# Ana sayfa endpoint'i
@app.route('/')
def home():
    return "Genogram API sunucusu çalışıyor! Kullanmak için /api/genogram endpoint'ine POST isteği gönderin."

# Test endpoint'i - API'yi test etmek için
@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({
        'status': 'success',
        'message': 'API çalışıyor!'
    })

# Test veri endpoint'i - Sabit veri döndürür
@app.route('/api/test-genogram', methods=['POST'])
def test_genogram():
    logger.info("Test genogram isteği alındı")
    test_data = [
        {"key": 0, "n": "Ayşe ve sümeyye", "s": "F", "m": -1, "f": -2, "vir": 1, "a": []},
        {"key": 1, "n": "Ahmet", "s": "M", "ux": 0, "a": []},
        {"key": -1, "n": "Fatma", "s": "F", "m": -21, "f": -22, "ux": -2, "a": []},
        {"key": -2, "n": "Ali", "s": "M", "m": -23, "f": -24, "ux": -1, "a": ["H", "S"]},
        {"key": -21, "n": "Zehra", "s": "F", "vir": -22, "a": ["C", "S"]},
        {"key": -22, "n": "Ahmet", "s": "M", "ux": -21, "a": ["M", "S"]},
        {"key": -23, "n": "Hatice", "s": "F", "vir": -24, "a": []},
        {"key": -24, "n": "Mehmet", "s": "M", "ux": -23, "a": ["S"]}
    ]
    return jsonify({
        'success': True,
        'genoData': test_data
    })

# Ana API endpoint'i
@app.route('/api/genogram', methods=['POST'])
def generate_genogram():
    try:
        logger.info("Genogram API isteği alındı")
        
        # Gelen veriyi kontrol et
        if not request.is_json:
            logger.warning("Gelen istek JSON formatında değil")
            return jsonify({
                'success': False,
                'error': 'İstek JSON formatında olmalıdır'
            }), 400
            
        data = request.json
        if not data or 'conversation' not in data:
            logger.warning("İstekte 'conversation' alanı bulunamadı")
            return jsonify({
                'success': False,
                'error': 'İstekte "conversation" alanı bulunamadı'
            }), 400
            
        conversation_text = data.get('conversation', '')
        logger.info(f"Alınan diyalog uzunluğu: {len(conversation_text)} karakter")
        
        # Prompt hazırlama
        prompt = f"""
        Diyalog:

        {conversation_text}

        Göreviniz, yukarıdaki doktor-hasta diyaloğunu detaylı bir şekilde analiz ederek bir genetik soy ağacı veri yapısı (genoData) oluşturmaktır. Oluşturacağın yapı soyağacı yapısına uysun lütfen.

        TALİMATLAR:

        1. VERİ YAPISI FORMATI:
        Her aile üyesi için bir dictionary oluşturun:
        Zorunlu Alanlar:
        - "key": Benzersiz ID numara
        - "n": İsim
        - "s": Cinsiyet ("M", "F" veya "N")
        - "a": Sağlık durumu kodları (boş bile olsa mutlaka ekleyin)
        - "m": Anne ID
        - "f": Baba ID
        - "ux": Erkek için eş ID
        - "vir": Kadın için eş ID
        - "t": İkiz durumu ("d")

        2. KEY (ID) ATAMA VE AİLE İLİŞKİLERİ:
        Merkez Kişi ve Nesli:
        - Merkez kişi (hasta): key: 0
        - Merkez kişinin eşi: 1
        - Merkez kişinin kardeşleri: 2, 3, 4...
        - Merkez kişinin çocukları: 5, 6, 7...

        Ebeveynler Nesli:
        - Merkez kişinin annesi: key: -1
        - Merkez kişinin babası: key: -2
        - Annenin kardeşleri: -3, -4...
        - Babanın kardeşleri: -5, -6...

        Büyükanne/Büyükbaba Nesli:
        - Anne tarafı büyükanne: key: -21
        - Anne tarafı büyükbaba: key: -22
        - Baba tarafı büyükanne: key: -23
        - Baba tarafı büyükbaba: key: -24

        ÖNEMLİ: Her üst nesil üyesi için mutlaka:
        1. Kendi key'i olmalı
        2. Eşler arasında ux/vir bağlantısı kurulmalı
        3. Çocuklarının m/f değerleri ebeveynlerin key'lerine bağlanmalı

        3. SAĞLIK DURUMLARI KODLAMA:
        ("a" array içinde): 
        "C": Meme kanseri (kırmızı) 
        "H": Akciğer kanseri (kahverengi)
        "I": Yumurtalık kanseri (mor) 
        "M": Lenfoma/Lösemi (artı işareti) 
        "S": Vefat (üzeri çizili)  

        4. ÖZEL DURUMLAR:
        - İkizler: Her birine ayrı key atayın ve "t": "d" ekleyin 
        - Düşük: "s": "N" kullanın 
        - Vefat: "a" array'ine "S" ekleyin 
        - Boş array: [] şeklinde belirtin  

        5. ÖNEMLİ KURALLAR:
        - None, null, undefined değerleri KULLANMAYIN 
        - Bilinmeyen bilgiler için ilgili alanı tamamen atlayın
        - Her kişi için en az key, n, s ve a alanları olmalı
        - Eş bilgisi varsa ux/vir karşılıklı olmalı
        - Eksik bilgileri varsaymayın, sadece diyalogda belirtilenleri kullanın.

        SADECE OLUŞTURDUĞUNUZ genoData ARRAY'İNİ JSON FORMATINDA DÖNDÜRÜN. BAŞKA AÇIKLAMA VEYA YORUM EKLEMEYİN. ARRAY'İN KENDİSİNİ DÖNDÜRÜN, "genoData =" KISMI OLMASIN.
        """

        try:
            # API yanıtını almayı dene
            logger.info("Gemini API'ye istek gönderiliyor...")
            model = genai.GenerativeModel(model_name='gemini-1.5-pro')  
            response = model.generate_content(prompt)
            
            # Yanıtı temizle ve JSON'a dönüştür 
            response_text = response.text
            logger.info(f"API yanıtı alındı, uzunluk: {len(response_text)} karakter")
            
            # JSON array'i bul - "[" ile başlayıp "]" ile biten kısmı al
            json_match = re.search(r'\[\s*{.*}\s*\]', response_text, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                logger.info(f"JSON eşleşmesi bulundu, uzunluk: {len(json_str)} karakter")
                
                try:
                    genoData = json.loads(json_str)
                    logger.info(f"JSON başarıyla ayrıştırıldı, {len(genoData)} öğe bulundu")
                    
                    # Yanıtı kontrol et - gerekli alanlar var mı?
                    for i, item in enumerate(genoData):
                        if 'key' not in item or 'n' not in item or 's' not in item or 'a' not in item:
                            logger.warning(f"Öğe {i}'de zorunlu alanlar eksik: {item}")
                            return jsonify({
                                'success': False, 
                                'error': 'Yanıt doğru format içermiyor - eksik zorunlu alanlar',
                                'problematicItem': item,
                                'rawResponse': response_text
                            })
                    
                    # Tüm kontrolleri geçerse başarılı yanıt döndür
                    logger.info("Başarılı yanıt döndürülüyor")
                    return jsonify({
                        'success': True,
                        'genoData': genoData
                    })
                except json.JSONDecodeError as je:
                    logger.error(f"JSON ayrıştırma hatası: {str(je)}")
                    return jsonify({
                        'success': False,
                        'error': 'JSON ayrıştırma hatası',
                        'details': str(je),
                        'rawResponse': response_text
                    })
            else:
                logger.warning("JSON array bulunamadı")
                # Test verisiyle yanıt döndür
                logger.info("JSON array bulunamadığı için test verisi döndürülüyor")
                test_data = [
                    {"key": 0, "n": "Ayşe ve veli", "s": "F", "m": -1, "f": -2, "vir": 1, "a": []},
                    {"key": 1, "n": "Ahmet", "s": "M", "ux": 0, "a": []},
                    {"key": -1, "n": "Fatma", "s": "F", "m": -21, "f": -22, "ux": -2, "a": []},
                    {"key": -2, "n": "Ali", "s": "M", "m": -23, "f": -24, "ux": -1, "a": ["H", "S"]}
                ]
                return jsonify({
                    'success': True,
                    'genoData': test_data,
                    'warning': 'API yanıtında JSON array bulunamadı, test verisi döndürülüyor',
                    'rawResponse': response_text
                })
            
        except Exception as api_err:
            logger.error(f"API çağrısı hatası: {str(api_err)}")
            # API hatası durumunda test verisiyle yanıt döndür
            test_data = [
                {"key": 0, "n": "Ayşe tuğba", "s": "F", "m": -1, "f": -2, "vir": 1, "a": []},
                {"key": 1, "n": "Ahmet", "s": "M", "ux": 0, "a": []},
                {"key": -1, "n": "Fatma", "s": "F", "m": -21, "f": -22, "ux": -2, "a": []},
                {"key": -2, "n": "Ali", "s": "M", "m": -23, "f": -24, "ux": -1, "a": ["H", "S"]}
            ]
            return jsonify({
                'success': True,
                'genoData': test_data,
                'warning': f"API hatası: {str(api_err)}, test verisi döndürülüyor"
            })
            
    except Exception as e:
        logger.error(f"Genel hata: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"İstek işlenirken hata: {str(e)}"
        }), 500

if __name__ == '__main__':
    logger.info("Sunucu başlatılıyor - port: 8000")
    app.run(debug=True, port=8000, host='0.0.0.0')