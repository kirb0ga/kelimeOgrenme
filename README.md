# Kelime Öğrenme Uygulaması

Bu proje, kullanıcıların İngilizce kelime öğrenmelerine yardımcı olan bir uygulamadır. Kullanıcılar kelimeleri öğrenirken, öğrendikleri kelimeleri takip edebilir ve öğrenme başarılarını analiz edebilirler. 

## Kurulum

1. Bu repository'yi klonlayın:
    ```sh
    git clone <repository_link>
    cd kelimeOgrenme
    ```

2. Gerekli paketleri yükleyin:
    ```sh
    npm install
    cd client
    npm install
    ```

3. Veritabanı bağlantı ayarlarını yapın (`server/config/db.js` dosyasında).

4. Uygulamayı başlatın:
    ```sh
    npm run dev
    ```

## Kullanım

- **Kelime Ekleme**: Yeni kelimeler ekleyebilirsiniz.
- **Quiz**: Günlük quiz yaparak kelimeleri öğrenebilirsiniz.
- **Ayarlar**: Günlük quizde kaç kelime sorulacağını belirleyebilirsiniz.
- **Raporlar**: Öğrenme raporunuzu görüntüleyebilirsiniz.

## Kullanılan Teknolojiler

Backend: Node.js ve Express
Frontend: React
Veritabanı: PostgreSQL
Authentication: JWT (JSON Web Tokens)

## Lisans
Bu proje 2023/2024 eğitim dönemi Yazılım Yapımı dersinin dönem projesi için Muhammed Selahattin KIRBOĞA tarafından oluşturulmuştur.
