import os
import google.generativeai as genai

# API anahtarınızı buraya doğrudan yazabilirsiniz (GÜVENLİ OLMADIĞI İÇİN ÖNERİLMEZ)
# API anahtarını bir değişken olarak tanımlayabilirsiniz.
# Ancak güvenlik için çevresel değişken kullanmanız önerilir.
api_key = "AIzaSyB0exwU5sT2vHPC1YbLKbgZUkVW1ZxlW6g"  

# API anahtarı yoksa hata ver
if not api_key:
    raise ValueError("Lütfen GOOGLE_API_KEY değişkenini ayarlayın.")

# API anahtarını yapılandır
genai.configure(api_key=api_key)

# Modeli başlat
model = genai.GenerativeModel("gemini-1.5-flash")

# Aile soy ağacı için JSON verisini üretmek için istemi tanımla
story_description = """
TALİMATLAR (Güçlendirilmiş):
VERİ YAPISI FORMATI: Her aile üyesi için bir dictionary oluşturulacak. Bu dictionary'de şunlar olacak:
İlk olarak şunu unutma herhangi eksik ya da verilmeyen bir bilgi varsa null, none gibi değerler atama onun yerine [] kullan.

Zorunlu Alanlar:
"key": Benzersiz ID numarası (Her kişi için benzersiz bir ID kullanılacak).
"n": İsim (Kişinin adı).
"s": Cinsiyet (Kadın için "F", Erkek için "M", ve belirsiz durumlar için "N").
"a": Sağlık durumu kodları. Bu array, belirtilen sağlık durumlarını içerebilir. (Boş bile olsa mutlaka eklenmeli).
"m": Anne ID'si.
"f": Baba ID'si.
"ux": Erkek için eş ID'si (Eğer kişi evli ise).
"vir": Kadın için eş ID'si (Eğer kişi evli ise).
"t": İkiz durumu ("d" ikizler için).
KEY (ID) ATAMA VE AİLE İLİŞKİLERİ:

Merkez Kişi ve Nesli:
Merkez kişi (hasta) "key": 0
Merkez kişinin eşi "key": 1
Merkez kişinin kardeşleri "key": 2, 3, 4...
Merkez kişinin çocukları "key": 5, 6, 7...
Ebeveynler Nesli:
Merkez kişinin annesi "key": -1
Merkez kişinin babası "key": -2
Annenin kardeşleri "key": -3, -4...
Babanın kardeşleri "key": -5, -6...
Büyükanne/Büyükbaba Nesli:
Anne tarafı büyükanne "key": -21
Anne tarafı büyükbaba "key": -22
Baba tarafı büyükanne "key": -23
Baba tarafı büyükbaba "key": -24
SAĞLIK DURUMLARI KODLAMA:

"C": Meme kanseri (kırmızı).
"H": Akciğer kanseri (kahverengi).
"I": Yumurtalık kanseri (mor).
"M": Lenfoma/Lösemi (artı işareti).
"S": Vefat (üzeri çizili).
ÖZEL DURUMLAR:

İkizler: Her birine ayrı "key" atayın ve "t": "d" ekleyin.
Düşük: "s": "N" kullanın.
Vefat: "a" array'ine "S" ekleyin.
Boş Array: Sağlık durumu veya diğer bilgiler bilinmiyorsa boş array kullanın ([]).
ÖNEMLİ KURALLAR:

None, null, undefined değerleri kullanılmamalıdır!
Bilinmeyen bilgiler için boş array ([]) veya tamamen eksik bırakılmalıdır.
Her kişi için en az key, n, s, ve a alanları olmalıdır.
Eş bilgisi varsa, ux/vir karşılıklı olmalıdır.
Eksik bilgileri varsaymayın, sadece diyalogda belirtilenleri kullanın.
Ekstra Notlar:
Bu soy ağacı yapısının bir genetik analiz veya hastalıkları izleyen bir sistemde kullanılacağını varsayarsak, kişi ve aile üyeleri arasındaki genetik ilişkiler doğru şekilde yapılandırılmalıdır.
Sağlık Durumları kişinin tüm sağlık geçmişini belirlemek için büyük önem taşır, dolayısıyla bu bilgilere dikkat edilmelidir.

Örnek bir soy ağacı verisi şu şekilde olabilir:
genoData = [
    {"key": 0, "n": "Hasta", "s": "F", "m": -1, "f": -2, "vir": 1, "a": ["C"]},
    
    # Ebeveynler
    {"key": -1, "n": "Anne", "s": "F", "m": -21, "f": -22, "ux": -2, "a": []},
    {"key": -2, "n": "Baba", "s": "M", "m": -23, "f": -24, "ux": -1, "a": ["M"]},
    
    # Büyükanne/Büyükbabalar
    {"key": -21, "n": "Anne tarafı büyükanne", "s": "F", "vir": -22, "a": ["H"]},
    {"key": -22, "n": "Anne tarafı büyükbaba", "s": "M", "ux": -21, "a": []},
    {"key": -23, "n": "Baba tarafı büyükanne", "s": "F", "vir": -24, "a": []},
    {"key": -24, "n": "Baba tarafı büyükbaba", "s": "M", "ux": -23, "a": ["S"]},
    
    # Kardeşler
    {"key": 2, "n": "Kardeş 1", "s": "M", "m": -1, "f": -2, "a": []},
    {"key": 3, "n": "Kardeş 2", "s": "F", "m": -1, "f": -2, "a": ["I"]},
    
    # Çocuklar
    {"key": 5, "n": "Çocuk 1", "s": "M", "m": 0, "f": 1, "a": []},
    {"key": 6, "n": "Çocuk 2", "s": "F", "m": 0, "f": 1, "a": []}
]
Buradaki örnekte, sağlık durumu "a" array'inde belirtilmiş, ikizler ve vefat durumları da doğru şekilde işlenmiştir. Hiçbir şekilde None, null, ya da undefined değerleri kullanılmamıştır ve eksik bilgilerde boş array ([]) kullanılmıştır.
**Soy Ağacı için Bilgiler:**

Soy ağacı için çıkarılan bilgiler:
**Soy Ağacı Bilgileri:**

**Anne Tarafı:**

 Fatma (anne, 55 yaşında, sağ)
 Ali (baba, 3 yıl önce akciğer kanserinden vefat etti)
 Ayşe (hasta, 35 yaşında)

 Zehra (anneanne, meme kanseri nedeniyle 65 yaşında vefat etti)
 Ahmet (dede, lenfoma nedeniyle 75 yaşında vefat etti)
 Aysel (teyze, 50 yaşında, meme kanseri tedavisi gördü)

**Baba Tarafı:**

 Hatice (babaanne, 80 yaşında, sağlıklı)
 Mehmet (dede, 70 yaşında kalp krizi nedeniyle vefat etti)
 Ali (baba, 3 yıl önce akciğer kanserinden vefat etti)
 Mustafa (amca, 58 yaşında, akciğer kanseri tedavisi görüyor)

**Hastanın Çekirdek Ailesi:**

 Ahmet (eş, 37 yaşında)
 Elif (kız, 10 yaşında, sağlıklı)

**Hastanın Kardeşleri ve Onların Aileleri:**

Zeynep (abla, 38 yaşında, yumurtalık kanseri teşhisi kondu)
     Mehmet (eşi, 40 yaşında)
     Sude (kızı, 12 yaşında)
 Murat (ikiz kardeş, 32 yaşında, sağlıklı)
     Merve (eşi, akciğer kanseri, bir erkek çocukları var, ismi Ahmet)
 Mesut (ikiz kardeş, 32 yaşında, bekâr)

**Teyzelerin ve Amcaların Çocukları:**

 Ali (Aysel teyzenin oğlu, 25 yaşında)
 Aslı (Mustafa amcanın kızı, 28 yaşında, sağlıklı)

**Önemli Sağlık Durumları:**

Ali (baba): akciğer kanseri (vefat etti)
 Zehra (anneanne): meme kanseri (vefat etti)
 Ahmet (dede): lenfoma (vefat etti)
 Mehmet (dede): kalp krizi (vefat etti)
 Zeynep (abla): yumurtalık kanseri
 Aysel (teyze): meme kanseri* 
 Mustafa (amca): akciğer kanseri
 Merve (Murat'ın eşi): akciğer kanseri
Ensure that the output is a single, cohesive JSON object with all individuals and relationships included. Do not leave any comment-style placeholders like "4 children to be added here" — instead, provide concrete entries for each child, using default or "unknown" values where applicable.

"""

# Modeli kullanarak içeriği oluştur
response = model.generate_content(story_description)

# Yanıtı yazdır
print(response.text)

#export GOOGLE_API_KEY="AIzaSyB0exwU5sT2vHPC1YbLKbgZUkVW1ZxlW6g"
#python codegeex_try.py