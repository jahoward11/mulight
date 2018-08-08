/**
 * HTML/Javascript CSI e-book annotations functions
 * Copyright (c) 2018 J.A. Howard | github.com/jahoward11
 */

(function () { //let rstate
window.annos = window.annos || { configs: {} };
//if (window.annos.fns) return;

window.annos.fns = window.annos.fns || function x(cfgs) {
'use strict';

let a = window.annos && window.annos.configs && window.annos || { configs: {} },
  acs = a.configs,
  annoblocks = [], //refNbrAssign, annosXlink
  dcontainer = window.editorApp ? "#render_div_42qz0xfp" : "body",
  dcnode = window.document.querySelector(dcontainer),
  dstyle = dcnode.querySelectorAll('style') || [],
  htmlperiphs, pei = 0,
  sepatthl = /<!-- *(?:annotations-hili|annoshl|texthl).*\n*([^]*?)\n*-->/i,
  sepatthlblk = /((?:\n|^)(?:{[ *+=_~]*\\?[#.]?\w*}|)\n|^)(?!{[ *+=_~]*\\?[#.]?\w*})([^]+?)(?=(?:{[ *+=_~]*\\?[#.]?\w*}|)(?:\n\n|$)|\n{[ *+=_~]*\\?[#.]?\w*}(?:\n|$))/g,
  sepattperiphs = /<!--[^]*?-->|<(script|style)\b.*?>[^]*?<\/\1>/gi,
  stylenew, texthl,
  tocbuild = ""; //refNbrAssign, annos.fns
acs = {
  ptfnm: cfgs && cfgs.ptfnm || acs.ptfnm || ["part", "1"],
  ptchbgn: cfgs && Array.isArray(cfgs.ptchbgn) && cfgs.ptchbgn
    || Array.isArray(acs.ptchbgn) && acs.ptchbgn || [1, 1],
  tocfmt: cfgs && cfgs.tocfmt || acs.tocfmt || ( cfgs && cfgs.tocfmt === "" || acs.tocfmt === "" ? ""
    : cfgs && cfgs.tocfmt === 0 || acs.tocfmt === 0 ? "0" : null ),
  hnwrap: cfgs && cfgs.hnwrap || acs.hnwrap || "",
  pnwrap: cfgs && cfgs.pnwrap || acs.pnwrap || (cfgs && cfgs.pnwrap === "" || acs.pnwrap === "" ? "" : "<br />"),
  pnfreq: cfgs && cfgs.pnfreq > 0 && cfgs.pnfreq || acs.pnfreq > 0 && acs.pnfreq
    || (cfgs && cfgs.pnfreq <= 0 || acs.pnfreq <= 0 ? 0 : 5),
  numalt: cfgs && cfgs.numalt || acs.numalt || [], //["Zeroth", "First", "Second", "Third"],
  texthl: cfgs && cfgs.texthl || acs.texthl || []
};


function chNbr(chnbru) { //refNbrAssign, annosXlink
  return (acs.ptchbgn[1] > 1) ? chnbru - (100 * acs.ptchbgn[0]) : chnbru;
}


function hljsSetup() {
  let codeblocks = window.document.querySelectorAll('code'),
    pcode, prenew;
  codeblocks.forEach(cbi => {
    pcode = cbi.parentNode;
    if (pcode.parentNode.nodeName !== 'PRE' && pcode.childNodes.length === 1
      && (pcode.nodeName === 'P' || pcode.nodeName === 'PRE')) {
      if (window.hljs) { window.hljs.highlightBlock(cbi); }
      // NOCS generates P>CODE. Markdownit generates PRE>CODE.
      // Transform either one to PRE>P>CODE.
      prenew = window.document.createElement('pre');
      prenew.innerHTML = "<p>" + pcode.innerHTML + "</p>";
      pcode.parentNode.replaceChild(prenew, pcode);
    }
  }); //hljs.initHighlighting();
}


function refNbrAssign() {
let hnbgn = acs.ptchbgn[acs.ptchbgn[0]],
  numalt = acs.numalt,
  ptchbgn = acs.ptchbgn,
  tocfmt = typeof acs.tocfmt !== 'number' ?  acs.tocfmt
    : (Number.isInteger(acs.tocfmt) && acs.tocfmt > 0 ? acs.tocfmt.toString() : "");
let chid = dcnode.querySelector('#header') ? "header" : "top",
  divnew, divinnr, h16mask, h16nav,
  hdgtags = [':not(td):not(th)>h1:not(.title)', ':not(td):not(th)>h2:not(.title):not(.author)', ':not(td):not(th)>h3:not(.date)', ':not(td):not(th)>h4', ':not(td):not(th)>h5', ':not(td):not(th)>h6'],
  //hdgtags = ['h1:not(.title)', 'h2:not(.title):not(.author)', 'h3:not(.date)', 'h4', 'h5', 'h6'],
  hnpatt, hnpatt1, hnpatt2, hnseps,
  hntoc = 1,
  hnwpre0, hnwrap0, hnwrap1, hnwrap3, hxchlvl,
  htable = dcnode.querySelectorAll('td>h1, td>h2, td>h3, td>h4, td>h5, td>h6, th>h1, th>h2, th>h3, th>h4, th>h5, th>h6'),
  htitle = (dcnode.querySelectorAll('h1, h2') || [null])[0],
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
if (!navchlen) { htable.forEach(ht => ht.className = "htable"); }
if (!navchlen && htitle && !/\btitle\b/i.test(htitle.className)) { htitle.className = "title"; }
hxlen = [0].concat(hdgtags.map(e => dcnode.querySelectorAll(e).length));
if (!hxlen.some(e => e)) {
  let p0 = dcnode.querySelector('p');
  p0.parentNode.insertBefore(window.document.createElement('h3'), p0);
}
hxtoplvl = hxlen.findIndex(l => l);
tf0auto = hxtoplvl < 0 ? 0 : [1, 2, 3, 4, 5, 6].find(n => hxtoplvl <= n && hxlen[n] > 1) || 0;
tf1auto = !tf0auto ? 0 : hxlen[3] && tf0auto <= 2 ? 4 - tf0auto : hxlen[2] && tf0auto <= 1 ? 2 : 1;
tf05 = (Array.isArray(tocfmt) && tocfmt[0] !== null && tocfmt[1] !== null) ? tocfmt.slice(0, 6)
    .concat([tocfmt[0], tocfmt[1], null, null].slice(tocfmt.length < 6 ? tocfmt.length - 2 : 4))
    .map(e => e === null ? null : !+e || !Number.isInteger(+e) || +e < 0 ? 0 : +e)
  : (typeof tocfmt !== 'string' || /^auto/i.test(tocfmt))
    ? [tf0auto, tf1auto, hxtoplvl < 0 ? 0 : hxtoplvl, (tf1auto + tf0auto || hxtoplvl) - hxtoplvl, null, null]
  : tocfmt.replace(/^[^e]+$/i, m => m.replace(/#/g, "e"))
    .replace( /^.*?e[cr]*h?([1-6]).*$|^[^eh]*?([1-6])[^eh]*[er]*$|.*/i, (m, f1, f2) =>
    (f1 ? f1 + m.replace(/[er]+$|[^e]+/gi, "").length.toString()
      : f2 ? f2 + m.replace(/[^1-6]+/g, "").length.toString() : "00")
    + m.replace(/^.*?h([1-6]).*$|.*/i, (sm, sf1) =>
      sf1 ? sf1 + sm.replace(/h0|[^h]+/gi, "").length.toString() : "00")
    + (/cr?h?(\d)/i.exec(m) || ["", "_"])[1] + (/re*$/i.test(m) ? "7"
      : (/rc?h?(\d)/i.exec(m) || ["", "_"])[1]) ).split("").map(e => e === "_" ? null : +e);
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
if (hxrlvl && (!tf05[0] || !tf05[1])) { hntoc--;
  if (tf05[2] && tf05[3] && hxrlvl >= tf05[2]) { tf05[0] = tf05[2]; tf05[1] = hxrlvl - tf05[2] + 1;
  } else { tf05[0] = hxrlvl; tf05[1] = 1; }
}
if (tf05[0] && tf05[1] && tf05[2] && tf05[3] && (tf05[2] > tf05[0] || tf05[3] < tf05[1])) {
  tf05[2] = tf05[0]; tf05[3] = tf05[1];
  hnseps = [""].concat(".".repeat((tf05[1] || tf05[3] || 1) - 1).split(""))
    .concat(tf05[1] === 1 || !tf05[1] && tf05[3] === 1 ? ["."] : [""]);
}
h16nav = !hxrlvl ? new RegExp("^(?=<h(?![1-6] class=['\"]?htable|[12] class=['\"]?title)[1-6].*?>)", "im")
  : !navchlen ? new RegExp("^(?=<h(?![1-6] class=['\"]?htable|[12] class=['\"]?title)[0-"
    + (hxrlvl >= tf05[2] + tf05[3] ? hxrlvl : (tf05[2] + tf05[3] || 1) - 1) + "].*?>)", "gim")
  : (hxrlvl > hxchlvl) ? new RegExp("^(?=<h(?![1-6] class=['\"]?htable|[12] class=['\"]?title)["
    + (hxchlvl + 1) + "-" + hxrlvl + "].*?>)", "gim") : /^$/;
h16mask = new RegExp("^<p"
  + (hxrlvl > 0 && (tf05[2] || tf05[0]) && tf0auto && (tf05[2] || tf05[0]) >= tf0auto ? "" : "(?! id=subhead1 )")
  + "(.*?class=['\"]?navch\\b.*?>.*?<\\/)p(?=>\\s*<h[0-" + ( hxrlvl <= 0 ? 6 : hxrlvl < tf05[2] ? hxrlvl - 1
    : tf05[2] && tf05[3] && tf0auto && tf05[2] >= tf0auto ? tf05[2] - 1 : tf05[0] ? tf05[0] - 1 : 0 )
  + (hxrlvl > 0 && hxrlvl < 7 ? (hxrlvl + 1) + "-7" : "")
  + "].*?>|>\\s*<p.*?class=['\"]?navch\\b.*?>)", "gim");
dcnode.innerHTML = dcnode.innerHTML
//.replace(/<p><\/p>(<blockquote.+?\/blockquote>)/gi, "$1\n<p>").replace(/<p>(?=<\/p>)/gi, "");
  .replace( /^<(?!\/?li>|\/?[dou]l>)\/?\b.+\n(?=<([dou]l)(?:[^](?!<p>))+?<\/\1>(?!\n<\/?li>|\n<\/?[dou]l>))/gim,
    "$&<p style=\"display: none;\"></p>\n" )
  // insert empty p-tags before p-free ol/ul block
  .replace(/^<p>(?:(&\w+;|\*|- -)|\\)<\/p>$/gim, "<div class=ssbr align=center>$1</div>")
  // convert p.ssbr to div.ssbr
//.replace(/^<p> *(\*|(?!\S *<\/p>)[ .,?!:;*+~=_$&@#%^\/<>‹›«»…†‡·•–—§¶-]+?) *<\/p>$/gim, "<div class=ssbr align=center>&puncsp;$1&puncsp;</div>")
  // nonfunctional: no test can indicate preexisting, leading escape
  .replace(/(<br *\/?>\n?) *\\?\s*(?=<\/p>$)|^(<p>)\s*\\?\s*(?=<br *\/?>)/gim, "$1$2&nbsp;")
  // replace potential \-char in par-post-br-\ or par-pre-\-br with nbsp
  .replace( h16nav, m => "<p id=subhead" + ++shct + " class=navch style=\"margin: 0; padding: 0;\"></p>\n" )
  // insert p.navch
  .replace(h16mask, "<div$1div"); // convert p.navch + h1-6 to div.navch + h1-6
pnwrap = /=>/.test(acs.pnwrap) ? acs.pnwrap : "\"" + acs.pnwrap + (/\$&/.test(acs.pnwrap) ? "" : "$&") + "\"";
if (acs.hnwrap < 0) { acs.hnwrap = [-1, -1, -1, -1]; }
hnwrap0 = Array.isArray(acs.hnwrap) ? acs.hnwrap[0] || "" : (acs.hnwrap || "").toString();
hnwpre0 = (/.*?(?=\$`)/.exec(hnwrap0) || [""])[0];
hnwrap0 = (!hnwrap0 && (!hxrlvl || !tf05[0] || !tf05[1])) ? "&loz;" : (hnwrap0).toString().replace(/.*?\$` */, "");
hnwrap0 = /=>/.test(hnwrap0) ? window.eval(hnwrap0)
  : hnwrap0 + (/\$[&123]/.test(hnwrap0) ? "" : "$&");
hnpatt2 = (!tf05[0] || !tf05[1] || hxtoplvl < 0) ? null // hdgnbr 1st position
  : !hxlen[tf05[0]] ? () => ptchbgn[0] // #hx & no hxs
  : tf05[2] < tf05[0] && [1, 2, 3, 4, 5].slice(0, tf05[0] - 1).every(n => hxlen[n] < 2)
    ? () => chNbr(hnbgn) - 1 + hxct[tf05[0]]
  : () => chNbr(hnbgn) - 1 + navct //(chNbr(hnbgn) - 1 + navct - hxct[2] - hxct[3] - hxct[4] - hxct[5] - hxct[6])
    - ([2, 3, 4, 5, 6].slice(tf05[0] - 1).map(n => hxct[n]).reduce((a, e) => a + e) || 0);
hnpatt1 = () => hnseps[0] + ( typeof numalt === 'function' // 1st-pos alternate numeral
  ? numalt(hnpatt2()) : numalt.length ? (numalt[hnpatt2()] || hnpatt2()) : hnpatt2() );
hnpatt = !hnpatt2 ? null : () => hnpatt1() + ( (tf05[1] < 2) ? "" // hdgnbr additional positions
  : [2, 3, 4, 5, 6].slice(tf05[0] - 1, tf05[0] + tf05[1] - 2)
    .map((n, i) => hnseps[1 + i] + (hxct[n] - hxct_hhx[n])).join("") ) + hnseps[hnseps.length - 1];
divinnr = () => ( acs.hnwrap[0] < 0 ? "" : hnwpre0 + "<a href=#" + chid + "><strong>" //+ "&#8203;"
  + (hxrlvl && hnpatt ? hnpatt() : "").replace(/(\\W*\\w+)(.*?)(\\d*)$|^$/, hnwrap0) + "</strong></a>" )
  + (acs.pnwrap < 0 ? "" : (i - pari_navct).toString().replace(/.*/, window.eval(pnwrap)));
pars = (hxrlvl < 0 || hxrlvl > 6) ? [] : dcnode.querySelectorAll('p');
for (i = 0, parlen = pars.length; i < parlen; i++) { //for (let [i, pari] of pars.entries()) {
  if (/\bcolophon/i.test(pars[i].parentNode.id)
  || /\bfootnote/i.test(pars[i].parentNode.className)) { break; }
  //if (pars[i].parentNode.id === "colophon") { break; }
  if (pars[i].parentNode.nodeName !== 'PRE') {
    pars[i].textContent = pars[i].textContent.replace(/[ \n]+/g, " ") + "\n";
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
    divnew.style.margin = "0 0 0 auto";
    divnew.style.padding = "0 0.5em";
    divnew.style.cssFloat = "right";
  //divnew.style.clear = "right";
    divnew.innerHTML = (navct && chNbr(hnbgn) > 0) ? divinnr()
      : "<a href=#" + chid + "><strong>" + (hxct_hhx[3] ? "&loz;" : "Fwd") + "</strong></a>"
      + (acs.pnwrap < 0 ? "" : (i - pari_navct).toString().replace(/.*/, window.eval(pnwrap)));
    pcontainer = (pars[i].parentNode.nodeName !== 'PRE') ? pars[i] : pars[i].parentNode;
    pcontainer.parentNode.insertBefore(divnew, pcontainer);
  }
}
tochxs = ((tf05[2] && tf05[3]) || (tf05[0] && tf05[1])) && dcnode.querySelectorAll(hdgtags.slice(
  ...(tf05[2] && tf05[3] ? [tf05[2] - 1, tf05[2] + tf05[3] - 1] : [tf05[0] - 1, tf05[0] + tf05[1] - 1])
  ).join());
hxct = [0, 0, 0, 0, 0, 0, 0];
hxct_hhx = [0, 0, 0, 0, 0, 0, 0];
hnpatt2 = (!tf05[0] || !tf05[1] || hxtoplvl < 0) ? null : !hxlen[tf05[0]] ? () => ptchbgn[0]
  : tf05[2] < tf05[0] && [1, 2, 3, 4, 5].slice(0, tf05[0] - 1).every(n => hxlen[n] < 2)
    ? () => chNbr(hnbgn) - 1 + hxct[tf05[0]] : () => chNbr(hnbgn) + +hxi
    - ([2, 3, 4, 5, 6].slice(tf05[0] - 1).map(n => hxct[n]).reduce((a, e) => a + e) || 0);
hnwrap1 = !Array.isArray(acs.hnwrap) || acs.hnwrap.length <= 1 ? "$& "
  : /=>/.test(acs.hnwrap[1]) ? window.eval(acs.hnwrap[1])
  : (acs.hnwrap[1] || "") + (/\$[&123]/.test(acs.hnwrap[1]) ? "" : "$& ");
hnwrap3 = !Array.isArray(acs.hnwrap) || acs.hnwrap.length <= 2
|| acs.hnwrap[3] === null || acs.hnwrap[3] === false || acs.hnwrap[3] === 0 ? ""
  : /=>/.test(acs.hnwrap[3]) ? window.eval(acs.hnwrap[3])
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
    + "\n<li>" + ( hntoc && hnpatt && hxilvl >= tf05[0] && hxilvl < tf05[0] + tf05[1]
      && (typeof acs.hnwrap[1] !== 'number' || acs.hnwrap[1] >= 0) ? (hnpatt() || "")
        .replace(typeof hnwrap1 === 'function' || /\$[&123]/.test(acs.hnwrap[1]) ? /^$/ : /(?:\W+0)+$/, "")
        .replace(/(\W*\w+)(.*?)(\d*)$/, hnwrap1) : "" )
    + "<a href=\"#" + (tochxs[hxi].previousElementSibling.id || tochxs[hxi].id) + "\">"
    + tochxs[hxi].innerHTML.replace(/<\/?a\b.*?>/g, "") + "</a>";
  }
  if (hnwrap3 && hnpatt && hxilvl >= tf05[0] && (typeof acs.hnwrap[3] !== 'number' || acs.hnwrap[3] >= 0)) {
    tochxs[hxi].innerHTML = (hnpatt() || "") //&& hxilvl < tf05[0] + tf05[1]
    .replace(typeof hnwrap3 === 'function' || /\$[&123]/.test(acs.hnwrap[3]) ? /^$/ : /(?:\W+0)+$/, "")
    .replace(/(\W*\w+)(.*?)(\d*)$/, hnwrap3) + tochxs[hxi].innerHTML;
  }
}
tocbuild = !tocbuild ? ""
  : "<nav id=\"TOC\" class=toc>\n<ul>" + tocbuild.replace(/^<\/li>/, "") + "</li>"
  + "\n</ul>\n</li>".repeat(hxilvl - hxtoplvl)
  + "\n</ul>\n</nav>\n";
}


function annosXlink() {
  let mnotebqs = window.document.querySelectorAll('.mnote'), prt, xlink;
  mnotebqs.forEach(mnbq => { mnbq.innerHTML = mnbq.innerHTML
    .replace(/\b(?:ch.?)? ?(\d+),? ?(?:par.?|:) ?(\d+)\b(?! *<\/a>)/gi, (sm, sf1, sf2) => {
      prt = acs.ptchbgn.findIndex( (ptch, i) => +i && sf1 >= chNbr(ptch)
        && (!acs.ptchbgn[+i + 1] || sf1 < acs.ptchbgn[+i + 1]) );
      +prt !== -1 && ( xlink = +prt !== acs.ptchbgn[0] ? acs.ptfnm[0] + acs.ptchbgn[prt] + " target=_blank"
        : "#annoblock" + annoblocks["ch" + sf1 + "par" + sf2] );
      return /\d+$|\.html?$/i.test(xlink) ? "<a href=" + xlink + ">" + sm + "</a>" : sm || "";
    });
  });
}
/*
  for (let i = 0, l = mnotebqs.length; i < l; i++) {
    mnotebqs[i].innerHTML = mnotebqs[i].innerHTML
    .replace( /\b(?:ch.?)? ?(\d+),? ?(?:par.?|:) ?(\d+)\b(?! *<\/a>)/gi, (ssm, ssf1, ssf2) =>
      for (pt in acs.ptchbgn) {
        if ( +pt && ssf1 >= chNbr(acs.ptchbgn[pt])
        && (!acs.ptchbgn[+pt + 1] || ssf1 < acs.ptchbgn[+pt + 1]) ) {
          xlink = (+pt !== acs.ptchbgn[0]) ? acs.ptfnm[0] + acs.ptfnm[pt]
            : "#annoblock" + annoblocks["ch" + ssf1 + "par" + ssf2];
          target = (+pt !== acs.ptchbgn[0]) ? " target=_blank" : "";
          break;
        }
      }
*/


function annosHilit(docmod) {
  let acolor, aptys, atag,
    colordflts = {mark: ".ye6", strong: "", em: "", s: "", ins: "", span: ""},
    isregx, refnc, sepatt, tagdflt = "mark";
  acs.texthl.forEach(txt => {
    aptys = /{ *([*+=_~]*) *([#.]?\w*|\\#[0-9a-f]{3,6})}$/.exec(txt) || ["", "", ""];
    aptys[3] = typeof txt !== 'string' ? "" : txt.replace(/ *{[ *+=_~]*\\?[#.]?\w*}$/, "");
    atag = (isregx = txt instanceof RegExp) ? tagdflt
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
      ? window.eval(sepatt.toString().replace(/(?=(?:\(\?=.*?\)|)\/[gim]*$)/i, "<\\/\\w+>"))
      : isregx ? txt : aptys[3] ? new RegExp(aptys[3], "") : /^$/; //("\\b" + aptys[3] + "\\b", "gi")
    refnc = atag === "ins" ? (aptys[3] ? "$& <ins" + acolor + ">" + aptys[3] + "</ins>" : "$&")
      : function (...args) { return "<" + atag + acolor + ">" + ( args.slice(1, args.length - 2)
        .map((e, i) => e + (i%2 ? "<" + atag + acolor + ">" : "</" + atag + ">")).join("") || args[0] )
      + "</" + atag + ">"; }; //"<" + atag + acolor + ">$&</" + atag + ">"
    docmod = docmod.replace(sepatt, refnc);
    if (/^{[ *+=_~]*\\?[#.]?\w*}$/.test(txt)) { colordflts[atag] = aptys[2]; if (atag !== "ins") tagdflt = atag; }
  });
  window.annos && window.annos.configs && (window.annos.configs.texthl = []);
  return docmod
  .replace(/(<(?=!--|<[eims]|\/?[a-z])[^\n<>]*)<(em|ins|mark|s|span|strong)\b[^\n<>]*>(.*?)<\/\2>(?=[^\n<>]*>)/g, "$1$3");
}


if (!Array.isArray(acs.texthl) && acs.texthl.length) { texthl = acs.texthl;
} else { texthl = (dcnode.innerHTML.match(sepatthl) || ["", ""])[1]; }
texthl = texthl.replace(/(?: |^)\/\/.*/gm, "").replace( sepatthlblk, (m, f1, f2) =>
  /^\/.+\/[gim]*$|{[ *+=_~]*\\?[#.]?\w*}\n./im.test(f2) ? m //(/(?:[^\\]|^)(?:\\\\)*\\(?!\\)/g, "$&\\")
  : f1 + "(" + f2.replace(/(?=[$()*+.?[\\^{|])/g, "\\").replace(/["'‘’“”]/g, "[\"'‘’“”]")
    .replace(/[ \u2008-\u200b]*(?:---?|\u2014)[ \u2008-\u200b]*/g, "[ \\u2008-\\u200b\\u2014-]+")
    .replace(/\n/g, ")(.*?)(") + ")" ).replace(/\n\n+/g, "\n");
if (!Array.isArray(acs.texthl) || !acs.texthl.length) {
  acs.texthl = texthl.split("\n").map(e => /^\/.+\/[gim]*$/i.test(e) ? window.eval(e) : e);
}
dcnode.innerHTML = dcnode.innerHTML.replace(/<!-- *(?:\/\/ *)?(?:anno|text)[^]*?-->\n?/gi, "");
dcnode.normalize();
hljsSetup();
htmlperiphs = dcnode.innerHTML.match(sepattperiphs) || []; // preserve periph
dcnode.innerHTML = dcnode.innerHTML.replace(sepattperiphs, "<!--phold-periph-->"); // placehold periph
//if (typeof acs.tocfmt !== 'number' || acs.tocfmt >= 0) { refNbrAssign(); }
if (!dcnode.querySelector('.refnbr')) {
  if (window.editorApp) { window.alert("editorApp detected.\nApplying ebook-annos-fns to render."); }
  refNbrAssign();
  annosXlink();
}
dcnode.innerHTML = annosHilit(dcnode.innerHTML);
if (!dcnode.querySelector('#TOC') && tocbuild) { // insert toc
  dcnode.innerHTML = dcnode.innerHTML
    .replace( /^\n*(<hr\b.*?>\n+|<figure\b.*?>.*?<\/figure>\n+)(?=(?:<(?!hr\b|figure\b).*\n|\n)*<(?:div|p)\b.*? class=['"]?navch\b.*?>|<h([123])\b.*?>.*?<\/h\2>)|^(?=<(?:div|p)\b.*? class=['"]?navch\b.*?>)/im,
      "\n" + tocbuild + "\n$1<div style=\"display: none;\">\\newpage </div>\n\n" );
}
dcnode.innerHTML = dcnode.innerHTML.replace(/<!--phold-periph-->/gi, () => htmlperiphs[pei++]); // restore periph
if (!Array.from(dstyle).some(s => /\.refnbr\b/i.test(s.innerHTML))) {
  stylenew = window.document.createElement('style'); //color: Silver;
  stylenew.innerHTML = "\n.refnbr { font-size: 0.625em; line-height: 0.9em; user-select: none; }\n";
  //+ ".refnbr a:link, .refnbr a:visited { color: LightSteelBlue; text-decoration: none; }\n";
  dcnode.appendChild(stylenew);
}
};

let rstate = window.document.readyState;
//window.console.log("marker4: " + rstate);
if ( (!window.onload || window.onload !== window.annos.fns)
&& (rstate === 'loading' || rstate === 'uninitialized') ) {
  window.onload = window.annos.fns;
} else if (!window.onload && (!window.editorApp || Object.keys(window.annos.configs).length)) {
  window.annos.fns(); } //if (rstate === 'complete' || rstate === 'interactive' || rstate === 'loaded')
})();
