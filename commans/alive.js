const settings = require("../settings");
const os = require("os");
const axios = require("axios");

/* 🎨 Images aléatoires pour le alive */
const aliveImages = [
    "https://files.catbox.moe/hwuaw2.png"
];

/* 🌟 Helper pour image random */
const getRandomImage = () => aliveImages[Math.floor(Math.random() * aliveImages.length)];

/* 📰 Newsletter context pour WhatsApp */
const newsletterContext = (imageUrl) => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363406609888799@newsletter',
        newsletterName: '𝕃𝐈𝐎𝐍𝐇𝐄𝐀𝐑𝐓 ✦ 𝕋𝐄𝐀𝐌',
        serverMessageId: Math.floor(Math.random() * 1000)
    },
    externalAdReply: {
        title: "𝔻𝕣𝕒𝕘𝕠𝕟𝕗𝕝𝕪 ✦ 𝕄𝔻 SYSTEM",
        body: "Tap to view our official channel",
        thumbnailUrl: imageUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: "https://whatsapp.com/channel/0029VbCAIZYA2pLGKFWCbX09"
    }
});

/* 🎬 Commande ALIVE - Style Samurai */
async function aliveCommand(sock, chatId, message, botStats = {}) {
    const randomImage = getRandomImage();

    const totalGroups = botStats.totalGroups || "N/A";
    const totalUsers  = botStats.totalUsers  || "N/A";
    const uptime      = botStats.uptime      || "N/A";

    const aliveMessage = `
「 ⛩ DRAGONFLY MD ⛩ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
    💠 VERSION  ➳  ${settings.version}
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ STATUS ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 ONLINE  ➳  🟢 ACTIVE
  💠 MODE    ➳  PUBLIC
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 GROUP MANAGEMENT
  💠 ANTILINK PROTECTION
  💠 FUN COMMANDS
  💠 AND MORE!
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ BOT STATS ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 GROUPS    ➳  ${totalGroups}
  💠 USERS     ➳  ${totalUsers}
  💠 UPTIME    ➳  ${uptime}
  💠 PLATFORM  ➳  ${os.platform()} ${os.arch()}
 ҉━━━━━━━━━━━━━━━━━━━━҉

> © POWERED BY 💠 DRAGONFLY MD
`;

    try {
        const response = await axios.get(randomImage, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: aliveMessage,
            mentions: [message.key?.participant || chatId],
            contextInfo: newsletterContext(randomImage)
        }, { quoted: message });

    } catch (error) {
        console.error('Error sending ALIVE message:', error);
        await sock.sendMessage(chatId, {
            text: aliveMessage,
            mentions: [message.key?.participant || chatId],
            contextInfo: newsletterContext(randomImage)
        }, { quoted: message });
    }
}

module.exports = aliveCommand;