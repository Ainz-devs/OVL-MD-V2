const { ovl } = require('../lib/ovl');
const axios = require('axios');

// 1. STALK IG
ovl({
    nomCom: "stalk",
    categorie: "Hacking",
    reaction: "🔍"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    if(!arg[0]) return repondre("Tape:?stalk username");
    let username = arg[0].replace('@','');
    try{
        let res = await axios.get(`https://api.github.com/users/${username}`); // exemple API
        let msg = `*🔍 STALK RESULT*\n\n`;
        msg += `*Username:* ${username}\n`;
        msg += `*Bio:* ${res.data.bio || "Aucune"}\n`;
        msg += `*Followers:* ${res.data.followers}\n`;
        msg += `*Following:* ${res.data.following}\n`;
        msg += `*Repos:* ${res.data.public_repos}`;
        await zk.sendMessage(dest, { image: { url: res.data.avatar_url }, caption: msg }, { quoted: ms });
    }catch(e){
        repondre(`Username ${username} introuvable`);
    }
})

// 2. PHONE INFO
ovl({
    nomCom: "phone",
    categorie: "Hacking",
    reaction: "📱"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    if(!arg[0]) return repondre("Tape:?phone +225XXXXXXXX");
    let num = arg[0];
    let msg = `*📱 PHONE INFO*\n\n`;
    msg += `*Numéro:* ${num}\n`;
    msg += `*Pays:* Côte d'Ivoire 🇨🇮\n`;
    msg += `*Opérateur:* Orange/MTN/Moov\n`;
    msg += `*Type:* Mobile\n`;
    msg += `\n*Note: Info basique. Pour info détaillée il faut API payante*`;
    repondre(msg);
})

// 3. IP LOOKUP
ovl({
    nomCom: "ip",
    categorie: "Hacking",
    reaction: "🌐"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    if(!arg[0]) return repondre("Tape:?ip 8.8.8.8");
    try{
        let res = await axios.get(`http://ip-api.com/json/${arg[0]}`);
        let data = res.data;
        let msg = `*🌐 IP LOOKUP*\n\n`;
        msg += `*IP:* ${data.query}\n`;
        msg += `*Pays:* ${data.country}\n`;
        msg += `*Ville:* ${data.city}\n`;
        msg += `*ISP:* ${data.isp}\n`;
        msg += `*Lat/Long:* ${data.lat}, ${data.lon}`;
        repondre(msg);
    }catch(e){
        repondre("IP invalide");
    }
})
