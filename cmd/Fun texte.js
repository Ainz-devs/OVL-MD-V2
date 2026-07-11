const { ovl } = require('../lib/ovl');

// 1. ISHQMETER
ovl({
    nomCom: "ishqmeter",
    categorie: "Fun Texte",
    reaction: "💕"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    if(!arg[0]) return repondre("Tape:?ishqmeter @nom1 @nom2");
    let pourcent = Math.floor(Math.random() * 101);
    let msg = `*💕 ISHQ METER 💕*\n\n*${arg[0]}* + *${arg[1] || "Toi"}*\n\n*Résultat: ${pourcent}%*\n\n`;
    if(pourcent < 30) msg += "Pas compatible 😢";
    else if(pourcent < 70) msg += "Ça peut marcher 😉";
    else msg += "Amour vrai!!! ❤️";
    repondre(msg);
})

// 2. SHAYARI
let shayaris = [
"Chahat itni ki duniya bhool jao, Dil mein aisi chahat bhar do",
"Teri har khushi meri jaan hai, Teri har khushi ke liye ye dil kurban hai",
"Ishq aur dosti mere do jahan hain, Ishq mein dosti aur dosti mein ishq hai"
];

ovl({
    nomCom: "shayari",
    categorie: "Fun Texte",
    reaction: "📜"
}, async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    let random = shayaris[Math.floor(Math.random() * shayaris.length)];
    await zk.sendMessage(dest, { text: `*SHAYARI* 📜\n\n${random}` }, { quoted: ms });
})

// 3. LOVE %
ovl({
    nomCom: "love",
    categorie: "Fun Texte",
    reaction: "❤️"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    if(!arg[0]) return repondre("Tape:?love @tag");
    let pourcent = Math.floor(Math.random() * 101);
    repondre(`*${arg[0]} t'aime à ${pourcent}%* ❤️`);
})
