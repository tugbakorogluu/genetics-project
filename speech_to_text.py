#import whisper
#import sounddevice as sd
#cfrom scipy.io.wavfile import write
import google.generativeai as genai

try:
    print("Program başlatılıyor...")
    
    # Initialize Gemini
    GOOGLE_API_KEY = ""  # Replace with your actual API key
    print("Gemini API anahtarı yapılandırılıyor...")
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    print("Gemini modeli başarıyla yapılandırıldı")

    # Recording settings
    fs = 44100  # Sample rate
    seconds = 20

    def record_and_transcribe():
        print("Kayıt Başlıyor...")
        recorded_audio = sd.rec(int(seconds * fs), samplerate=fs, channels=1)
        sd.wait()
        
        write('/Users/tugbakoroglu/PycharmProjects/whisper-main/output.wav', fs, recorded_audio)
        print("Kayıt tamamlandı, Whisper ile işleniyor...")
        
        # Transcribe audio with Whisper
        whisper_model = whisper.load_model("large")
        result = whisper_model.transcribe("/Users/tugbakoroglu/PycharmProjects/whisper-main/output.wav", language="tr")
        return result["text"]

    def analyze_with_gemini(text):
        print("Gemini analizi başlıyor...")
        prompt = """
        Bu doktor-hasta görüşmesinden soy ağacı oluşturmak için gerekli olan tüm bilgileri çıkar:
        - Konuşmada geçen aile bireylerini ve ilişkilerini belirle
        - Bu kişilerin sağlık durumlarını tespit et
        - Soy ağacı ile ilgili tüm bilgileri çıkar.
       
        Metin:
        """ + text
        
        print("Gemini'ye gönderilen metin:", text)
        response = model.generate_content(prompt)
        print("Gemini'den yanıt alındı")
        return response.text

    def main(test_mode=True, test_text=None):
        print(f"Main fonksiyonu başlatıldı - Test modu: {test_mode}")
        
        if test_mode and test_text:
            print("Test modu - Verilen metin kullanılıyor...")
            transcribed_text = test_text
        else:
            print("Normal mod - Ses kaydı başlatılıyor...")
            transcribed_text = record_and_transcribe()
        
        print("\nTranscribed/Input Text:", transcribed_text)
        
        # Analyze with Gemini
        family_info = analyze_with_gemini(transcribed_text)
        print("\nSoy ağacı için çıkarılan bilgiler:")
        print(family_info)

    if _name_ == "_main_":
        print("Program main bloğuna girdi")
        # Test için örnek metin
        test_text = """
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

Hasta: Ablam Zeynep'in eşi Mehmet, 40 yaşında. Bir kızları var, Sude 12 yaşında. İkiz kardeşlerimden Murat'ın eşi Merve akciğer kanseri ve bir tane erkek çocukları var, ismi ahmet. Mesut ise bekâr.

Doktor: Teyzelerinizin veya amcalarınızın çocukları?

Hasta: Aysel teyzemin eşi Hasan, 52 yaşında. Onların bir oğlu var, Ali 25 yaşında. Mustafa amcamın eşi Fatma yenge 55 yaşında, onların da kızı Aslı 28 yaşında ve sağlıklı.

        """
        
        print("Test metni hazırlandı, main fonksiyonu çağrılıyor...")
        # Test modunda çalıştır
        main(test_mode=True, test_text=test_text)
        
        print("Program tamamlandı")

except Exception as e:
    print(f"Bir hata oluştu: {str(e)}")