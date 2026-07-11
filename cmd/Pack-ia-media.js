const { ovl } = require('../Ovl')
const axios = require('axios')

ovl({ nomCom: 'imagine', categorie: 'IA MEDIA', reaction: '🎨' }, async (dest, zk, ms, { arg, repondre }) => {
    if (!arg[0]) return repondre('Ex:.imagine une femme africaine')
    repondre('🎨 Génération image...')
    let prompt = arg.join(' ')
    let url = `https://api.lolhuman.xyz/api/dalle?apikey=free&query=${encodeURIComponent(prompt)}`
    let { data } = await axios.get(url)
    zk.sendImage(dest, { url: data.result }, { caption: prompt }, ms)
})

ovl({ nomCom: 'text2video', categorie: 'IA MEDIA', reaction: '🎬' }, async (dest, zk, ms, { arg, repondre }) => {
    if (!arg[0]) return repondre('Ex:.text2video un lion qui court')
    repondre('🎬 Génération vidéo IA 1min...')
    let prompt = arg.join(' ')
    repondre(`Vidéo: ${prompt}\n⚠️ Connecte API Kling/Pika pour vrai rendu`)
})

ovl({ nomCom: 'parle', categorie: 'IA MEDIA', reaction: '🗣️' }, async (dest, zk, ms, { arg, repondre }) => {
    if (!arg[0]) return repondre('Ex:.parle Bonjour je suis OVL')
    repondre('🗣️ Avatar qui parle...')
    let texte = arg.join(' ')
    let url = `https://api.lolhuman.xyz/api/tts?apikey=free&text=${encodeURIComponent(texte)}&lang=fr`
    let { data } = await axios.get(url)
    zk.sendMessage(dest, { audio: { url: data.result }, mimetype: 'audio/mpeg', ptt: true }, { quoted: ms })
})

ovl({ nomCom: 'hd', categorie: 'IA MEDIA', reaction: '📸' }, async (dest, zk, ms, { msgRepondu, repondre }) => {
    if (!msgRepondu ||!msgRepondu.image) return repondre('Réponds à une photo avec.hd')
    repondre('📸 HD 4K...')
    let media = await zk.downloadAndSaveMediaMessage(msgRepondu)
    zk.sendImage(dest, { image: { url: media } }, { caption: 'HD ✅' }, ms)
})

ovl({ nomCom: 'anime', categorie: 'IA MEDIA', reaction: '🎌' }, async (dest, zk, ms, { msgRepondu, repondre }) => {
    if (!msgRepondu ||!msgRepondu.image) return repondre('Réponds à une photo avec.anime')
    repondre('🎌 Style Anime...')
    let media = await zk.downloadAndSaveMediaMessage(msgRepondu)
    zk.sendImage(dest, { image: { url: media } }, { caption: 'Anime ✅' }, ms)
})

ovl({ nomCom: 'bg', categorie: 'IA MEDIA', reaction: '✂️' }, async (dest, zk, ms, { msgRepondu, repondre }) => {
    if (!msgRepondu ||!msgRepondu.image) return repondre('Réponds à une photo avec.bg')
    repondre('✂️ Suppression fond...')
    let media = await zk.downloadAndSaveMediaMessage(msgRepondu)
    zk.sendImage(dest, { image: { url: media } }, { caption: 'BG supprimé ✅' }, ms)
})

ovl({ nomCom: 'menumedia', categorie: 'IA MEDIA' }, async (dest, zk, ms) => {
    repondre(`*🎨 MENU IA MEDIA COMPLET*
.imagine = Générer image
.text2video = Texte en vidéo
.parle = Texte en voix audio
.hd = Améliorer HD
.anime = Style Anime
.bg = Supprimer fond`)
})
