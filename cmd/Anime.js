const { ovl } = require('../lib/ovl');

ovl({
    nomCom: "waifu",
    categorie: "Anime",
    reaction: "😍"
}, async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const image = "https://api.waifu.pics/sfw/waifu";
    await zk.sendMessage(dest, { image: { url: image }, caption: "*Voici ta waifu* 🥰" }, { quoted: ms });
})

const categories = ["neko", "kitsune", "husbando", "animegirl", "animeboy", "maid", "cosplay"];

categories.forEach(cmd => {
ovl({
    nomCom: cmd,
    categorie: "Anime",
    reaction: "✨"
}, async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const image = `https://api.waifu.pics/sfw/${cmd}`;
    await zk.sendMessage(dest, { image: { url: image }, caption: `*Voici ton ${cmd}* 🥰` }, { quoted: ms });
})
})
