// 100+ Authentic Unicode text transformations and styles
// Preserves non-Latin scripts (Urdu, Arabic, Chinese, Emoji, etc.) untouched

export interface TextStyleResult {
  id: string;
  name: string;
  category: 'Serif & Sans' | 'Decorative' | 'Mathematical' | 'Enclosed' | 'Effects' | 'Gaming & Symbols';
  text: string;
}

// Maps for standard mathematical alphanumeric symbols
const BOLD_MAP: Record<string, string> = {
  a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦',
  n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
  A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌',
  N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
  '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
};

const ITALIC_MAP: Record<string, string> = {
  a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔', h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚',
  n: '𝑛', o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢', v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧',
  A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺', H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀',
  N: '𝑁', O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈', V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',
};

const BOLD_ITALIC_MAP: Record<string, string> = {
  a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎',
  n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
  A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴',
  N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
};

const SCRIPT_MAP: Record<string, string> = {
  a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂',
  n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
  A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ',
  N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵',
};

const BOLD_SCRIPT_MAP: Record<string, string> = {
  a: '𝓪', b: '𝓫', c: '𝓬', d: '𝓭', e: '𝓮', f: '𝓯', g: '𝓰', h: '𝓱', i: '𝓲', j: '𝓳', k: '𝓴', l: '𝓵', m: '𝓶',
  n: '𝓷', o: '𝓸', p: '𝓹', q: '𝓺', r: '𝓻', s: '𝓼', t: '𝓽', u: '𝓾', v: '𝓿', w: '𝔀', x: '𝔁', y: '𝔂', z: '𝔃',
  A: '𝓐', B: '𝓑', C: '𝓒', D: '𝓓', E: '𝓔', F: '𝓕', G: '𝓖', H: '𝓗', I: '𝓘', J: '𝓙', K: '𝓚', L: '𝓛', M: '𝓜',
  N: '𝓝', O: '𝓞', P: '𝓟', Q: '𝓠', R: '𝓡', S: '𝓢', T: '𝓣', U: '𝓤', V: '𝓥', W: '𝓦', X: '𝓧', Y: '𝓨', Z: '𝓩',
};

const FRAKTUR_MAP: Record<string, string> = {
  a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪',
  n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷',
  A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊', H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐',
  N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ',
};

const BOLD_FRAKTUR_MAP: Record<string, string> = {
  a: '𝖆', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌', h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒',
  n: '𝖓', o: '𝖔', p: '𝖕', q: '𝖖', r: '𝖗', s: '𝖘', t: '𝖙', u: '𝖚', v: '𝖛', w: '𝖜', x: '𝖝', y: '𝖞', z: '𝖟',
  A: '𝕬', B: '𝕭', C: '𝕮', D: '𝕯', E: '𝕰', F: '𝕱', G: '𝕲', H: '𝕳', I: '𝕴', J: '𝕵', K: '𝕶', L: '𝕷', M: '𝕸',
  N: '𝕹', O: '𝕺', P: '𝕻', Q: '𝕼', R: '𝕽', S: '𝕾', T: '𝕿', U: '𝖀', V: '𝖁', W: '𝖂', X: '𝖃', Y: '𝖄', Z: '𝖅',
};

const DOUBLE_STRUCK_MAP: Record<string, string> = {
  a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞',
  n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
  A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄',
  N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',
  '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡',
};

const MONOSPACE_MAP: Record<string, string> = {
  a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
  n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
  A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
  N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
  '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
};

const SANS_SERIF_MAP: Record<string, string> = {
  a: '𝖺', b: '𝖻', c: '𝖼', d: '𝖽', e: '𝖾', f: '𝖿', g: '𝗀', h: '𝗁', i: '𝗂', j: '𝗃', k: '𝗄', l: '𝗅', m: '𝗆',
  n: '𝗇', o: '𝗈', p: '𝗉', q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍', u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑', y: '𝗒', z: '𝗓',
  A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥', G: '𝖦', H: '𝖧', I: '𝖨', J: '𝖩', K: '𝖪', L: '𝖫', M: '𝖬',
  N: '𝖭', O: '𝖮', P: '𝖯', Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳', U: '𝖴', V: '𝖵', W: '𝖶', X: '𝖷', Y: '𝖸', Z: '𝖹',
};

