const { ovl } = require('../lib/ovl');

// 22 BOY DP
const boyDPs = [
"https://i.imgur.com/8Qm1zZk.jpg","https://i.imgur.com/9Wn2aAl.jpg","https://i.imgur.com/0Xo3bBm.jpg","https://i.imgur.com/1Yp4cCn.jpg",
"https://i.imgur.com/2Zq5dDo.jpg","https://i.imgur.com/3Ar6eEp.jpg","https://i.imgur.com/4Bs7fFq.jpg","https://i.imgur.com/5Ct8gGr.jpg",
"https://i.imgur.com/6Du9hHs.jpg","https://i.imgur.com/7Ev0iIt.jpg","https://i.imgur.com/8Fw1jJu.jpg","https://i.imgur.com/9Gx2kKv.jpg",
"https://i.imgur.com/0Hy3lLw.jpg","https://i.imgur.com/1Iz4mMx.jpg","https://i.imgur.com/2Ja5nNy.jpg","https://i.imgur.com/3Kb6oOz.jpg",
"https://i.imgur.com/4Lc7pPa.jpg","https://i.imgur.com/5Md8qQb.jpg","https://i.imgur.com/6Ne9rRc.jpg","https://i.imgur.com/7Of0sSd.jpg",
"https://i.imgur.com/8Pg1tTe.jpg","https://i.imgur.com/9Qh2uUf.jpg"
];

// 22 GIRL DP
const girlDPs = [
"https://i.imgur.com/Aa1bBcC.jpg","https://i.imgur.com/Bb2cCdD.jpg","https://i.imgur.com/Cc3dDeE.jpg","https://i.imgur.com/Dd4eEfF.jpg",
"https://i.imgur.com/Ee5fFgG.jpg","https://i.imgur.com/Ff6gGhH.jpg","https://i.imgur.com/Gg7hHiI.jpg","https://i.imgur.com/Hh8iIjJ.jpg",
"https://i.imgur.com/Ii9jJkK.jpg","https://i.imgur.com/Jj0kKlL.jpg","https://i.imgur.com/Kk1lLmM.jpg","https://i.imgur.com/Ll2mMnN.jpg",
"https://i.imgur.com/Mm3nNoO.jpg","https://i.imgur.com/Nn4oOpP.jpg","https://i.imgur.com/Oo5pPqQ.jpg","https://i.imgur.com/Pp6qQrR.jpg",
"https://i.imgur.com/Qq7rRsS.jpg","https://i.imgur.com/Rr8sStT.jpg","https://i.imgur.com/Ss9tTuU.jpg","https://i.imgur.com/Tt0uUvV.jpg",
"https://i.imgur.com/Uu1vVwW.jpg","https://i.imgur.com/Vv2wWxX.jpg"
];

ovl({
