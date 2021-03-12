/*
HTML/Javascript CSI e-book annotations functions
Copyright (c) 2021 J.A. Howard | github.com/jahoward11
*/

(function () { //let rstate, elemsscript, afnccalled
window.annos = window.annos || { configs: {} };
//if (window.annos.fns) return;

window.annos.fns = window.annos.fns || function x(cfgs) {
'use strict';
let acs = cfgs && !cfgs.eventPhase && cfgs || window.annos && window.annos.configs || {},
  d1wrap = window.editorApp ? "#esrender_42qz0xfp" : window.ecodc1 ? "#ecorender" : "body",
  d1node = window.document.querySelector(d1wrap),
  dcwrap = !window.document.querySelector(d1wrap + ' .section>main.container')
    ? "" : " .section>main.container",
  dstyles = (window.editorApp || window.ecodc1 ? d1node : window.document).querySelectorAll('style') || [],
  mdit = window.markdownit && window.markdownit(),
  sepahlwr = /<!-- *(?:annotations-hili|annoshl|texthl).*\n*([^]*?)\n*-->/i,
  sepahlmc = /((?:(?:\n*\/.+\/[gim]*|\n*{[ *+:=_~]*\\?[#.]?\w*}|\n*.+?{ *\+\+ *\\?[#.]?\w*})(?:\n|(?=$))|\n)+|^)([^]*?)(?=(?:\n+\/.+\/[gim]*|\n*{[ *+:=_~]*\\?[#.]?\w*}|\n+.+?{ *\+\+ *\\?[#.]?\w*})(?:\n|$)|\n\n|$)/g,
  sepaperiph = /<!--[^]*?-->|<(script|style)\b.*?>[^]*?<\/\1>/gi,
  annoblocks = [], //refNbrAssign, annosXlink
  dstyle0, htmlperiphs, masthd,
  pei = 0,
  stylenew, texthl,
  tocbuild = ""; //refNbrAssign, annosfns

!(mdit && window.markdownitIns && window.markdownitSub && window.markdownitSup)
|| (mdit = mdit.use(window.markdownitIns).use(window.markdownitSub).use(window.markdownitSup));

acs = {
  ptfnm: acs.ptfnm || ["part", "1"],
  ptchbgn: Array.isArray(acs.ptchbgn) && acs.ptchbgn || [1, 1],
  tocfmt: acs.tocfmt || (acs.tocfmt === false || acs.tocfmt === "" ? "" : acs.tocfmt === 0 ? "0" : null),
  hnwrap: acs.hnwrap || "",
  pnwrap: acs.pnwrap || (acs.pnwrap === "" ? "" : "<br />"),
  pnfreq: acs.pnfreq > 0 && acs.pnfreq || (acs.pnfreq <= 0 ? 0 : 5),
  numalt: acs.numalt || [], //["Zeroth", "First", "Second", "Third"],
  texthl: acs.texthl || []
};

function chNbr(chnbru) { //refNbrAssign, annosXlink
  return acs.ptchbgn[1] > 1 ? chnbru - (100 * acs.ptchbgn[0]) : chnbru;
}

function hljsSetup() {
  let codeblocks = window.document.querySelectorAll('code'),
    pcode, prenew;
  codeblocks.forEach(cbi => {
    pcode = cbi.parentElement;
    if (pcode.parentElement.nodeName !== 'PRE' && pcode.childNodes.length === 1) {
      if (pcode.nodeName === 'P' || pcode.className === "language-p") {
        // NOCS generates P>CODE. Markdownit generates PRE>CODE.
        // Transform either one to PRE>P>CODE.
        prenew = window.document.createElement('pre');
        prenew.innerHTML = "<p>" + pcode.innerHTML + "</p>";
        pcode.parentElement.replaceChild(prenew, pcode);
      } else if (pcode.nodeName === 'PRE' && window.hljs) {
        window.hljs.highlightBlock(cbi);
      } //hljs.initHighlighting();
    }
  });
}

function refNbrAssign() {
let hnbgn = acs.ptchbgn[acs.ptchbgn[0]],
  numalt = acs.numalt,
  ptchbgn = acs.ptchbgn,
  tocfmt = typeof acs.tocfmt !== 'number' ?  acs.tocfmt
    : (Number.isInteger(acs.tocfmt) && acs.tocfmt > 0 ? acs.tocfmt.toString() : "");
let chid = d1node.querySelector('#header') ? "header" : "top",
  dcnode = window.document.querySelector(d1wrap + dcwrap),
  divnew, divinnr, h16mask, h16nav,
  hdgtags = ['>h1:not(#title)', '>h2:not(#title):not(#author)', '>h3:not(#date)', '>h4', '>h5', '>h6'].map(e => d1wrap + dcwrap + e),
  hnpatt, hnpatt1, hnpatt2, hnseps,
  hntoc = 1,
  hnwpre0, hnwrap0, hnwrap1, hnwrap3, hxchlvl,
  hsublvls = dcnode.querySelectorAll(['>h1', '>h2', '>h3', '>h4', '>h5', '>h6'].map(e => ":not(body):not(#esrender_42qz0xfp):not(#ecorender):not(.container)" + e).join()),
  htitle = (d1node.querySelectorAll('h1, h2') || [null])[0],
  hxct = [0, 0, 0, 0, 0, 0, 0],
  hxct_hhx = [0, 0, 0, 0, 0, 0, 0],
  hxi, hxilvl, hxilvlprv, hxlen, hxrlvl, hxsdiff, hxsl, hxtoplvl, i,
  mnotect = 0,
  navchlen = dcnode.querySelectorAll('.navch').length,
  navct = 0,
  pari_navct = null,
  parlen,
  pars = null,
  pcontainer, pnextnode, pnwrap,
  shct = 0,
  tf05, tf0auto, tf1auto,
  tochxs = [];
if (!navchlen) { hsublvls.forEach(h => h.className = "hsublvl"); }
if (!navchlen && htitle && !/\btitle\b/i.test(htitle.id)) { htitle.id = "title"; }
hxlen = [0].concat(hdgtags.map(e => d1node.querySelectorAll(e).length));
if (!hxlen.some(e => e)) {
  let p0 = dcnode.querySelector('p:not(#author):not(#date)');
  p0.parentElement.insertBefore(window.document.createElement('h3'), p0);
}
hxtoplvl = hxlen.findIndex(l => l);
tf0auto = hxtoplvl < 0 ? 0 : [1, 2, 3, 4, 5, 6].find(n => hxtoplvl <= n && hxlen[n] > 1) || 0;
tf1auto = !tf0auto ? 0 : hxlen[3] && tf0auto <= 2 ? 4 - tf0auto : hxlen[2] && tf0auto <= 1 ? 2 : 1;
tf05 = Array.isArray(tocfmt) && tocfmt[0] !== null && tocfmt[1] !== null ? tocfmt.slice(0, 6)
    .concat([tocfmt[0], tocfmt[1], null, null].slice(tocfmt.length < 6 ? tocfmt.length - 2 : 4))
    .map(e => e === null ? null : !+e || !Number.isInteger(+e) || +e < 0 ? 0 : +e)
  : (typeof tocfmt !== 'string' || /^auto/i.test(tocfmt))
    ? [tf0auto, tf1auto, hxtoplvl < 0 ? 0 : hxtoplvl, (tf1auto + tf0auto || hxtoplvl) - hxtoplvl, null, null]
  : tocfmt.trim().replace(/^[^e]+$/i, m => m.replace(/#/g, "e"))
    .replace( /^.*?e[cr]*h?([1-6]).*$|^[^eh]*?([1-6])[^eh]*[er]*$|.*/i, (m, c1, c2) =>
    ( c1 ? c1 + m.replace(/[er]+$|[^e]+/gi, "").length.toString()
      : c2 ? c2 + m.replace(/[^1-6]+/g, "").length.toString() : "00" )
    + m.replace( /^.*?h([1-6]).*$|.*/i, (msub, cs1) =>
      cs1 ? cs1 + msub.replace(/h0|[^h]+/gi, "").length.toString() : "00" )
    + (/cr?h?(\d)/i.exec(m) || ["", "_"])[1] + ( /re*$|^$/i.test(m) ? "7"
      : (/rc?h?(\d)/i.exec(m) || ["", "_"])[1] ) ).split("").map(e => e === "_" ? null : +e);
hnseps = Array.isArray(tocfmt) && tocfmt.length >= 7 + (tf05[1] || tf05[3]) ? tocfmt.slice(6)
  : typeof tocfmt === 'string' && !/^auto/i.test(tocfmt)
    ? tocfmt.replace(/^[^e]+$/i, m => m.replace(/#/g, "e")).replace(/[er]+$|[ 0a-df-z]+/gi, "")
      .replace(/.*?e.*/, m => m.replace(/e(\d)|\d/gi, "$1")).replace(/\d(?=\d)/g, "$&.").split(/\d/)
  : [""].concat(".".repeat((tf05[1] || tf05[3] || 1) - 1).split(""))
    .concat(tf05[1] === 1 || !tf05[1] && tf05[3] === 1 ? ["."] : [""]);
hxchlvl = tf05[4] !== null ? tf05[4] : tf05[0] && tf05[1]
  ? [3, 2, 1, 4, 5, 6].find(l => hxlen[l] && tf05[0] <= l && tf05[0] + tf05[1] > l) || 0
  : [3, 2, 1, 4, 5, 6].find(l => hxlen[l] && tf05[2] <= l && tf05[2] + tf05[3] > l) || 0;
hxrlvl = tf05[5] !== null ? tf05[5] : hxchlvl;
if (tf05[2] === null || tf05[3] === null) { tf05[2] = tf05[0]; tf05[3] = tf05[1]; }
if (hxrlvl && hxrlvl < 7 && (!tf05[0] || !tf05[1])) { hntoc--;
  if (tf05[2] && tf05[3] && hxrlvl >= tf05[2]) { tf05[0] = tf05[2]; tf05[1] = hxrlvl - tf05[2] + 1;
  } else { tf05[0] = hxrlvl; tf05[1] = 1; }
}
if (tf05[0] && tf05[1] && tf05[2] && tf05[3] && (tf05[2] > tf05[0] || tf05[3] < tf05[1])) {
  tf05[2] = tf05[0]; tf05[3] = tf05[1];
  hnseps = [""].concat(".".repeat((tf05[1] || tf05[3] || 1) - 1).split(""))
    .concat(tf05[1] === 1 || !tf05[1] && tf05[3] === 1 ? ["."] : [""]);
}
h16nav = !hxrlvl ? new window.RegExp("^(?=<h(?![1-6] class=['\"]?hsublvl|[12] id=['\"]?title)[1-6].*?>)", "im")
  : !navchlen ? new window.RegExp("^(?=<h(?![1-6] class=['\"]?hsublvl|[12] id=['\"]?title)[0-"
    + (hxrlvl >= tf05[2] + tf05[3] ? hxrlvl : (tf05[2] + tf05[3] || 1) - 1) + "].*?>)", "gim")
  : hxrlvl > hxchlvl ? new window.RegExp("^(?=<h(?![1-6] class=['\"]?hsublvl|[12] id=['\"]?title)["
    + (hxchlvl + 1) + "-" + hxrlvl + "].*?>)", "gim") : /^$/;
h16mask = new window.RegExp("^<p"
  + (hxrlvl > 0 && (tf05[2] || tf05[0]) && tf0auto && (tf05[2] || tf05[0]) >= tf0auto ? "" : "(?! id=subhead1 )")
  + "(.*?class=['\"]?navch\\b.*?>.*?<\\/)p(?=>\\s*<h[0-" + ( hxrlvl <= 0 ? 6 : hxrlvl < tf05[2] ? hxrlvl - 1
    : tf05[2] && tf05[3] && tf0auto && tf05[2] >= tf0auto ? tf05[2] - 1 : tf05[0] ? tf05[0] - 1 : 0 )
  + (hxrlvl > 0 && hxrlvl < 7 ? (hxrlvl + 1) + "-7" : "")
  + "].*?>|>\\s*<p.*?class=['\"]?navch\\b.*?>)", "gim");
dcnode.innerHTML = dcnode.innerHTML
//.replace(/<p><\/p>(<blockquote.+?\/blockquote>)/gi, "$1\n<p>").replace(/<p>(?=<\/p>)/gi, "");
  .replace( /^<(?!\/?li>|\/?[dou]l>)\/?\b.+\n(?=<([dou]l)(?:[^](?!<p>))+?<\/\1>(?!\n<\/?li>|\n<\/?[dou]l>))/gim,
    "$&<p style=\"display: none;\"></p>\n" )
  // insert empty p-tags before p-free dl/ol/ul block
  .replace(/^<p>(&(?!nbsp;)\w+;|\*|- -)<\/p>$/gim, "<div class=ssbr align=center>$1</div>")
  .replace(/^<p>(?:&nbsp;|\\) *<\/p>$/gim, "<div class=ssbr align=center>&nbsp;</div>")
  // convert p.ssbr to div.ssbr
//.replace(/^<p> *(\*|(?!\S *<\/p>)[ .,?!:;*+~=_$&@#%^\/<>‹›«»…†‡·•–—§¶-]+?) *<\/p>$/gim, "<div class=ssbr align=center>&puncsp;$1&puncsp;</div>")
  // nonfunctional: no test can indicate preexisting, leading escape
  .replace(/(<br *\/?>\n?) *\\?\s*(?=<\/p>$)|^(<p>)\s*\\?\s*(?=<br *\/?>)/gim, "$1$2&nbsp;")
  // replace potential \-char in par-post-br-\ or par-pre-\-br with nbsp
  .replace(h16nav, m => "<p id=subhead" + ++shct + " class=navch></p>\n")
  // insert p.navch
  .replace(h16mask, "<div$1div"); // convert p.navch + h1-6 to div.navch + h1-6
pnwrap = /=>/.test(acs.pnwrap) ? acs.pnwrap : "\"" + acs.pnwrap + (/\$&/.test(acs.pnwrap) ? "" : "$&") + "\"";
if (acs.hnwrap < 0) { acs.hnwrap = [-1, -1, -1, -1]; }
hnwrap0 = Array.isArray(acs.hnwrap) ? acs.hnwrap[0] || "" : (acs.hnwrap || "").toString();
hnwpre0 = (/.*?(?=\$`)/.exec(hnwrap0) || [""])[0];
hnwrap0 = !hnwrap0 && (!hxrlvl || !tf05[0] || !tf05[1]) ? "&loz;" : (hnwrap0).toString().replace(/.*?\$` */, "");
hnwrap0 = /=>/.test(hnwrap0) ? eval(hnwrap0)
  : hnwrap0 + (/\$[&123]/.test(hnwrap0) ? "" : "$&");
hnpatt2 = !tf05[0] || !tf05[1] || hxtoplvl < 0 ? null // hdgnbr 1st position
  : !hxlen[tf05[0]] ? () => ptchbgn[0] // #hx & no hxs
  : tf05[2] < tf05[0] && [1, 2, 3, 4, 5].slice(0, tf05[0] - 1).every(n => hxlen[n] < 2)
    ? () => chNbr(hnbgn) - 1 + hxct[tf05[0]]
  : () => chNbr(hnbgn) - 1 + navct //(chNbr(hnbgn) - 1 + navct - hxct[2] - hxct[3] - hxct[4] - hxct[5] - hxct[6])
    - ([2, 3, 4, 5, 6].slice(tf05[0] - 1).map(n => hxct[n]).reduce((a, e) => a + e) || 0);
hnpatt1 = () => hnseps[0] + ( typeof numalt === 'function' // 1st-pos alternate numeral
  ? numalt(hnpatt2()) : numalt.length ? (numalt[hnpatt2()] || hnpatt2()) : hnpatt2() );
hnpatt = !hnpatt2 ? null : () => hnpatt1() + ( tf05[1] < 2 ? "" // hdgnbr additional positions
  : [2, 3, 4, 5, 6].slice(tf05[0] - 1, tf05[0] + tf05[1] - 2)
    .map((n, i) => hnseps[1 + i] + (hxct[n] - hxct_hhx[n])).join("") ) + hnseps[hnseps.length - 1];
divinnr = () => ( acs.hnwrap[0] < 0 ? "" : hnwpre0 + "<a href=#" + chid + "><strong>" //+ "&#8203;"
  + (hxrlvl && hnpatt ? hnpatt() : "").replace(/(\\W*\\w+)(.*?)(\\d*)$|^$/, hnwrap0) + "</strong></a>" )
  + (acs.pnwrap < 0 ? "" : (i - pari_navct).toString().replace(/.*/, eval(pnwrap)));
pars = hxrlvl < 0 || hxrlvl > 6 ? [] : dcnode.querySelectorAll('p');
for (i = 0, parlen = pars.length; i < parlen; i++) { //for (let [i, pari] of pars.entries()) {
  if (/\bcolophon/i.test(pars[i].parentElement.id)
  || /\bfootnote/i.test(pars[i].parentElement.className)) { break; }
  //if (pars[i].parentElement.id === "colophon") { break; }
  if (pars[i].parentElement.nodeName !== 'PRE') {
    pars[i].innerHTML = pars[i].innerHTML.replace(/[ \n]+/g, " ") + "\n";
  }
  if ( (hnpatt || hntoc || !hxrlvl) && pars[i].className === "navch" //|| !navchlen
  && /^h\d/i.test(pnextnode = pars[i].nextElementSibling ? pars[i].nextElementSibling.nodeName : "") ) {
    navct++;
    pari_navct = i; // reset par ct initial & incr nav ct
    ///^subhead/.test(pars[i].id) && (pars[i].id = "heading" + (hnpatt ? hnpatt().replace(/\W+/g, "_") : ptchbgn[0]));
    chid = hxrlvl ? pars[i].id : chid;
    hxilvl = +/\d/.exec(pnextnode)[0];
    hxct[hxilvl]++;
    [1, 2, 3, 4, 5, 6].slice(hxilvl, tf05[0] + tf05[1] - 1).forEach(l => hxct_hhx[l] = hxct[l]);
    continue;
  }
  if ( pars[i].previousElementSibling
  && /\bmnote/i.test(pars[i].previousElementSibling.className) ) {
    annoblocks["ch" + (chNbr(hnbgn) - 1 + navct) + "par" + (i - pari_navct)] = ++mnotect;
  }
  if ( pari_navct !== null && i - pari_navct && (i - pari_navct) % acs.pnfreq === 0
  && (pars[i].previousElementSibling === null || !/\bmnote/i.test(pars[i].previousElementSibling.className)) ) {
    divnew = window.document.createElement('div');
    divnew.id = "ch" + (hxrlvl && hnpatt ? hnpatt().replace(/\W+$|^\W+/g, "").replace(/\W+/g, ".") : ptchbgn[0])
      + "par" + (i - pari_navct);
    divnew.className = "refnbr";
  //divnew.style.fontSize = "0.625em"; //x-small
  //divnew.style.lineHeight = "0.9em";
  //divnew.style.color = "silver";
  //divnew.style.maxWidth = "4em";
  //divnew.style.margin = "0 0 0 auto";
  //divnew.style.padding = "0 0.25em";
  //divnew.style.cssFloat = "right";
  //divnew.style.clear = "right";
    divnew.innerHTML = navct && chNbr(hnbgn) > 0 ? divinnr()
      : "<a href=#" + chid + "><strong>" + (hxct_hhx[3] ? "&loz;" : "Fwd") + "</strong></a>"
      + (acs.pnwrap < 0 ? "" : (i - pari_navct).toString().replace(/.*/, eval(pnwrap)));
    pcontainer = pars[i].parentElement.nodeName !== 'PRE' ? pars[i] : pars[i].parentElement;
    pcontainer.parentElement.insertBefore(divnew, pcontainer);
  }
}
if (!d1node.querySelector('.refnbr')) { //(hxrlvl < 0 || hxrlvl > 6) {
  divnew = window.document.createElement('div');
  divnew.className = "refnbr";
  divnew.style.display = "none";
  d1node.appendChild(divnew);
}
tochxs = ((tf05[2] && tf05[3]) || (tf05[0] && tf05[1])) && d1node.querySelectorAll(hdgtags.slice(
  ...(tf05[2] && tf05[3] ? [tf05[2] - 1, tf05[2] + tf05[3] - 1] : [tf05[0] - 1, tf05[0] + tf05[1] - 1])
).join()); //&& hxrlvl > 0 && hxrlvl < 7 ???
hxct = [0, 0, 0, 0, 0, 0, 0];
hxct_hhx = [0, 0, 0, 0, 0, 0, 0];
hnpatt2 = !tf05[0] || !tf05[1] || hxtoplvl < 0 ? null : !hxlen[tf05[0]] ? () => ptchbgn[0]
  : tf05[2] < tf05[0] && [1, 2, 3, 4, 5].slice(0, tf05[0] - 1).every(n => hxlen[n] < 2)
    ? () => chNbr(hnbgn) - 1 + hxct[tf05[0]] : () => chNbr(hnbgn) + +hxi
    - ([2, 3, 4, 5, 6].slice(tf05[0] - 1).map(n => hxct[n]).reduce((a, e) => a + e) || 0);
hnwrap1 = !Array.isArray(acs.hnwrap) || acs.hnwrap.length <= 1 ? "$& "
  : /=>/.test(acs.hnwrap[1]) ? eval(acs.hnwrap[1])
  : (acs.hnwrap[1] || "") + (/\$[&123]/.test(acs.hnwrap[1]) ? "" : "$& ");
hnwrap3 = !Array.isArray(acs.hnwrap) || acs.hnwrap.length <= 2
|| acs.hnwrap[3] === null || acs.hnwrap[3] === false || acs.hnwrap[3] === 0 ? ""
  : /=>/.test(acs.hnwrap[3]) ? eval(acs.hnwrap[3])
  : (acs.hnwrap[3] || "") + (/\$[&123]/.test(acs.hnwrap[3]) ? "" : "$& ");
for (hxi = 0, hxsl = tochxs && tochxs.length || 0; hxi < hxsl; hxi++) {
  hxilvlprv = +hxi ? hxilvl : hxtoplvl;
  hxilvl = +/\d/.exec(tochxs[hxi].nodeName)[0];
  hxsdiff = hxilvlprv - hxilvl;
  hxct[hxilvl]++;
  [1, 2, 3, 4, 5, 6].slice(hxilvl, tf05[0] + tf05[1] - 1).forEach(l => hxct_hhx[l] = hxct[l]);
  if (tf05[2] && tf05[3]) {
    tocbuild += ( hxsdiff >= 0 ? "</li>" + "\n</ul>\n</li>".repeat(hxsdiff)
      : +hxi && hxsdiff <= -2 ? "\n<ul>" + ("\n<li>\n<ul>").repeat(Math.abs(hxsdiff) - 1)
      : (+hxi ? "\n<ul>" : "\n<li>\n<ul>").repeat(Math.abs(hxsdiff)) )
    + "\n<li>"
    + ( !dcwrap ? "" : "<a href=\"#" + (tochxs[hxi].previousElementSibling.id || tochxs[hxi].id) + "\">" )
    + ( hntoc && hnpatt && hxilvl >= tf05[0] && hxilvl < tf05[0] + tf05[1]
      && (typeof acs.hnwrap[1] !== 'number' || acs.hnwrap[1] >= 0) ? (hnpatt() || "")
        .replace(typeof hnwrap1 === 'function' || /\$[&123]/.test(acs.hnwrap[1]) ? /^$/ : /(?:\W+0)+$/, "")
        .replace(/(\W*\w+)(.*?)(\d*)$/, hnwrap1) : "" )
    + ( dcwrap ? "" : "<a href=\"#" + (tochxs[hxi].previousElementSibling.id || tochxs[hxi].id) + "\">" )
    + tochxs[hxi].innerHTML.replace(/<\/?a\b.*?>/g, "") + "</a>";
  }
  if (hnwrap3 && hnpatt && hxilvl >= tf05[0] && (typeof acs.hnwrap[3] !== 'number' || acs.hnwrap[3] >= 0)) {
    tochxs[hxi].innerHTML = (hnpatt() || "") //&& hxilvl < tf05[0] + tf05[1]
    .replace(typeof hnwrap3 === 'function' || /\$[&123]/.test(acs.hnwrap[3]) ? /^$/ : /(?:\W+0)+$/, "")
    .replace(/(\W*\w+)(.*?)(\d*)$/, hnwrap3) + tochxs[hxi].innerHTML;
  }
}
tocbuild = !tocbuild ? ""
  : (!dcwrap ? "" : '<aside class="container is-inline-block-mobile">\n')
  + '<nav id="TOC" class="toc' + (!dcwrap ? "" : ' menu is-pulled-right is-relative') + '">\n'
  + (!dcwrap ? "" : '<p class="menu-label">Page Contents</p>\n')
  + "<ul" + (!dcwrap ? '>' : ' class="menu-list">') + tocbuild.replace(/^<\/li>/, "") + '</li>'
  + '\n</ul>\n</li>'.repeat(hxilvl - hxtoplvl)
  + '\n</ul>\n</nav>\n' + (!dcwrap ? "" : '</aside>\n');
}

function annosXlink() {
  let mnotebqs = window.document.querySelectorAll('.mnote'), prt, xlink;
  mnotebqs.forEach(mnbq => { mnbq.innerHTML = mnbq.innerHTML
    .replace(/\b(?:ch.?)? ?(\d+),? ?(?:par.?|:) ?(\d+)\b(?! *<\/a>)/gi, (msub, cs1, cs2) => {
      prt = acs.ptchbgn.findIndex( (ptch, i) => +i && cs1 >= chNbr(ptch)
        && (!acs.ptchbgn[+i + 1] || cs1 < acs.ptchbgn[+i + 1]) );
      +prt < 0 || ( xlink = +prt !== acs.ptchbgn[0] ? acs.ptfnm[0] + acs.ptchbgn[prt] + " target=_blank"
        : "#annoblock" + annoblocks["ch" + cs1 + "par" + cs2] );
      return /\d+$|\.html?$/i.test(xlink) ? "<a href=" + xlink + ">" + msub + "</a>" : msub || "";
    });
  });
}
/*
  for (let i = 0, l = mnotebqs.length; i < l; i++) {
    mnotebqs[i].innerHTML = mnotebqs[i].innerHTML
    .replace( /\b(?:ch.?)? ?(\d+),? ?(?:par.?|:) ?(\d+)\b(?! *<\/a>)/gi, (ssm, ssc1, ssc2) =>
      for (pt in acs.ptchbgn) {
        if ( +pt && ssc1 >= chNbr(acs.ptchbgn[pt])
        && (!acs.ptchbgn[+pt + 1] || ssc1 < acs.ptchbgn[+pt + 1]) ) {
          xlink = +pt !== acs.ptchbgn[0] ? acs.ptfnm[0] + acs.ptfnm[pt]
            : "#annoblock" + annoblocks["ch" + ssc1 + "par" + ssc2];
          target = +pt !== acs.ptchbgn[0] ? " target=_blank" : "";
          break;
        }
      }
*/

function annosHilit(docmdfd) {
  let acolor, aptys, atag,
    colordflts = {span: "", mark: ".ye6", strong: "", em: "", s: "", ins: ""},
    isregx, refnc, sepatt, tagdflt = "mark";
  acs.texthl.forEach(txt => {
    aptys = /{ *([*+=_~]*) *([#.]?\w*|\\#[0-9a-f]{3,6})}$/.exec(txt) || ["", "", ""];
    aptys[3] = typeof txt !== 'string' ? "" : txt.replace(/ *{[ *+=_~]*\\?[#.]?\w*}$/, "");
    atag = (isregx = txt instanceof window.RegExp) ? tagdflt
      : !aptys[1] || /^==$/.test(aptys[1]) ? "mark"
      : /^\*\*$|^__$/.test(aptys[1]) ? "strong"
      : /^[*_]$/.test(aptys[1]) ? "em"
      : /^~~$/.test(aptys[1]) ? "s"
      : /^\+\+$/.test(aptys[1]) ? "ins"
      : "span"; //e.g. /^=$/.test(aptys[1])
    acolor = aptys[2] || colordflts[atag];
    acolor = /^#/i.test(acolor) ? " id=" + acolor.replace(/^#/, "") //(?![0-9a-f]{3,4}$|[0-9a-f]{6,6}$)
      : /^\./.test(acolor) ? " class=" + acolor.replace(/^\./, "")
      : acolor ? " style=\"background: " + acolor.replace(/^\\/, "") + ";\"" : "";
    sepatt = atag === "ins" && aptys[3]
      ? eval(sepatt.toString().replace(/(?=(?:\(\?=.*?\)|)\/[gim]*$)/, "<\\/\\w+>"))
      : isregx ? txt : !aptys[3] ? /^$/ : !texthl ? aptys[3] : new window.RegExp(aptys[3]);
      //("\\b" + aptys[3] + "\\b", "gi")
    refnc = atag === "ins" ? ( !aptys[3] ? "$&" : "$& <ins" + (acolor || " class=mnote") + ">"
      + (!mdit ? aptys[3] : mdit.renderInline(aptys[3])).replace(/\\n/g, "\n") + "</ins>" )
      : isregx || !texthl ? "<" + atag + acolor + ">$&</" + atag + ">"
      : (...args) => "<" + atag + acolor + ">" + ( args.slice(1, args.length - 2)
          .map((e, i) => e + (i%2 ? "<" + atag + acolor + ">" : "</" + atag + ">")).join("") || args[0] )
        + "</" + atag + ">";
    docmdfd = docmdfd.replace(sepatt, refnc);
    if (/^{[ *+=_~]*\\?[#.]?\w*}$/.test(txt)) {
      colordflts[atag] = aptys[2];
      if (atag !== "ins") tagdflt = atag;
    }
  });
  !window.annos || !window.annos.configs || (window.annos.configs.texthl = []);
  return docmdfd
  .replace(/(<(?=!--|<[eims]|\/?[a-z])[^\n<>]*)<(em|ins|mark|s|span|strong)\b[^\n<>]*>(.*?)<\/\2>(?=[^\n<>]*>)/g, "$1$3");
}

if (!Array.isArray(acs.texthl) && acs.texthl) { texthl = acs.texthl;
} else { texthl = (d1node.innerHTML.match(sepahlwr) || ["", ""])[1]; }
texthl = texthl.replace(/(?: +|^)\/\/.*| +$|^ +/gm, "").replace(/(\\n)\n(?=.)/g, "$1")
.replace(/[^\n\v](?=\n.)/gm, "$&\n").replace(/\v$/gm, "")
.replace( sepahlmc, (m, c1, c2) => !c2 ? m : c1 + "\n(" + c2.trim()
  .replace(/(?=[$().?[\\{|])/g, "\\") // escape 9/12 md chars
  .replace(/(\*\*?|__?)(\*\*?|__?|)(.+?)\2\1/g, "(?:<(?:em|strong)>){1,2}$3(?:</(?:em|strong)>){1,2}")
  .replace(/( |^)==(.+?)==(?=[^\w=])/gm, "$1<mark>$2</mark>")
  .replace(/( |^)~~(.+?)~~(?=[^\w~])/gm, "$1<s>$2</s>")
  .replace(/( |^)\+\+(.+?)\+\+(?=[^\w+])/gm, "$1<ins>$2</ins>")
  .replace(/( |^)(`+)(.+?)\2(?=[^\w`])/gm, "$1<code>$3</code>")
  .replace(/~(\w+)~/g, "<sub>$1</sub>")
  .replace(/\^(\w+)\^/g, "<sup>$1</sup>")
  .replace(/(?=[*+^])/g, "\\") // escape 3/12 md chars
  .replace(/[ \u2008-\u200b]*(?:---?|\u2014)[ \u2008-\u200b]*/g, "[\\x20\\u2008-\\u200b\\u2014-]+")
  .replace(/[\t ]+/g, "\\s+").replace(/["'‘’“”]/g, "[\"'‘’“”]")
  .replace(/\n/g, ")(.*?)(") + ")" ).replace(/\n\n+/g, "\n").trim();
if (!Array.isArray(acs.texthl) || !acs.texthl.length) { //(/(?:[^\\]|^)(?:\\\\)*\\(?!\\)/g, "$&\\")
  acs.texthl = !texthl ? [] : texthl.split("\n").map(e => !/^\/.+\/[gim]*$/.test(e) ? e : eval(e) || e);
}
d1node.innerHTML = d1node.innerHTML.replace(/<!-- *(?:\/\/ *)?(?:anno|text)[^]*?-->\n?/gi, "");
d1node.normalize();
hljsSetup();
htmlperiphs = d1node.innerHTML.match(sepaperiph) || []; // preserve periph
d1node.innerHTML = d1node.innerHTML.replace(sepaperiph, "<!--phold-periph-->"); // placehold periph
//if (typeof acs.tocfmt !== 'number' || acs.tocfmt >= 0) { refNbrAssign(); }
if (!d1node.querySelector('.refnbr')) {
  !(window.editorApp || window.ecodc1)
  || window.console.log("App detected. Applying ebook-annos-fns to render.");
  refNbrAssign();
  annosXlink();
}
d1node.innerHTML = annosHilit(d1node.innerHTML);
if (!d1node.querySelector('#TOC') && tocbuild) { // insert toc
  d1node.innerHTML = d1node.innerHTML
  .replace( /^\n*((?:<main\b.*?>\n+|)(?:<hr\b.*?>\n+|<figure\b.*?>.*?<\/figure>\n+))(?=(?:<(?!hr\b|figure\b).*\n|\n)*?(?:<(?:div|p)\b.*? class=['"]?navch\b.*?>|<h([123])\b.*?>.*?<\/h\2>))|^(?=<(?:div|p)\b.*? class=['"]?navch\b.*?>)/im,
    "\n" + tocbuild + "\n$1" ); //<div style=\"display: none;\">\\newpage </div>\n\n" );
}
d1node.innerHTML = d1node.innerHTML.replace(/<!--phold-periph-->/gi, () => htmlperiphs[pei++]); // restore periph
if (!Array.from(dstyles).some(s => /#TOC\b/.test(s.innerHTML) && /\.refnbr\b/.test(s.innerHTML))) {
  stylenew = window.document.createElement('style');
  stylenew.setAttribute('type', 'text/css');
  stylenew.innerHTML = ( !dcwrap ? ""
    : '\n@media print, (min-width: 685px) { #TOC.is-pulled-right { width: 321px; } }'
    + '\n#TOC.is-relative { z-index: 11; }'
    + '\n.hljs, pre.hljs { padding: 0; background: none; }' )
  + '\n.ssbr { clear: right; color: DarkGrey; margin: 1em 0; text-align: center; }'
  + '\n.navch, p.navch { margin: 0; padding: 0; }'
  + '\n.refnbr { clear: right; float: right; color: DarkGrey; font-size: 0.625em; line-height: 0.9em; margin: 0 0 0 auto; padding: 0 0.25em; text-align: right; user-select: none; }'
  + '\n.mnote, ins.mnote { box-sizing: border-box; clear: right; float: right; background: Ivory; color: Peru; font: normal x-small Helvetica, Arial, sans-serif; width: 304px; margin: 0 8px 8px; padding: 0.5em; box-shadow: 0 4px 8px LightGrey; text-decoration: none; user-select: none; white-space: pre-wrap; }\n';
  //+ ".refnbr a:link, .refnbr a:visited { color: LightSteelBlue; text-decoration: none; }\n";
  dstyle0 = Array.from(d1node.childNodes).find(n => n.localName === 'style');
  masthd = d1node.querySelector('#header') || d1node.querySelector('#title')
  || window.document.querySelector(d1wrap + dcwrap + '>header')
  || window.document.querySelector(d1wrap + dcwrap + '>h1');
  dstyle0 || masthd ? d1node.insertBefore(stylenew, dstyle0 || masthd)
  : (!(window.editorApp || window.ecodc1) && window.document.head || d1node).appendChild(stylenew);
  !window.ecodc2 || window.ecodc2.mnTog();
}
};

let rstate = window.document.readyState,
  elemsscript = window.editorApp
    ? window.document.querySelector('#esrender_42qz0xfp').querySelectorAll('script')
    : window.ecodc1
    ? window.document.querySelector('#ecorender').querySelectorAll('script')
    : window.document.body.querySelectorAll('script'),
  afnccalled = window.NodeList.prototype.isPrototypeOf(elemsscript)
    && Array.from(elemsscript).some(e => /\bannos\.fns\b/.test(e.innerHTML));
//window.console.log("marker4: " + rstate);
if (rstate === 'loading' || rstate === 'uninitialized') {
  if (!window.onload) { window.onload = window.annos.fns;
  } else if (window.onload !== window.annos.fns && !/\bannos\.fns\b/.test(window.onload.toString())) {
    window.setTimeout(window.annos.fns, 2500); }
} else if (!afnccalled) { window.annos.fns(); }
  //if (rstate === 'complete' || rstate === 'interactive' || rstate === 'loaded')
  //&& Object.keys(window.annos.configs).length
})();
