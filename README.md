# Telsiz — Kanal Ağı

Gerçek zamanlı, push-to-talk tarzı telsiz web uygulaması. 10 sabit kanal + şahsi (birebir) konuşma.

## Nasıl çalışıyor
- Ses altyapısı: **LiveKit Cloud** (WebRTC SFU, ücretsiz tier)
- Token üretimi: **Netlify Function** (`netlify/functions/token.js`) — API secret'ı sadece burada, sunucu tarafında kalır
- Arayüz: tek `index.html` dosyası

## Kurulum adımları

### 1) LiveKit Cloud hesabı aç
1. https://cloud.livekit.io adresine git, ücretsiz hesap oluştur.
2. Yeni bir proje oluştur.
3. Proje ayarlarından şunları not al:
   - **WebSocket URL** (örn. `wss://senin-projen.livekit.cloud`)
   - **API Key**
   - **API Secret**

### 2) index.html içinde URL'yi ayarla
`index.html` dosyasında şu satırı bul:
```js
const LIVEKIT_URL = "wss://YOUR-PROJECT.livekit.cloud";
```
Kendi LiveKit WebSocket adresinle değiştir.

### 3) Netlify'a deploy et
1. Bu klasörü bir GitHub reposuna yükle (ya da doğrudan Netlify'a sürükle-bırak yapabilirsin, ama Functions için Git bağlantısı daha sağlıklı).
2. Netlify'da "Add new site" → repoyu bağla.
3. **Site settings → Environment variables** kısmına ekle:
   - `LIVEKIT_API_KEY` = LiveKit'ten aldığın API Key
   - `LIVEKIT_API_SECRET` = LiveKit'ten aldığın API Secret
4. Deploy et. Netlify otomatik olarak `package.json`'daki `livekit-server-sdk` paketini kurup fonksiyonu derleyecek.

### 4) Test et
Siteyi aç, bir rumuz gir, bir kanala tıkla, PTT butonunu basılı tut ve konuş. İki farklı cihaz/sekmeden aynı kanala girip test edebilirsin.

## Notlar / sınırlar
- Şahsi arama, "lobi" adlı sessiz bir odaya herkesin arka planda bağlı kalmasıyla çalışıyor (çevrimiçi listesi ve davetler buradan geçiyor). Uygulamayı kapatan/sekmeyi kapatan kullanıcı bu listeden düşer.
- LiveKit'in ücretsiz tier'ı aylık belirli dakika/bant genişliği sınırına sahiptir — kullanıcı sayısı arttıkça ücretli plana geçmen gerekebilir.
- Kanal sayısını artırmak istersen `index.html` içindeki `CHANNEL_COUNT` değerini değiştirmen yeterli.
