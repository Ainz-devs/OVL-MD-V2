const yts = require('yt-search');
const axios = require('axios');

const newsletter = (thumbnailUrl) => ({
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
        thumbnailUrl: thumbnailUrl || "https://files.catbox.moe/hwuaw2.png",
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: "https://whatsapp.com/channel/0029VbCAIZYA2pLGKFWCbX09"
    }
});

module.exports = {
    command: 'play',
    description: 'Download and play YouTube music',
    category: 'downloader',
    execute: async (sock, m, {
        args, text, q, quoted, mime, qmsg, isMedia,
        groupMetadata, groupName, participants, groupOwner,
        groupAdmins, isBotAdmins, isAdmins, isGroupOwner,
        isCreator, prefix, reply, config, sender
    }) => {
        try {
            if (!text) {
                return await sock.sendMessage(m.chat, {
                    text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  NEED A SONG NAME!\n    💠 EXAMPLE ➳  ${prefix}play faded alan walker\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                    contextInfo: newsletter()
                }, { quoted: m });
            }

            await sock.sendMessage(m.chat, {
                react: { text: "🎶", key: m.key }
            });

            let processingMsg = await sock.sendMessage(m.chat, {
                text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 SEARCHING ➳  "${text}"\n    💠 STATUS   ➳  PLEASE WAIT...\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                contextInfo: newsletter()
            }, { quoted: m });

            const { videos } = await yts(text);
            if (!videos || videos.length === 0) {
                await sock.sendMessage(m.chat, {
                    react: { text: "😔", key: m.key }
                });
                await sock.sendMessage(m.chat, {
                    text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  NO RESULTS FOUND\n    💠 TIP     ➳  TRY DIFFERENT KEYWORDS\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                    contextInfo: newsletter()
                }, { quoted: m });
                return;
            }

            const video = videos[0];

            await sock.sendMessage(m.chat, {
                react: { text: "🔍", key: m.key }
            });

            await sock.sendMessage(m.chat, {
                text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS   ➳  SONG FOUND!\n    💠 TITLE    ➳  ${video.title}\n    💠 DURATION ➳  ${video.timestamp}\n    💠 VIEWS    ➳  ${video.views}\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 DOWNLOADING...\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                edit: processingMsg.key,
                contextInfo: newsletter(video.thumbnail)
            });

            await sock.sendMessage(m.chat, {
                react: { text: "⬇️", key: m.key }
            });

            const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(video.url)}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data?.status || !data.audio) {
                await sock.sendMessage(m.chat, {
                    react: { text: "😢", key: m.key }
                });
                await sock.sendMessage(m.chat, {
                    text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  DOWNLOAD FAILED\n    💠 TIP     ➳  TRY AGAIN IN A FEW MINUTES\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                    contextInfo: newsletter()
                }, { quoted: m });
                return;
            }

            await sock.sendMessage(m.chat, {
                react: { text: "⚡", key: m.key }
            });

            await sock.sendMessage(m.chat, {
                text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  READY TO PLAY!\n    💠 TITLE   ➳  ${data.title || video.title}\n    💠 MESSAGE ➳  SENDING AUDIO NOW...\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                edit: processingMsg.key,
                contextInfo: newsletter(video.thumbnail)
            });

            await sock.sendMessage(m.chat, {
                audio: { url: data.audio },
                mimetype: "audio/mpeg",
                fileName: `💠 ${(data.title || video.title).substring(0, 50)}.mp3`,
                contextInfo: {
                    mentionedJid: [sender],
                    ...newsletter(video.thumbnail)
                }
            }, { quoted: m });

            await sock.sendMessage(m.chat, {
                react: { text: "✅", key: m.key }
            });

        } catch (error) {
            console.error('Error in play command:', error);
            await sock.sendMessage(m.chat, {
                react: { text: "💀", key: m.key }
            });
            await sock.sendMessage(m.chat, {
                text: `「 ⛩ PLAY ⛩ 」\n ҉━━━━━━━━━━━━━━━━━━━━҉\n    💠 STATUS  ➳  ERROR\n    💠 MESSAGE ➳  UNEXPECTED ERROR\n    💠 TIP     ➳  TRY AGAIN IN A FEW MINUTES\n ҉━━━━━━━━━━━━━━━━━━━━҉`,
                contextInfo: newsletter()
            }, { quoted: m });
        }
    }
};