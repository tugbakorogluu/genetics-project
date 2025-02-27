import google.generativeai as genai
import os

# API anahtarını ayarlayın
os.environ['GOOGLE_API_KEY'] = 'AIzaSyDTO2JGg-TfLYndDNmDCaQz3VPv6S5bYBA'  # API anahtarınızı buraya yazın

# Modeli yapılandırın
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])



# Gemini Pro modeline erişim
# Güncel modeli kullanın
model = genai.GenerativeModel(model_name='gemini-1.5-pro')  

# veya
# model = genai.GenerativeModel(model_name='gemini-1.5-flash')

# Test için örnek bir konuşma metni
conversation = """
[Buraya konuşma metnini yazın]
"""

# Prompt hazırlama
prompt = """
Diyalog:

Doktor: Hoşgeldiniz Ayşe Hanım. Aile sağlık geçmişinizi konuşmak istiyorum. Öncelikle anne tarafından başlayalım.

Hasta: Teşekkürler doktor bey. Annem Fatma, 55 yaşında ve sağ. Babam Ali ise 3 yıl önce akciğer kanserinden vefat etti. Ben 35 yaşındayım.

Doktor: Anne tarafından büyükanne ve büyükbabanız?

Hasta: Anneannem Zehra, meme kanseri nedeniyle 65 yaşında vefat etti. Dedem Ahmet ise 75 yaşında lenfoma nedeniyle vefat etti. Annemin bir kız kardeşi var, Aysel teyzem. O da 50 yaşında ve geçen yıl meme kanseri tedavisi gördü.

Doktor: Baba tarafındaki aile geçmişi nasıl?

Hasta: Babaannem Hatice, şu an 80 yaşında ve sağlıklı. Babamın babası Mehmet dedem ise 70 yaşında kalp krizi nedeniyle vefat etti. Babamın bir erkek kardeşi var, Mustafa amcam. O da akciğer kanseri tedavisi görüyor, 58 yaşında.

Doktor: Sizin kardeşleriniz var mı?

Hasta: Evet, bir ablam ve ikiz erkek kardeşlerim var. Ablam Zeynep 38 yaşında ve geçen yıl yumurtalık kanseri teşhisi kondu. İkiz kardeşlerim Murat ve Mesut 32 yaşında ve sağlıklılar.

Doktor: Evli misiniz? Çocuklarınız var mı?

Hasta: Evet, eşim Ahmet 37 yaşında. İki çocuğumuz var. Kızımız Elif 10 yaşında, sağlıklı. Maalesef ikinci hamileliğimde bebeğimizi düşük nedeniyle kaybettik.

Doktor: Ablalarınız veya kardeşlerinizin çocukları var mı?

Hasta: Ablam Zeynep'in eşi Mehmet, 40 yaşında. Bir kızları var, Sude 12 yaşında. İkiz kardeşlerimden Murat'ın eşi Merve, henüz çocukları yok. Mesut ise bekâr.

Doktor: Teyzelerinizin veya amcalarınızın çocukları?

Hasta: Aysel teyzemin eşi Hasan, 52 yaşında. Onların bir oğlu var, Ali 25 yaşında. Mustafa amcamın eşi Fatma yenge 55 yaşında, onların da kızı Aslı 28 yaşında ve sağlıklı.


Göreviniz, yukarıdaki doktor-hasta diyaloğunu detaylı bir şekilde analiz ederek bir genetik soy ağacı veri yapısı (genoData) oluşturmaktır.oluşturacağın yapı soyağacı yapısına uysun lütfen.

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
     
     
     
      ÖRNEK ÇIKTI FORMATI:

genoData = [
    {"key": 0, "n": "Hasta", "s": "F", "m": -1, "f": -2, "vir": 1, "a": []},
    
    # Ebeveynler
    {"key": -1, "n": "Anne", "s": "F", "m": -21, "f": -22, "ux": -2, "a": ["C"]},
    {"key": -2, "n": "Baba", "s": "M", "m": -23, "f": -24, "ux": -1, "a": ["S"]},
    
    # Büyükanne/Büyükbabalar
    {"key": -21, "n": "Anne tarafı büyükanne", "s": "F", "vir": -22, "a": ["C"]},
    {"key": -22, "n": "Anne tarafı büyükbaba", "s": "M", "ux": -21, "a": []},
    {"key": -23, "n": "Baba tarafı büyükanne", "s": "F", "vir": -24, "a": []},
    {"key": -24, "n": "Baba tarafı büyükbaba", "s": "M", "ux": -23, "a": ["S"]},
]

Lütfen verilen diyaloğu analiz edin ve TÜM nesilleri (özellikle üst nesilleri) doğru şekilde bağlayarak genetik soy ağacı verisini oluşturun.
"""

# Yanıt al ve yazdır
response = model.generate_content(prompt)
print(response.text)