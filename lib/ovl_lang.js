const axios = require('axios');

async function translate(text, targetLang = 'en') {
    try {
        const res = await axios.post('https://libretranslate.de/translate', {
            q: text,
            source: 'auto',
            target: targetLang,
            format: 'text'
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return res.data.translatedText;
    } catch (err) {
        console.error('Erreur de traduction :', err.message);
        return text; // fallback au texte d'origine
    }
}

function ovl_lang(ovl, cmd_options, lang = 'en') {
    const trdfunc = { ...ovl };
    const opttrad = { ...cmd_options };

    trdfunc.sendMessage = async (jid, msg, opt) => {
        const m = { ...msg };

        if (m.text) {
            m.text = await translate(m.text, lang);
        }

        if (m.caption) {
            m.caption = await translate(m.caption, lang);
        }

        return ovl.sendMessage(jid, m, opt);
    };

    if (typeof cmd_options.repondre === 'function') {
        opttrad.repondre = async (txt, opt) => {
            const translated = await translate(txt, lang);
            return cmd_options.repondre(translated, opt);
        };
    }

    return { ovl: trdfunc, cmd_options: opttrad };
}

module.exports = ovl_lang;
