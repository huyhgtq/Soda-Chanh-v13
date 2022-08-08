<h1 align="center">
 <br>
  <a href="https://github.com/huyhgtq"><img src="https://sodachan.tk/thumb.png"></a>
  <br>
  Soda chanh Bot Discord [Discord.js v13]
  <br>
</h1>

<h3 align=center>Một bot hoàn toàn có thể tùy chỉnh được xây dựng với 200+ lệnh, 15 danh mục và một bảng điều khiển!</h3>


<div align=center>

 <a href="https://github.com/mongodb/mongo">
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white" alt="mongo">
  </a>
  
  <a href="https://github.com/discordjs">
    <img src="https://img.shields.io/badge/discord.js-v12.5.3-blue.svg?logo=npm" alt="discordjs">
  </a>

  <a href="https://github.com/peterhanania/Pogy/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202-blue" alt="license">
  </a>

</div>

<p align="center">
  <a href="#about">About</a>
  •
  <a href="#features">Features</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#setting-up">Setting Up</a>
  •
  <a href="#license">License</a>
  •
  <a href="#donate">Donate</a>
  •
  <a href="#credits">Credits</a>
</p>

## About

Pogy là một bot bất hòa đã mất hơn 10 tháng làm việc và chỉnh. Tôi quyết định đặt bot có nguồn mở cho bất kỳ ai muốn chạy một bản sao trong máy chủ của họ! Bạn có thể nhấp vào liên kết [này] (https://sodachan.tk/invite) để mời Bot chính thức! Ngoài ra, bạn có thể tham gia [Máy chủ hỗ trợ của Soda Chanh] (https://sodachan.tk/support) chính thức để được hỗ trợ.

Nếu bạn thích kho này, hãy để lại dấu sao ⭐ và theo tôi, nó thực sự có ý nghĩa rất lớn.

**200+** commands and **14** different categories!

  * **alt detector:** Chặn alts từ guild
  * **applications:** Quản lý các ứng dụng từ trang web
  * **config:** Định cấu hình cài đặt máy chủ
  * **utility:** Một số lệnh tiện ích
  * **economy:** Vừa bắt đầu nhưng chưa hoàn thành
  * **fun:** Rất nhiều lệnh để giữ cho máy chủ của bạn hoạt động
  * **images:** Lệnh hình ảnh
  * **information:** Lệnh thông tin
  * **moderation:** Các lệnh mod để kiểm duyệt máy chủ Discord của bạn
  * **nsfw:** 👀
  * **reaction roles:** Vai trò phản ứng
  * **game:** chơi may rủi
  * **voice:** chuyển đổi tin nhắn thành lời nói
  * **activities:** chơi game trên Discord

Soda chan hiện đang có các tính năng sau trên trang web

  * **Ticket Transcripts** + **Application Transcripts**
  * **Contact & Report** trang
  * **Welcome messages** và **farewell messages** bao gồm embeds.
  * Có thể tùy chỉnh đầy đủ **Logging** và **moderation**
  * Có thể tùy chỉnh đầy đủ **Suggestions** và **Server Reports**
  * Được tuỳ chỉnh trong **Premium system**
  * Một chế độ bảo trì được tuỳ chỉnh
  * Một trang thành viên
  * Auto Mod, Leveling và Commands (chưa hoàn tất)
  * Tích hợp API TOP.gg
 
 <h1 align="center">
  <a href="https://github.com/huyhgtq"><img src="https://i.imgur.com/InfTIuP.png"></a>
</h1>

  
**Webhooks: (for developers)**
With Pogy You can even log everything using webhooks. ( you will have to change each webhook using visual studio code )

<h1 align="center">
  <a href="https://github.com/huyhgtq"><img src="https://i.imgur.com/3TnVdn5.png"></a>
</h1>

## Installation

Đầu tiên sao chép repo: 
```
git clone https://github.com/huyhgtq/Soda-Chanh-v13.git
```
Sau khi nhân bản, chạy một lệnh
```
npm install
```


## Setting Up

Của bạn `config.json` sẽ trông như thế này:
```
{
  "main_token": process.env.token, 
  "mongodb_url": "", // Mongo DB URL
  "developers": ["", ""], // Developers ID
  "datadogApiKey": "", // For Statistics (optional)
  "dashboard": "false", 
  "prefix": "p!", // Prefix
  "arc": "", // Arc.io Source (optional)
  "youtube_key": "", // Youtube api key from https://console.cloud.google.com/apis/
  "cat_api_key": "",// https://thecatapi.com/signup
  "webhook_id": "", // Read config.json
  "webhook_url": "" // Read config.json
}

```

Của bạn `config.js` ssẽ trông như thế này:
```
module.exports = {
 "verification": "",
 "description": "", // Description
 "domain": "", // domain
 "google_analitics": "", // Google Analitics
 "token": process.env.TOKEN,
 "https":"https://", // Leave as is
 "port":"5003",

 "client_id":"", // Bot client ID
 "secret":""// Bot client secret for auth

}
```
Của bạn `.env` tệp phải là:
```
TOKEN=BOT_TOKEN
```

### For the Dashboard set up please read https://github.com/IgorKowalczyk/majo.exe#-self-hosting-dashboard

**Callbacks on Auth Dev Portal:**
`https://domain/callback`
`https://domain/window`
`https://domain/thanks`

Hãy chắc chắn rằng bạn đã bật `Privileged Intents` trong discord [developer portal](https://discordapp.com/developers/applications/). Bạn có thể tìm thấy những thứ này trong "Bot" và có hai dấu tích bạn phải bật. Để biết thêm thông tin về Gateway Intents, hãy xem [this link](https://discordjs.guide/popular-topics/intents.html#the-intents-bit-field-wrapper).

Bạn có thể khởi chạy bot với lệnh `npm run start` (đảm bảo rằng bạn đã cài đặt node và npm).

**Important Note:** Soda chanh có rất nhiều lỗi và đòi hỏi rất nhiều kiến thức về js của bạn. Bạn sẽ gặp một số khó khăn khi chạy bot nếu bạn không có kinh nghiệm về discord.js.

### Emojis 
- Bạn có thể thay đổi biểu tượng cảm xúc trong: <br>
1- `assets/emojis.json` <br>
2- `data/emoji.js`

### Colors
- Bạn có thể thay đổi màu sắc trong `data/colors.js`

## License
Phát hành theo [Apache License](http://www.apache.org/licenses/LICENSE-2.0) giấy phép.
https://paypal.me/huyhgtq
## Donate
If you want to support the creator of this source code, please support them [donate Pogy](https://paypal.me/pogybot)!

## Credits
* **Peter Hanania** - *head developer* - [github](https://github.com/peterhanania)
* **Wlegit** - *developer*  - [github](https://github.com/wlegit)
* **Slayer** - *Contributor - Command Handler base* [github](https://github.com/GhostSlayer)
* **Ace** - *Contributor - Embed builder* [github](https://github.com/Glitchii)
* **Majo** - *Dashboard base + css* - [github](https://github.com/IgorKowalczyk/)
* **loom** - *Contributor + Translation* - [github](https://github.com/loom4k/) [website](https://loom4k.me)
* **Mezo** - *German Translation* - [github](https://github.com/mezotv/) [website](https://devdominik.com)

I'm just the source code editor of pogy , if you have any problem feel free to contact me