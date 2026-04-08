const { handleGoodbye } = require('../lib/welcome');
const { isGoodByeOn } = require('../lib/index');
const fetch = require('node-fetch');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363406609888799@newsletter',
            newsletterName: '𝕃𝐈𝐎𝐍𝐇𝐄𝐀𝐑𝐓 ✦ 𝕋𝐄𝐀𝐌',
            serverMessageId: -1
        }
    }
};

async function goodbyeCommand(sock, chatId, message, match) {
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: '⚔️ Cette commande est réservée aux groupes.' });
        return;
    }
    const text = message.message?.conversation ||
                 message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');
    await handleGoodbye(sock, chatId, message, matchText);
}

async function handleLeaveEvent(sock, id, participants) {
    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled) return;

    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const memberCount = groupMetadata.participants.length;

    for (const participant of participants) {
        try {
            const participantString = typeof participant === 'string'
                ? participant
                : (participant.id || participant.toString());
            const user = participantString.split('@')[0];

            // ── Récupération du nom ──────────────────────────────────
            let displayName = user;
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact?.name) {
                    displayName = contact.name;
                } else {
                    const found = groupMetadata.participants.find(p => p.id === participantString);
                    if (found?.name) displayName = found.name;
                }
            } catch (_) {}

            // ── Récupération de la photo de profil ───────────────────
            let profilePicUrl = 'https://files.catbox.moe/w7uyhy.png';
            try {
                const pic = await sock.profilePictureUrl(participantString, 'image');
                if (pic) profilePicUrl = pic;
            } catch (_) {}

            // ── Date & heure ─────────────────────────────────────────
            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            // ── Message goodbye ──────────────────────────────────────
            const finalMessage =
`╭─────────────────────╮
│  💠  𝔻𝕣𝕒𝕘𝕠𝕟𝕗𝕝𝕪 ✦ 𝕄𝔻  💠
╰─────────────────────╯

🩸 *𝚄𝙽 𝚂𝙰𝙼𝚄𝚁𝙰𝙸 𝙰 𝚀𝚄𝙸𝚃𝚃𝙴* 🩸

👤 *Guerrier :* @${displayName}
🏯 *maison :* ${groupName}
⚔️ *Membres restants :* ${memberCount} guerriers
📅 *Date :* ${dateStr} — ${timeStr}

≺ *Ce guerrier a quitté votre maisons...*
*L'honneur s'en est allé avec lui.* ≻

╰━━ ⚔️ *𝕃𝐈𝐎𝐍𝐇𝐄𝐀𝐑𝐓 ✦ 𝕋𝐄𝐀𝐌* ⚔️ ━━╯`;

            // ── Envoi avec image ─────────────────────────────────────
            try {
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming1?type=leave&textcolor=blue&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(profilePicUrl)}`;
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString],
                        ...channelInfo
                    });
                    continue;
                }
            } catch (_) {}

            // ── Fallback texte ───────────────────────────────────────
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString],
                ...channelInfo
            });

        } catch (error) {
            console.error('❌ Erreur goodbye:', error);
            const pStr = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const u = pStr.split('@')[0];
            await sock.sendMessage(id, {
                text: `🩸 @${u} a quitté *${groupMetadata?.subject}*...\n╰━━ 𝕃𝐈𝐎𝐍𝐇𝐄𝐀𝐑𝐓 ✦ 𝕋𝐄𝐀𝐌 ━━╯`,
                mentions: [pStr],
                ...channelInfo
            });
        }
    }
}

module.exports = { goodbyeCommand, handleLeaveEvent };