const SANS_BOLD_MAP: Record<string, string> = {
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺',
  n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠',
  N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
};

const FULLWIDTH_MAP: Record<string, string> = {
  a: 'ａ', b: 'ｂ', c: 'ｃ', d: 'ｄ', e: 'ｅ', f: 'ｆ', g: 'ｇ', h: 'ｈ', i: 'ｉ', j: 'ｊ', k: 'ｋ', l: 'ｌ', m: 'ｍ',
  n: 'ｎ', o: 'ｏ', p: 'ｐ', q: 'ｑ', r: 'ｒ', s: 'ｓ', t: 'ｔ', u: 'ｕ', v: 'ｖ', w: 'ｗ', x: 'ｘ', y: 'ｙ', z: 'ｚ',
  A: 'Ａ', B: 'Ｂ', C: 'Ｃ', D: 'Ｄ', E: 'Ｅ', F: 'Ｆ', G: 'Ｇ', H: 'Ｈ', I: 'Ｉ', J: 'Ｊ', K: 'Ｋ', L: 'Ｌ', M: 'Ｍ',
  N: 'Ｎ', O: 'Ｏ', P: 'Ｐ', Q: 'Ｑ', R: 'Ｒ', S: 'Ｓ', T: 'Ｔ', U: 'Ｕ', V: 'Ｖ', W: 'Ｗ', X: 'Ｘ', Y: 'Ｙ', Z: 'Ｚ',
  '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９',
};

const CIRCLED_MAP: Record<string, string> = {
  a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ',
  n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ',
  A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ', I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ',
  N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ', Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ', Y: 'Ⓨ', Z: 'Ⓩ',
  '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
};

const SQUARED_MAP: Record<string, string> = {
  a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶', h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼',
  n: '🄽', o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄', v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉',
  A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼',
  N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉',
};

const NEGATIVE_SQUARED_MAP: Record<string, string> = {
  a: '🅰', b: '🅱', c: '🅲', d: '🅳', e: '🅴', f: '🅵', g: '🅶', h: '🅷', i: '🅸', j: '🅹', k: '🅺', l: '🅻', m: '🅼',
  n: '🅽', o: '🅾', p: '🅿', q: '🆀', r: '🆁', s: '🆂', t: '🆃', u: '🆄', v: '🆅', w: '🆆', x: '🆇', y: '🆈', z: '🆉',
  A: '🅰', B: '🅱', C: '🅲', D: '🅳', E: '🅴', F: '🅵', G: '🅶', H: '🅷', I: '🅸', J: '🅹', K: '🅺', L: '🅻', M: '🅼',
  N: '🅽', O: '🅾', P: '🅿', Q: '🆀', R: '🆁', S: '🆂', T: '🆃', U: '🆄', V: '🆅', W: '🆆', X: '🆇', Y: '🆈', Z: '🆉',
};

const SMALL_CAPS_MAP: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
  n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ꞯ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
  A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ', I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ',
  N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ꞯ', R: 'ʀ', S: 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ',
  n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ',
  P: 'ᴾ', R: 'ᴿ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
};

const SUBSCRIPT_MAP: Record<string, string> = {
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ',
  s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
};

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
  n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W',
  N: 'N', O: 'O', P: 'Ԁ', Q: 'Ò', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '1': '⥝', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
  '.': '˙', ',': "'", "'": ',', '"': '„', '!': '¡', '?': '¿', '<': '>', '>': '<', '_': '‾',
};

// Helper to map string using dictionary while preserving unmapped Unicode
function applyMap(text: string, map: Record<string, string>): string {
  return Array.from(text)
    .map((char) => map[char] || char)
    .join('');
}

// Combining Diacritics
function applyCombining(text: string, charCode: string): string {
  return Array.from(text)
    .map((char) => (char === ' ' ? ' ' : char + charCode))
    .join('');
}

// Zalgo Generator
const ZALGO_UP = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351'];
const ZALGO_DOWN = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u0330'];
const ZALGO_MID = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335'];

function generateZalgo(text: string): string {
  return Array.from(text)
    .map((char) => {
      if (char === ' ') return ' ';
      return (
        char +
        ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)] +
        ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)] +
        ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)]
      );
    })
    .join('');
}

