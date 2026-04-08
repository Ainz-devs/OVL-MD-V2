const settings = require('../settings');
const axios = require('axios');

async function ownerCommand(sock, chatId, message) {
    try {
        // Step 1: Send reaction first
        await sock.sendMessage(chatId, {
            react: {
                text: '💠', // Emoji ya taji
                key: message.key
            }
        });

        const imageUrl = 'https://files.catbox.moe/jwmx1j.jpg';
        
        // Download the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Create vcard
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${settings.botOwner}
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`.trim();

        // Send image first
        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: `*╭━━━〔 𝙾𝚆𝙽𝙴𝚁 𝙸𝙽𝙵𝙾 〕━━━┈⊷*\n` +
                   `*┃💠│ 𝙽𝙰𝙼𝙴 :❯ ${settings.botOwner}*\n` +
                   `*┃💠│ 𝙽𝚄𝙼𝙱𝙴𝚁 :❯ ${settings.ownerNumber}*\n` +
                   `*┃💠│ 𝙱𝙾𝚃 :❯ 𝔻𝕣𝕒𝕘𝕠𝕟𝕗𝕝𝕪 ✦ 𝕄𝔻*\n` +
                   `*╰━━━━━━━━━━━━━━━┈⊷*\n\n` +
                   `*𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙾𝚆𝙽𝙴𝚁 𝙵𝙾𝚁 𝙰𝙽𝚈 𝙷𝙴𝙻𝙿! *`
        }, { quoted: message });

        // Send vcard contact
        await sock.sendMessage(chatId, {
            contacts: { 
                displayName: settings.botOwner, 
                contacts: [{ vcard }] 
            }
        });

    } catch (error) {
        console.error('Error in owner command:', error);
        
        // Fallback: Send only vcard if image fails
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${settings.botOwner}
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`.trim();

        await sock.sendMessage(chatId, {
            contacts: { 
                displayName: settings.botOwner, 
                contacts: [{ vcard }] 
            }
        }, { quoted: message });
    }
}

module.exports = ownerCommand;