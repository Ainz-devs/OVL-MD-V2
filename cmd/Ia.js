const { ovl } = require('../lib/ovl');
const axios = require('axios');

async function askAI(prompt, model = "gpt-3.5-turbo") {
    try {
        let res = await axios.post('https://text.pollinations.ai/', {
            messages: [{role: "user", content: prompt}],
            model: model
        });
        return res.data;
    } catch(e) { return "Erreur API. Réessaie" }
}

ovl({ nomCom: "gpt", categorie: "IA PRO", reaction: "🤖" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?gpt ta question");
    repondre("*🤖 GPT-3.5 en cours...*");
    let res = await askAI(arg.join(" "), "gpt-3.5-turbo");
    repondre(`*🤖 GPT-3.5*\n\n${res}`);
})

ovl({ nomCom: "gpt4", categorie: "IA PRO", reaction: "🧠" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?gpt4 ta question");
    repondre("*🧠 GPT-4 en cours...*");
    let res = await askAI(arg.join(" "), "gpt-4");
    repondre(`*🧠 GPT-4*\n\n${res}`);
})

ovl({ nomCom: "claude", categorie: "IA PRO", reaction: "👑" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?claude ta question");
    repondre("*👑 Claude en cours...*");
    let res = await askAI(arg.join(" "), "claude");
    repondre(`*👑 CLAUDE 3*\n\n${res}`);
})

ovl({ nomCom: "gemini", categorie: "IA PRO", reaction: "💎" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?gemini ta question");
    repondre("*💎 Gemini en cours...*");
    let res = await askAI(arg.join(" "), "gemini");
    repondre(`*💎 GEMINI PRO*\n\n${res}`);
})

ovl({ nomCom: "llama", categorie: "IA PRO", reaction: "🦙" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?llama ta question");
    repondre("*🦙 Llama 3 en cours...*");
    let res = await askAI(arg.join(" "), "llama");
    repondre(`*🦙 LLAMA 3*\n\n${res}`);
})

ovl({ nomCom: "dalle", categorie: "IA PRO", reaction: "🎨" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?dalle une ville futuriste");
    repondre("*🎨 Génération HD en cours...*");
    let prompt = arg.join(" ") + ", 4k, ultra detailed";
    let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024`;
    await zk.sendMessage(dest, { image: { url }, caption: `*DALLE 3* 🎨\n*Prompt:* ${prompt}` }, { quoted: ms });
})

ovl({ nomCom: "code", categorie: "IA PRO", reaction: "💻" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?code bot whatsapp en nodejs");
    repondre("*💻 Génération de code...*");
    let res = await askAI(`Ecris le code pour: ${arg.join(" ")}`, "gpt-4");
    repondre(`*💻 CODE IA*\n\`\`${res}\`\``);
})

ovl({ nomCom: "logo", categorie: "IA PRO", reaction: "✨" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?logo OVL-MD");
    repondre("*✨ Génération logo HD...*");
    let text = arg.join(" ");
    let url = `https://image.pollinations.ai/prompt/professional logo design, ${encodeURIComponent(text)}, 4k`;
    await zk.sendMessage(dest, { image: { url }, caption: `*AI LOGO HD* ✨\n*Text:* ${text}` }, { quoted: ms });
})// 9. SINGER IA - Génère paroles + chant
ovl({ nomCom: "singer", categorie: "IA PRO", reaction: "🎤" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?singer chanson d'amour triste");
    let topic = arg.join(" ");
    repondre("*🎤 Génération de chanson en cours...*");
    
    // 1. Génère les paroles avec GPT
    let paroles = await askAI(`Ecris les paroles d'une chanson ${topic}. 2 couplets + refrain. Style: émotionnel`, "gpt-3.5-turbo");
    
    await repondre(`*🎤 PAROLES IA*\n\n${paroles}\n\n*Note: Bientôt génération audio*`);
})

// 10. VOICE IA - Convertit texte en vocal
ovl({ nomCom: "voice", categorie: "IA PRO", reaction: "🗣️" }, async (dest, zk, {ms, arg, repondre}) => {
    if(!arg[0]) return repondre("Tape:?voice Bonjour comment ça va");
    let text = arg.join(" ");
    repondre("*🗣️ Génération vocal en cours...*");
    
    try{
        // API TTS gratuite
        let ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=fr&client=tw-ob`;
        await zk.sendMessage(dest, { 
            audio: { url: ttsUrl }, 
            mimetype: 'audio/mpeg',
            ptt: true 
        }, { quoted: ms });
    }catch(e){
        repondre("Erreur vocal. Réessaie");
    }
})
