const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message, pushname, config) {
    // Hakikisha config ipo, iwapo haipo tumia default
    const prefix = config && config.PREFIX ? config.PREFIX : '.';
    const mode = settings.mode || '𝙿𝚄𝙱𝙻𝙸𝙲';
    const version = settings.version || '𝟹.𝟶.𝟶';
    
    const helpMessage = `
「 ⛩ DRAGONFLY MD ⛩ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
    💠 USER    ➳  ${pushname || 'User'}
    💠 MODE    ➳  ${mode}
    💠 PREFIX  ➳  ${prefix}
    💠 VER     ➳  ${version}
 ҉━━━━━━━━━━━━━━━━━━━━҉

  ⛩ こんにちは ${pushname || 'User'} 🥰

「 ⚔ GENERAL ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .HELP / .MENU
  💠 • .PING
  💠 • .ALIVE
  💠 • .TTS <TEXT>
  💠 • .OWNER
  💠 • .JOKE
  💠 • .QUOTE
  💠 • .FACT
  💠 • .WEATHER <CITY>
  💠 • .NEWS
  💠 • .ATTP <TEXT>
  💠 • .LYRICS <SONG>
  💠 • .8BALL <QUESTION>
  💠 • .GROUPINFO
  💠 • .STAFF / .ADMINS
  💠 • .VV
  💠 • .TRT <TEXT> <LANG>
  💠 • .SS <LINK>
  💠 • .JID
  💠 • .URL
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ ADMIN ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .BAN @USER
  💠 • .PROMOTE @USER
  💠 • .DEMOTE @USER
  💠 • .MUTE <MINUTES>
  💠 • .UNMUTE
  💠 • .DELETE / .DEL
  💠 • .KICK @USER
  💠 • .WARNINGS @USER
  💠 • .WARN @USER
  💠 • .ANTILINK
  💠 • .ANTIBADWORD
  💠 • .CLEAR
  💠 • .TAG <MESSAGE>
  💠 • .TAGALL
  💠 • .TAGNOTADMIN
  💠 • .HIDETAG <MESSAGE>
  💠 • .CHATBOT
  💠 • .RESETLINK
  💠 • .ANTITAG <ON/OFF>
  💠 • .WELCOME <ON/OFF>
  💠 • .GOODBYE <ON/OFF>
  💠 • .SETGDESC <DESCRIPTION>
  💠 • .SETGNAME <NEW NAME>
  💠 • .SETGPP (REPLY TO IMAGE)
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ OWNER ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .MODE <PUBLIC/PRIVATE>
  💠 • .CLEARSESSION
  💠 • .ANTIDELETE
  💠 • .CLEARTMP
  💠 • .UPDATE
  💠 • .SETBOTNAME
  💠 • .SETTINGS
  💠 • .NEWSLETTER
  💠 • .SETPREFIX
  💠 • .SETPP <REPLY TO IMAGE>
  💠 • .AUTOREACT <ON/OFF>
  💠 • .AUTOSTATUS <ON/OFF>
  💠 • .AUTOSTATUS REACT <ON/OFF>
  💠 • .AUTOTYPING <ON/OFF>
  💠 • .AUTOREAD <ON/OFF>
  💠 • .ANTICALL <ON/OFF>
  💠 • .PMBLOCKER <ON/OFF/STATUS>
  💠 • .PMBLOCKER SETMSG <TEXT>
  💠 • .SETMENTION <REPLY TO MSG>
  💠 • .MENTION <ON/OFF>
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ IMAGE / STICKER ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .BLUR <IMAGE>
  💠 • .SIMAGE <REPLY TO STICKER>
  💠 • .STICKER <REPLY TO IMAGE>
  💠 • .REMOVEBG
  💠 • .REMINI
  💠 • .CROP <REPLY TO IMAGE>
  💠 • .TGSTICKER <LINK>
  💠 • .MEME
  💠 • .TAKE <PACKNAME>
  💠 • .EMOJIMIX <EMJ1>+<EMJ2>
  💠 • .IGS <INSTA LINK>
  💠 • .IGSC <INSTA LINK>
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ PIES COMMANDS ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .PIES <COUNTRY>
  💠 • .CHINA
  💠 • .INDONESIA
  💠 • .JAPAN
  💠 • .KOREA
  💠 • .HIJAB
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ GAME ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .TICTACTOE @USER
  💠 • .HANGMAN
  💠 • .GUESS <LETTER>
  💠 • .TRIVIA
  💠 • .ANSWER <ANSWER>
  💠 • .TRUTH
  💠 • .DARE
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ AI ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .GPT <QUESTION>
  💠 • .GEMINI <QUESTION>
  💠 • .IMAGINE <PROMPT>
  💠 • .FLUX <PROMPT>
  💠 • .SORA <PROMPT>
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ FUN ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .COMPLIMENT @USER
  💠 • .INSULT @USER
  💠 • .FLIRT
  💠 • .SHAYARI
  💠 • .GOODNIGHT
  💠 • .ROSEDAY
  💠 • .CHARACTER @USER
  💠 • .WASTED @USER
  💠 • .SHIP @USER
  💠 • .SIMP @USER
  💠 • .STUPID @USER [TEXT]
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ TEXTMAKER ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .METALLIC <TEXT>
  💠 • .ICE <TEXT>
  💠 • .SNOW <TEXT>
  💠 • .IMPRESSIVE <TEXT>
  💠 • .MATRIX <TEXT>
  💠 • .LIGHT <TEXT>
  💠 • .NEON <TEXT>
  💠 • .DEVIL <TEXT>
  💠 • .PURPLE <TEXT>
  💠 • .THUNDER <TEXT>
  💠 • .LEAVES <TEXT>
  💠 • .1917 <TEXT>
  💠 • .ARENA <TEXT>
  💠 • .HACKER <TEXT>
  💠 • .SAND <TEXT>
  💠 • .BLACKPINK <TEXT>
  💠 • .GLITCH <TEXT>
  💠 • .FIRE <TEXT>
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ DOWNLOADER ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .PLAY <SONG NAME>
  💠 • .SONG <SONG NAME>
  💠 • .SPOTIFY <QUERY>
  💠 • .INSTAGRAM <LINK>
  💠 • .FACEBOOK <LINK>
  💠 • .TIKTOK <LINK>
  💠 • .VIDEO <SONG NAME>
  💠 • .YTMP4 <LINK>
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ MISC ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .HEART
  💠 • .HORNY
  💠 • .CIRCLE
  💠 • .LGBT
  💠 • .LOLICE
  💠 • .ITS-SO-STUPID
  💠 • .NAMECARD
  💠 • .OOGWAY
  💠 • .TWEET
  💠 • .YTCOMMENT
  💠 • .COMRADE
  💠 • .GAY
  💠 • .GLASS
  💠 • .JAIL
  💠 • .PASSED
  💠 • .TRIGGERED
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ ANIME ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .NEKO
  💠 • .WAIFU
  💠 • .LOLI
  💠 • .NOM
  💠 • .POKE
  💠 • .CRY
  💠 • .KISS
  💠 • .PAT
  💠 • .HUG
  💠 • .WINK
  💠 • .FACEPALM
 ҉━━━━━━━━━━━━━━━━━━━━҉

「 ⚔ GITHUB ⚔ 」
 ҉━━━━━━━━━━━━━━━━━━━━҉
  💠 • .GIT
  💠 • .GITHUB
  💠 • .SC
  💠 • .SCRIPT
  💠 • .REPO
 ҉━━━━━━━━━━━━━━━━━━━━҉
`
    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363406609888799@newsletter',
                        newsletterName: '𝔻𝕣𝕒𝕘𝕠𝕟𝕗𝕝𝕪 ✦ 𝕄𝔻',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363406609888799@newsletter',
                        newsletterName: '𝔻𝕣𝕒𝕘𝕠𝕟𝕗𝕝𝕪 ✦ 𝕄𝔻',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;