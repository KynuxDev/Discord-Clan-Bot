<h1 align="center">Discord Clan Tag Rol Botu</h1>

<p align="center">
  <img src="https://img.shields.io/badge/node.js-v18+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/discord.js-v14-blue.svg" alt="Discord.js Version">
  <img src="https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg" alt="License">
  <a href="README.en.md"><img src="https://img.shields.io/badge/English-Documentation-blue.svg" alt="English Documentation"></a>
</p>

<p align="center">
  <b>Discord'un yeni clan tag özelliğini kullanan kullanıcıları tespit edip, onlara otomatik rol veren modern bir bot.</b>
</p>
<img src="https://i.postimg.cc/xT5bnVXG/image.png" alt="Görsel 1">
<img src="https://i.postimg.cc/d0k7274n/image.png" alt="Görsel 2">

## 📋 Özellikler

- ✅ **Otomatik Tag Kontrolü**: Her 10 saniyede bir kullanıcıların clan tag'lerini kontrol eder
- 🔄 **Anlık Güncellemeler**: Kullanıcılar tag aldığında/değiştirdiğinde otomatik rol verir/alır
- 🔔 **Detaylı Bildirimler**: Tüm işlemleri modern embed'ler ile log kanalına bildirir
- 📊 **İstatistik Sistemi**: Rol değişiklikleri, taglı üye oranı ve diğer verileri görselleştirir
- 💬 **Çift Komut Sistemi**: Hem slash komutları (`/stats`) hem de prefix komutları (`!stats`) destekler
- 💾 **Veritabanı Entegrasyonu**: Tüm istatistikleri kalıcı olarak saklar
- 🔒 **Güvenli**: Hassas verileri .env dosyasında tutarak korur

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18.0.0 veya üzeri)
- Discord Bot Token'ı

### Adımlar

1. Bu repository'yi klonlayın:
   ```bash
   git clone https://github.com/kynuxdev/discord-tag-bot.git
   cd discord-tag-bot
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli bilgileri ekleyin:
   ```bash
   cp .env.example .env
   ```

4. `.env` dosyasını düzenleyin:
   ```
   BOT_TOKEN=discord_bot_tokeniniz
   CLIENT_ID=client_id_buraya_gelecek
   GUILD_ID=sunucu_id_buraya_gelecek
   TAG_ROLE_ID=verilecek_rol_id_buraya_gelecek
   TARGET_TAG=OHİO
   LOG_CHANNEL_ID=log_kanal_id_buraya_gelecek
   PREFIX=!
   ```

5. Botu başlatın:
   ```bash
   node index.js
   ```

## 🤖 Discord Bot Oluşturma

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın ve bot için bir isim girin
3. "Bot" sekmesine gidip "Add Bot" butonuna tıklayın
4. "Reset Token" ile bir token oluşturup kopyalayın
5. Bot ayarlarında şu izinleri etkinleştirin:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
6. "OAuth2 > URL Generator" bölümünde:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Manage Roles`, `Read Messages/View Channels`, `Send Messages`
7. Oluşturulan URL ile botu sunucunuza ekleyin

## 📈 İstatistikler

Bot, aşağıdaki istatistikleri tutar ve `/stats` veya `!stats` komutları ile görüntüleyebilirsiniz:

- Taglı ve tagsız üye sayıları
- Toplam kontrol sayısı
- Rol ekleme/kaldırma sayıları
- Sunucuya katılan üye sayısı
- Taglı üye oranı (görsel grafikle)
- En çok kullanılan komutlar

## 🔧 Özelleştirme

Hedef tag'i değiştirmek için `.env` dosyasındaki `TARGET_TAG` değerini güncelleyin. Diğer birçok ayar doğrudan kod içerisinden özelleştirilebilir.

## 🌎 Dil Desteği

Bu bot Türk kullanıcılar için geliştirilmiştir, ancak uluslararası kullanım için [README.en.md](README.en.md) dosyasında İngilizce talimatlar bulunmaktadır. Bot arayüzü ve komutlarını farklı bir dile çevirmek istiyorsanız, ilgili dosyaları düzenleyerek kendi dilinize uyarlayabilirsiniz.

## 📝 Notlar

- Discord'un clan tag özelliği yeni olduğu için API kullanımında değişiklikler olabilir. Bu durumda kodu güncellemek gerekebilir.
- Bu botun en verimli şekilde çalışması için "Manage Roles" yetkisine sahip bir rolün bota verildiğinden emin olun.

## 📄 Lisans

Tüm Hakları Saklıdır &copy; 2025 [KynuxDev](https://github.com/kynuxdev)

Bu kod ve ilişkili belgelendirme dosyaları, yazılımın sahibinin açık izni olmadan kullanılamaz, kopyalanamaz, değiştirilemez, dağıtılamaz veya satılamaz. Daha fazla bilgi için `LICENSE` dosyasını inceleyiniz.
