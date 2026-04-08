const isAdmin = require('../lib/isAdmin');

const newsletter = (imageUrl) => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363406609888799@newsletter',
        newsletterName: '⛩ DRAGONFLY MD ⛩',
        serverMessageId: Math.floor(Math.random() * 1000)
    },
    externalAdReply: {
        title: "「 ⛩ DRAGONFLY MD ⛩ 」",
        body: "💠 Tap to join our official channel",
        thumbnailUrl: imageUrl || "https://files.catbox.moe/hwuaw2.png",
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: "https://whatsapp.com/channel/0029VbCAIZYA2pLGKFWCbX09"
    }
});

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        await sock.sendMessage(chatId, {
            react: {
                text: '📢',
                key: message.key
            }
        });

        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, {
                text: `「 ⛩ TAGALL ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  MAKE BOT ADMIN FIRST\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                contextInfo: newsletter()
            }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, {
                text: `「 ⛩ TAGALL ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  ONLY ADMINS CAN USE THIS\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                contextInfo: newsletter()
            }, { quoted: message });
            return;
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, {
                text: `「 ⛩ TAGALL ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  NO PARTICIPANTS FOUND\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                contextInfo: newsletter()
            });
            return;
        }

        let messageText = `「 ⛩ TAGALL ⛩ 」\n`;
        messageText += ` ҉━━━━━━━━━━━━━━━━━━━━҉\n`;
        messageText += `    💠 STATUS   ➳  SUCCESS\n`;
        messageText += `    💠 MEMBERS  ➳  ${participants.length}\n`;
        messageText += ` ҉━━━━━━━━━━━━━━━━━━━━҉\n\n`;
        messageText += `⚔ HELLO EVERYONE! ⚔\n\n`;

        participants.forEach(participant => {
            const number = participant.id.split('@')[0];
            messageText += `  💠 @${number}\n`;
        });

        messageText += `\n ҉━━━━━━━━━━━━━━━━━━━━҉`;
        messageText += `\n> © POWERED BY 💠 DRAGONFLY MD`;

        await sock.sendMessage(chatId, {
            text: messageText,
            mentions: participants.map(p => p.id),
            contextInfo: newsletter("https://files.catbox.moe/hwuaw2.png")
        });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, {
            text: `「 ⛩ TAGALL ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  FAILED TO TAG MEMBERS\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
            contextInfo: newsletter()
        });
    }
}

module.exports = tagAllCommand;