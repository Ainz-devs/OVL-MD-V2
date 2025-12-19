const util = require('util');
const { exec } = require('child_process');

async function eval_exec(ovl, func, {
  verif_Groupe,
  mbre_membre,
  membre_Groupe,
  verif_Admin,
  infos_Groupe,
  nom_Groupe,
  auteur_Message,
  nom_Auteur_Message,
  mtype,
  id_Bot,
  prenium_id,
  dev_id,
  dev_num,
  id_Bot_N,
  verif_Ovl_Admin,
  prefixe,
  arg,
  repondre,
  groupe_Admin,
  msg_Repondu,
  auteur_Msg_Repondu,
  ms,
  ms_org,
  texte,
  getJid,
  quote,
  m
}) {
  if (!dev_id || !texte) return;

  if (texte.startsWith('$')) {
    const cmd = texte.slice(1).trim();
    if (!cmd) return repondre("*Commande vide*");
    await new Promise((resolve) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          repondre(`Erreur d'exécution :\n${error.message}`, id_Bot).then(resolve);
        } else if (stderr) {
          repondre(`Erreur :\n${stderr}`, id_Bot).then(resolve);
        } else {
          const output = stdout || "Commande exécutée sans sortie.";
          repondre(output).then(resolve);
        }
      });
    });
  } else if (texte.startsWith('>')) {
    const code = texte.slice(1).trim();
    if (!code) return repondre("*Code vide*");
    try {
      let result;
      const wrapped = `(async () => { return ${code} })()`;
      try {
        result = await eval(wrapped);
      } catch {
        result = await eval(`(async () => { ${code} })()`);
      }
      if (typeof result === 'undefined') return await repondre("undefined");
      let output = typeof result === 'object'
        ? util.inspect(result, { depth: 1 })
        : result.toString();
      await repondre(output);
    } catch (error) {
      const err = util.inspect(error, { depth: 1 });
      await repondre(`Erreur dans le code JS:\n${err}`, id_Bot);
    }
  }
}

module.exports = eval_exec;
