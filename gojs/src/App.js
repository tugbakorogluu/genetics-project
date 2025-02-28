import React, { useState, useEffect } from "react";
import Genogram from "./components/Genogram.js";
import Explain from "./components/Explain.js";
import "./App.css";


// Örnek soy ağacı verisi - API'den veri yüklenene kadar kullanılır
const defaultGenoData = [];

const App = () => {
  const [genoData, setGenoData] = useState(defaultGenoData);
  const [dialogText, setDialogText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Diyalog metin alanı değişikliğini işle
  const handleInputChange = (e) => {
    setDialogText(e.target.value);
  };

  // Promise tabanlı yaklaşım (async/await olmadan)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Gerçek genogram API'sini kullan
    fetch("http://localhost:8000/api/genogram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation: dialogText }),
    })
      .then((response) => {
        console.log("API yanıtı:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Alınan veri:", data);
        if (data.success) {
          console.log("Soy ağacı verisi:", data.genoData);
          setGenoData(data.genoData);
        } else {
          setError(data.error || "Beklenmeyen bir hata oluştu");
          console.error("API Hatası:", data);
        }
      })
      .catch((err) => {
        console.error("Hata detayı:", err);
        setError("Sunucu bağlantısında bir hata oluştu: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <div
        className="input-container"
        style={{ marginBottom: "20px", padding: "20px" }}
      >
        <h2>Soy Ağacı Oluşturma</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="dialogText">Doktor-Hasta Diyaloğu:</label>
            <textarea
              id="dialogText"
              rows="10"
              value={dialogText}
              onChange={handleInputChange}
              placeholder="Doktor ve hasta arasındaki diyaloğu buraya girin..."
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !dialogText.trim()}
            style={{
              padding: "8px 15px",
              backgroundColor: "#4682B4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor:
                isLoading || !dialogText.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "İşleniyor..." : "Soy Ağacı Oluştur"}
          </button>
        </form>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>Hata: {error}</div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        {" "}
        {/* Negatif margin değerini düzelttim */}
        <Explain />
        <Genogram Genogram={genoData} />
      </div>
    </div>
  );
};

export default App;
