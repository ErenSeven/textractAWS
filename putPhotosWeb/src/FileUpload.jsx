import { useState } from "react";

const UPLOAD_API_URL = "your-api-endpoint"; // Lambda fonksiyonunuzun URL'sini buraya yazın

const FileUploadS3 = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleUpload = () => {
    if (!file) {
      alert("Lütfen bir dosya seçin.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1]; // "data:image/jpeg;base64,..."

      try {
        // 1. Adım: Lambda fonksiyonuna istek at
        const response = await fetch(UPLOAD_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileContentBase64: base64Data,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setUploadMessage("Dosya başarıyla yüklendi!");
        } else {
          setUploadMessage(data.message || "Yükleme başarısız.");
        }
      } catch (error) {
        console.error("Yükleme hatası:", error);
        setUploadMessage("Bir hata oluştu.");
      }
    };

    reader.readAsDataURL(file); // base64'e çevirme işlemi başlatılır
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>Dosya Yükle (S3)</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Yükle</button>

      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default FileUploadS3;