export function generateAllStyles(input: string): TextStyleResult[] {
  const text = input.trim() || 'Hello World';
  const styles: TextStyleResult[] = [];

  // Serif & Mathematical
  styles.push({ id: 'bold', name: 'Mathematical Bold', category: 'Mathematical', text: applyMap(text, BOLD_MAP) });
  styles.push({ id: 'italic', name: 'Mathematical Italic', category: 'Mathematical', text: applyMap(text, ITALIC_MAP) });
  styles.push({ id: 'bold-italic', name: 'Bold Italic', category: 'Mathematical', text: applyMap(text, BOLD_ITALIC_MAP) });
  styles.push({ id: 'script', name: 'Cursive Script', category: 'Decorative', text: applyMap(text, SCRIPT_MAP) });
  styles.push({ id: 'bold-script', name: 'Bold Script', category: 'Decorative', text: applyMap(text, BOLD_SCRIPT_MAP) });
  styles.push({ id: 'fraktur', name: 'Gothic Fraktur', category: 'Decorative', text: applyMap(text, FRAKTUR_MAP) });
  styles.push({ id: 'bold-fraktur', name: 'Bold Gothic Fraktur', category: 'Decorative', text: applyMap(text, BOLD_FRAKTUR_MAP) });
  styles.push({ id: 'double-struck', name: 'Double Struck (Blackboard)', category: 'Mathematical', text: applyMap(text, DOUBLE_STRUCK_MAP) });
  styles.push({ id: 'monospace', name: 'Monospace Typewriter', category: 'Mathematical', text: applyMap(text, MONOSPACE_MAP) });
  styles.push({ id: 'sans-serif', name: 'Sans-Serif Clean', category: 'Serif & Sans', text: applyMap(text, SANS_SERIF_MAP) });
  styles.push({ id: 'sans-bold', name: 'Sans-Serif Bold', category: 'Serif & Sans', text: applyMap(text, SANS_BOLD_MAP) });
  styles.push({ id: 'fullwidth', name: 'Fullwidth Vaporwave', category: 'Enclosed', text: applyMap(text, FULLWIDTH_MAP) });
  styles.push({ id: 'small-caps', name: 'Small Capital Letters', category: 'Serif & Sans', text: applyMap(text, SMALL_CAPS_MAP) });
  styles.push({ id: 'superscript', name: 'Tiny Superscript', category: 'Mathematical', text: applyMap(text, SUPERSCRIPT_MAP) });
  styles.push({ id: 'subscript', name: 'Subscript Text', category: 'Mathematical', text: applyMap(text, SUBSCRIPT_MAP) });

  // Enclosed Styles
  styles.push({ id: 'circled', name: 'Bubble Circled (①)', category: 'Enclosed', text: applyMap(text, CIRCLED_MAP) });
  styles.push({ id: 'squared', name: 'White Squared ([A])', category: 'Enclosed', text: applyMap(text, SQUARED_MAP) });
  styles.push({ id: 'negative-squared', name: 'Dark Negative Squared (🅰)', category: 'Enclosed', text: applyMap(text, NEGATIVE_SQUARED_MAP) });

  // Effects & Diacritics
  styles.push({ id: 'underline', name: 'Underline Combines (t̲e̲x̲t̲)', category: 'Effects', text: applyCombining(text, '\u0332') });
  styles.push({ id: 'double-underline', name: 'Double Underline (t̳e̳x̳t̳)', category: 'Effects', text: applyCombining(text, '\u0333') });
  styles.push({ id: 'strikethrough', name: 'Strikethrough (t̶e̶x̶t̶)', category: 'Effects', text: applyCombining(text, '\u0336') });
  styles.push({ id: 'short-strike', name: 'Short Strikethrough (t̵e̵x̵t̵)', category: 'Effects', text: applyCombining(text, '\u0335') });
  styles.push({ id: 'overline', name: 'Overline (t̅e̅x̅t̅)', category: 'Effects', text: applyCombining(text, '\u0305') });
  styles.push({ id: 'double-overline', name: 'Double Overline (t̿e̿x̿t̿)', category: 'Effects', text: applyCombining(text, '\u033f') });
  styles.push({ id: 'dotted', name: 'Dotted Top (ṫėẋṫ)', category: 'Effects', text: applyCombining(text, '\u0307') });
  styles.push({ id: 'dotted-below', name: 'Dotted Below (ṭẹx̣ṭ)', category: 'Effects', text: applyCombining(text, '\u0323') });
  styles.push({ id: 'dashed', name: 'Tilde Bridge (t̃ẽx̃t̃)', category: 'Effects', text: applyCombining(text, '\u0303') });
  styles.push({ id: 'slash-through', name: 'Slash Through (t̷e̷x̷t̷)', category: 'Effects', text: applyCombining(text, '\u0337') });
  styles.push({ id: 'cross-above', name: 'Cross Marks (t̽e̽x̽t̽)', category: 'Effects', text: applyCombining(text, '\u033d') });
  styles.push({ id: 'wave-below', name: 'Wavy Underscore (t̰ḛx̰t̰)', category: 'Effects', text: applyCombining(text, '\u0330') });
  styles.push({ id: 'rings-above', name: 'Rings Halo (t̊e̊x̊t̊)', category: 'Effects', text: applyCombining(text, '\u030a') });
  styles.push({ id: 'arrows-above', name: 'Vector Arrows (t⃗e⃗x⃗t⃗)', category: 'Effects', text: applyCombining(text, '\u0344') });
  styles.push({ id: 'glitch-zalgo', name: 'Glitch / Zalgo Corrupted', category: 'Effects', text: generateZalgo(text) });

  // Orientation & Inversions
  styles.push({ id: 'upside-down', name: 'Upside Down & Flipped', category: 'Effects', text: Array.from(applyMap(text, UPSIDE_DOWN_MAP)).reverse().join('') });
  styles.push({ id: 'reversed', name: 'Reversed Characters', category: 'Effects', text: Array.from(text).reverse().join('') });
  styles.push({ id: 'spaced', name: 'Aesthetic Spaced (W I D E)', category: 'Decorative', text: Array.from(text).join(' ') });
  styles.push({ id: 'extra-spaced', name: 'Ultra Spaced (W  I  D  E)', category: 'Decorative', text: Array.from(text).join('  ') });

  // Decorative & Aesthetic Frames
  styles.push({ id: 'sparkle-frame', name: '✨ Sparkle Magic ✨', category: 'Decorative', text: `✨ ${text} ✨` });
  styles.push({ id: 'aesthetic-cherry', name: '🌸 Cherry Blossom 🌸', category: 'Decorative', text: `🌸 ${text} 🌸` });
  styles.push({ id: 'aesthetic-hearts', name: '💖 Loving Hearts 💖', category: 'Decorative', text: `💖 ${text} 💖` });
  styles.push({ id: 'aesthetic-stars', name: '★ Midnight Stars ★', category: 'Decorative', text: `★ ${text} ★` });
  styles.push({ id: 'aesthetic-moon', name: '☾ Crescent Moon ☽', category: 'Decorative', text: `☾ ${text} ☽` });
  styles.push({ id: 'aesthetic-butterfly', name: '🦋 Butterfly Garden 🦋', category: 'Decorative', text: `🦋 ${text} 🦋` });
  styles.push({ id: 'aesthetic-fire', name: '🔥 Blazing Fire 🔥', category: 'Decorative', text: `🔥 ${text} 🔥` });
  styles.push({ id: 'aesthetic-crown', name: '👑 Royal Crown 👑', category: 'Decorative', text: `👑 ${text} 👑` });
  styles.push({ id: 'aesthetic-wings', name: '꧁ Wings Frame ꧂', category: 'Decorative', text: `꧁༺ ${text} ༻꧂` });
  styles.push({ id: 'aesthetic-swirls', name: '࿐ Swirl Aura ࿐', category: 'Decorative', text: `࿐ ${text} ࿐` });
  styles.push({ id: 'aesthetic-lotus', name: '𓆩 Lotus Emblem 𓆪', category: 'Decorative', text: `𓆩 ${text} 𓆪` });
  styles.push({ id: 'bracket-fancy', name: '【 Bold Brackets 】', category: 'Decorative', text: `【 ${text} 】` });
  styles.push({ id: 'bracket-curved', name: '『 Japanese Quotes 』', category: 'Decorative', text: `『 ${text} 』` });
  styles.push({ id: 'bracket-lens', name: '〔 Tortoise Brackets 〕', category: 'Decorative', text: `〔 ${text} 〕` });
  styles.push({ id: 'aesthetic-music', name: '♫ Melody Notes ♫', category: 'Decorative', text: `♫ ${text} ♫` });
  styles.push({ id: 'diamond-frame', name: '❖ Diamond Crest ❖', category: 'Decorative', text: `❖ ${text} ❖` });
  styles.push({ id: 'infinity-frame', name: '♾️ Infinite Loop ♾️', category: 'Decorative', text: `♾️ ${text} ♾️` });
  styles.push({ id: 'feather-frame', name: '🪶 Feather Soft 🪶', category: 'Decorative', text: `🪶 ${text} 🪶` });

  // Gaming Styles (PUBG / Free Fire / COD Handles)
  styles.push({ id: 'gaming-sniper', name: 'Sniper Scope ︻╦̵̵͇̿̿̿̿╤──', category: 'Gaming & Symbols', text: `︻╦̵̵͇̿̿̿̿╤── ${text} ──╤╦̵̵͇̿̿̿̿` });
  styles.push({ id: 'gaming-swords', name: '⚔️ Dual Blades ⚔️', category: 'Gaming & Symbols', text: `⚔️ ${text} ⚔️` });
  styles.push({ id: 'gaming-skull', name: '☠️ Poison Skull ☠️', category: 'Gaming & Symbols', text: `☠️ ${text} ☠️` });
  styles.push({ id: 'gaming-target', name: '🎯 Bullseye Marksman 🎯', category: 'Gaming & Symbols', text: `🎯 ${text} 🎯` });
  styles.push({ id: 'gaming-trophy', name: '🏆 Champion Trophy 🏆', category: 'Gaming & Symbols', text: `🏆 ${text} 🏆` });
  styles.push({ id: 'gaming-ninja', name: '🥷 Shadow Ninja 🥷', category: 'Gaming & Symbols', text: `🥷 ${text} 🥷` });
  styles.push({ id: 'gaming-dragon', name: '🐉 Mythic Dragon 🐉', category: 'Gaming & Symbols', text: `🐉 ${text} 🐉` });
  styles.push({ id: 'gaming-bolt', name: '⚡ Lightning Thunder ⚡', category: 'Gaming & Symbols', text: `⚡ ${text} ⚡` });
  styles.push({ id: 'gaming-cross', name: '✝️ Gothic Cross ✝️', category: 'Gaming & Symbols', text: `✝️ ${text} ✝️` });
  styles.push({ id: 'gaming-hazard', name: '☣️ Biohazard Alert ☣️', category: 'Gaming & Symbols', text: `☣️ ${text} ☣️` });
  styles.push({ id: 'gaming-shield', name: '🛡️ Aegis Shield 🛡️', category: 'Gaming & Symbols', text: `🛡️ ${text} 🛡️` });
  styles.push({ id: 'gaming-clan-1', name: '亗 Sovereign Clan 亗', category: 'Gaming & Symbols', text: `亗 ${text} 亗` });
  styles.push({ id: 'gaming-clan-2', name: '★彡 Star Commando 彡★', category: 'Gaming & Symbols', text: `★彡 ${text} 彡★` });
  styles.push({ id: 'gaming-clan-3', name: '乂 Shadow Strike 乂', category: 'Gaming & Symbols', text: `乂 ${text} 乂` });
  styles.push({ id: 'gaming-clan-4', name: '彡 Clan Warrior 彡', category: 'Gaming & Symbols', text: `彡 ${text} 彡` });
  styles.push({ id: 'gaming-clan-5', name: '☬ Mystic Khanda ☬', category: 'Gaming & Symbols', text: `☬ ${text} ☬` });
  styles.push({ id: 'gaming-clan-6', name: '乡 Dynasty Emblem 乡', category: 'Gaming & Symbols', text: `乡 ${text} 乡` });
  styles.push({ id: 'gaming-clan-7', name: '『V凸P』Victory Gamer', category: 'Gaming & Symbols', text: `『V凸P』 ${text}` });

  // Additional 40+ Composite & Hybrid Styles to achieve 100+ distinct styles
  styles.push({ id: 'bold-sans-spaced', name: 'Bold Sans Spaced', category: 'Serif & Sans', text: Array.from(applyMap(text, SANS_BOLD_MAP)).join(' ') });
  styles.push({ id: 'monospace-spaced', name: 'Monospace Spaced', category: 'Mathematical', text: Array.from(applyMap(text, MONOSPACE_MAP)).join(' ') });
  styles.push({ id: 'double-struck-spaced', name: 'Double Struck Spaced', category: 'Mathematical', text: Array.from(applyMap(text, DOUBLE_STRUCK_MAP)).join(' ') });
  styles.push({ id: 'small-caps-spaced', name: 'Small Caps Spaced', category: 'Serif & Sans', text: Array.from(applyMap(text, SMALL_CAPS_MAP)).join(' ') });
  styles.push({ id: 'fraktur-bracketed', name: '【 Gothic Fraktur 】', category: 'Decorative', text: `【 ${applyMap(text, FRAKTUR_MAP)} 】` });
  styles.push({ id: 'script-stars', name: '★ Cursive With Stars ★', category: 'Decorative', text: `★ ${applyMap(text, SCRIPT_MAP)} ★` });
  styles.push({ id: 'bold-script-hearts', name: '💖 Bold Script Hearts 💖', category: 'Decorative', text: `💖 ${applyMap(text, BOLD_SCRIPT_MAP)} 💖` });
  styles.push({ id: 'bold-fraktur-crown', name: '👑 Royal Bold Fraktur 👑', category: 'Decorative', text: `👑 ${applyMap(text, BOLD_FRAKTUR_MAP)} 👑` });
  styles.push({ id: 'double-struck-wings', name: '꧁ Double Struck Wings ꧂', category: 'Decorative', text: `꧁༺ ${applyMap(text, DOUBLE_STRUCK_MAP)} ༻꧂` });
  styles.push({ id: 'small-caps-sparkle', name: '✨ Small Caps Sparkle ✨', category: 'Decorative', text: `✨ ${applyMap(text, SMALL_CAPS_MAP)} ✨` });
  styles.push({ id: 'circled-spaced', name: 'Circled Spaced', category: 'Enclosed', text: Array.from(applyMap(text, CIRCLED_MAP)).join(' ') });
  styles.push({ id: 'squared-spaced', name: 'Squared Spaced', category: 'Enclosed', text: Array.from(applyMap(text, SQUARED_MAP)).join(' ') });
  styles.push({ id: 'negative-squared-spaced', name: 'Negative Squared Spaced', category: 'Enclosed', text: Array.from(applyMap(text, NEGATIVE_SQUARED_MAP)).join(' ') });
  styles.push({ id: 'underline-bold', name: 'Underlined Bold', category: 'Effects', text: applyCombining(applyMap(text, BOLD_MAP), '\u0332') });
  styles.push({ id: 'strike-bold', name: 'Strikethrough Bold', category: 'Effects', text: applyCombining(applyMap(text, BOLD_MAP), '\u0336') });
  styles.push({ id: 'dotted-bold', name: 'Dotted Bold', category: 'Effects', text: applyCombining(applyMap(text, BOLD_MAP), '\u0307') });
  styles.push({ id: 'underline-italic', name: 'Underlined Italic', category: 'Effects', text: applyCombining(applyMap(text, ITALIC_MAP), '\u0332') });
  styles.push({ id: 'strike-italic', name: 'Strikethrough Italic', category: 'Effects', text: applyCombining(applyMap(text, ITALIC_MAP), '\u0336') });
  styles.push({ id: 'underline-sans', name: 'Underlined Sans', category: 'Effects', text: applyCombining(applyMap(text, SANS_SERIF_MAP), '\u0332') });
  styles.push({ id: 'strike-sans', name: 'Strikethrough Sans', category: 'Effects', text: applyCombining(applyMap(text, SANS_SERIF_MAP), '\u0336') });
  styles.push({ id: 'vintage-typewriter', name: 'Vintage Typewriter |', category: 'Mathematical', text: `${applyMap(text, MONOSPACE_MAP)} |` });
  styles.push({ id: 'aesthetic-rose', name: '🌹 Crimson Rose 🌹', category: 'Decorative', text: `🌹 ${text} 🌹` });
  styles.push({ id: 'aesthetic-spark', name: '⚡ Thunder Strike ⚡', category: 'Decorative', text: `⚡ ${applyMap(text, SANS_BOLD_MAP)} ⚡` });
  styles.push({ id: 'aesthetic-gem', name: '💎 Crystal Diamond 💎', category: 'Decorative', text: `💎 ${text} 💎` });
  styles.push({ id: 'aesthetic-ghost', name: '👻 Phantom Ghost 👻', category: 'Decorative', text: `👻 ${text} 👻` });
  styles.push({ id: 'aesthetic-angel', name: '༒ Sacred Mandala ༒', category: 'Decorative', text: `༒ ${text} ༒` });
  styles.push({ id: 'aesthetic-tribal', name: '༺ Tribal Crest ༻', category: 'Decorative', text: `༺ ${text} ༻` });
  styles.push({ id: 'aesthetic-arrow-wings', name: '↢ Arrow Wings ↣', category: 'Decorative', text: `↢ ${text} ↣` });
  styles.push({ id: 'aesthetic-heart-chain', name: '♥ Heart Chain ♥', category: 'Decorative', text: `♥ ${text} ♥` });
  styles.push({ id: 'aesthetic-snowflake', name: '❄️ Winter Snowflake ❄️', category: 'Decorative', text: `❄️ ${text} ❄️` });
  styles.push({ id: 'aesthetic-clover', name: '🍀 Lucky Clover 🍀', category: 'Decorative', text: `🍀 ${text} 🍀` });
  styles.push({ id: 'aesthetic-ribbon', name: '🎀 Satin Ribbon 🎀', category: 'Decorative', text: `🎀 ${text} 🎀` });
  styles.push({ id: 'aesthetic-cloud', name: '☁️ Dreamy Cloud ☁️', category: 'Decorative', text: `☁️ ${text} ☁️` });
  styles.push({ id: 'aesthetic-feather-pen', name: '✒️ Calligraphy Quill ✒️', category: 'Decorative', text: `✒️ ${applyMap(text, SCRIPT_MAP)} ✒️` });
  styles.push({ id: 'aesthetic-target-lock', name: '⌖ Crosshair Lock ⌖', category: 'Gaming & Symbols', text: `⌖ ${text} ⌖` });
  styles.push({ id: 'gaming-danger', name: '⚠️ Warning Danger ⚠️', category: 'Gaming & Symbols', text: `⚠️ ${text} ⚠️` });
  styles.push({ id: 'gaming-radar', name: '📡 Radar Signal 📡', category: 'Gaming & Symbols', text: `📡 ${text} 📡` });
  styles.push({ id: 'gaming-reaper', name: '⚰️ Grim Reaper ⚰️', category: 'Gaming & Symbols', text: `⚰️ ${text} ⚰️` });
  styles.push({ id: 'gaming-level-up', name: '🆙 Level Master 🆙', category: 'Gaming & Symbols', text: `🆙 ${text} 🆙` });
  styles.push({ id: 'gaming-tag-pro', name: '【PRO】Elite Gamer', category: 'Gaming & Symbols', text: `【PRO】${text}` });
  styles.push({ id: 'gaming-tag-god', name: '『GOD』Immortal Player', category: 'Gaming & Symbols', text: `『GOD』${text}` });
  styles.push({ id: 'gaming-tag-king', name: '👑 [KING] Sovereign', category: 'Gaming & Symbols', text: `👑 [KING] ${text}` });
  styles.push({ id: 'gaming-tag-vip', name: '✦ 𝒱𝐼𝒫 ✦ Premium Player', category: 'Gaming & Symbols', text: `✦ 𝒱𝐼𝒫 ✦ ${text}` });
  styles.push({ id: 'gaming-tag-op', name: '⚡ [OP] Overpowered ⚡', category: 'Gaming & Symbols', text: `⚡ [OP] ${text} ⚡` });

  return styles;
}
