import { Tool } from '../types';
import { ALL_TOOLS } from '../data/toolsRegistry';

// Multilingual keywords dictionary mapping intent terms to tool IDs and tool keywords
// Covers Roman Urdu, Urdu script, Hindi script, Arabic, Spanish, French, and common English misspellings
interface SynonymGroup {
  toolIds: string[];
  terms: string[];
}

const MULTILINGUAL_SYNONYMS: SynonymGroup[] = [
  // Calculators & Mathematics
  {
    toolIds: ['basic-calculator', 'scientific-calculator', 'normalCalc', 'mathCalc'],
    terms: [
      // English
      'calculator', 'calc', 'math', 'mathematics', 'scientific', 'calculate', 'addition', 'subtraction', 'multiplication', 'division',
      // Roman Urdu / Hindi
      'hisab', 'hisaab', 'kalku', 'kelkulator', 'kelku', 'calcu', 'kalkuleta', 'jod', 'jodh', 'jama', 'ghatana', 'ghatao', 'zarb', 'guna', 'bhaag', 'taqseem', 'tafriq', 'riazi', 'ganit', 'pahaada', 'hesab',
      // Urdu script
      'حساب', 'کیلکولیٹر', 'ریاضی', 'جمع', 'تفریق', 'ضرب', 'تقسیم', 'کیلکو',
      // Hindi script
      'कैलकुलेटर', 'हिसाब', 'गणित', 'जोड़', 'घटाना', 'गुणा', 'भाग',
      // Arabic / Spanish / French
      'حاسبة', 'calculadora', 'calculatrice', 'calcul'
    ],
  },
  // Normal Calculator
  {
    toolIds: ['basic-calculator'],
    terms: [
      'normal calculator', 'basic calculator', 'simple calculator', 'aam hisab', 'chota calculator', 'aasan calculator', 'sadah hisab', 'سادہ کیلکولیٹر', 'عام حساب'
    ],
  },
  // Heavy Mathematics / Scientific
  {
    toolIds: ['scientific-calculator'],
    terms: [
      'heavy mathematics', 'scientific calculator', 'heavy math', 'trigonometry', 'sin', 'cos', 'tan', 'sqrt', 'mushkil hisab', 'bada hisab', 'science calculator', 'سائنسی کیلکولیٹر', 'بھاری ریاضی'
    ],
  },
  // Age Calculator
  {
    toolIds: ['age-calculator'],
    terms: [
      'age', 'birthday', 'how old', 'date of birth', 'dob', 'years', 'birth date',
      'umr', 'umar', 'uamr', 'aayu', 'saal', 'janam din', 'janmadin', 'paidaish', 'tarikh e paidaish', 'kitne saal', 'umr hisab', 'umr maloom', 'janamdin',
      'عمر', 'سال', 'پیدائش', 'تاریخ پیدائش', 'سالگرہ', 'کتنے سال',
      'उम्र', 'आयु', 'जन्मदिन', 'तारीख',
      'edad', 'âge', 'العمر', 'سن'
    ],
  },
  // Video to MP3 & Audio
  {
    toolIds: ['video-to-mp3'],
    terms: [
      'video to mp3', 'extract audio', 'mp3 converter', 'sound extractor', 'audio converter', 'convert video',
      'awaz', 'awaaz', 'avaz', 'gana', 'gaana', 'geet', 'sound', 'dhun', 'audio', 'video se gana', 'gana nikalna', 'mp3 banana', 'awaz alag karo', 'audio nikalna', 'video se awaz',
      'آواز', 'گانا', 'ویڈیو', 'ایم پی تھری', 'آڈیو', 'ویڈیو سے آڈیو',
      'आवाज', 'गाना', 'गीत', 'वीडियो', 'ऑडियो',
      'sonido', 'musique', 'صوت', 'استخراج الصوت'
    ],
  },
  // Background Remover
  {
    toolIds: ['background-remover', 'background-color-changer'],
    terms: [
      'background remover', 'remove bg', 'transparent background', 'erase background', 'cutout',
      'background hatao', 'pichhe ka rang', 'bg remove', 'piche ka parda', 'tasveer katna', 'photo saf karo', 'piche ka rang', 'background badlo', 'tasvir bg',
      'پس منظر', 'بیک گراؤنڈ', 'تصویر کا بیک گراؤنڈ', 'فوٹو ایڈیٹر',
      'पृष्ठभूमि', 'बैकग्राउंड', 'फोटो बैकग्राउंड हटाएं',
      'fondo', 'supprimer fond', 'خلفية', 'حذف الخلفية'
    ],
  },
  // Image Resizer & Compressor
  {
    toolIds: ['image-resizer', 'image-compressor'],
    terms: [
      'resize', 'compress', 'image resizer', 'compressor', 'reduce size', 'kb reducer', 'scale photo',
      'chhota karo', 'chota karo', 'size kam', 'vazan kam', 'mb kam', 'kb kam', 'resise', 'bada karo', 'halka karo', 'size badlo', 'chhota photo',
      'سائز کم', 'تصویر چھوٹی', 'کمپریس',
      'आकार कम', 'छोटा करें', 'कंप्रेस',
      'redimensionner', 'comprimir', 'تصغير الحجم'
    ],
  },
  // QR Code Generator
  {
    toolIds: ['qr-code-generator'],
    terms: [
      'qr', 'qr code', 'barcode', 'qr maker', 'qr generator',
      'kyu aar', 'bar code', 'scan code', 'link code', 'scanner', 'chokor code',
      'کیو آر کوڈ', 'بار کوڈ',
      'क्यूआर कोड', 'बारकोड',
      'código qr', 'رمز الاستجابة السريعة'
    ],
  },
  // Word Counter & Text Tools
  {
    toolIds: ['word-counter', 'character-counter'],
    terms: [
      'word counter', 'words count', 'character counter', 'word count', 'reading time',
      'alfaz', 'alfaz ginti', 'lafz', 'shabd', 'shabad', 'harf', 'likhai', 'kitne lafz', 'word gino', 'padhna', 'jumla', 'lafzo ki ginti',
      'الفاظ', 'گنتی', 'حروف', 'جملے', 'الفاظ کی گنتی',
      'शब्द', 'गिनती', 'अक्षर', 'शब्द गिनें',
      'contar palabras', 'compteur de mots', 'عدد الكلمات'
    ],
  },
  // Case Converter (Uppercase / Lowercase)
  {
    toolIds: ['case-converter'],
    terms: [
      'case converter', 'uppercase', 'lowercase', 'capital letters', 'small letters', 'title case',
      'bada letter', 'chota letter', 'harf badalna', 'capital', 'small', 'bade harf', 'chote harf', 'bada abc', 'chota abc',
      'بڑے حروف', 'چھوٹے حروف', 'حروف تبدیل',
      'बड़े अक्षर', 'छोटे अक्षर',
      'mayúsculas', 'minuscules', 'حروف كبيرة'
    ],
  },
  // Space Cleaner / Remover
  {
    toolIds: ['remove-extra-spaces'],
    terms: [
      'remove spaces', 'clean whitespace', 'space cleaner', 'extra space',
      'faasla', 'space hatao', 'zyada space', 'khali jagah', 'space saf karo',
      'خالی جگہ ختم', 'اضافی اسپیس',
      'रिक्त स्थान हटाएं',
      'espacios', 'espaces'
    ],
  },
  // Stopwatch & Timer
  {
    toolIds: ['stopwatch', 'countdown-timer', 'pomodoro-timer'],
    terms: [
      'stopwatch', 'timer', 'countdown', 'pomodoro', 'clock', 'alarm',
      'waqt', 'samay', 'ghari', 'ghadi', 'roko', 'ruko', 'kitna waqt', 'taim', 'alaram', 'ghanta', 'sec', 'minut',
      'وقت', 'گھڑی', 'سٹاپ واچ', 'ٹائمر', 'الارم',
      'समय', 'घड़ी', 'स्टॉपवॉच', 'टाइमर',
      'cronómetro', 'chronomètre', 'ساعة توقيف', 'مؤقت'
    ],
  },
  // Color Picker & Hex
  {
    toolIds: ['color-picker-tool', 'hex-to-rgb', 'contrast-checker', 'css-gradient-generator'],
    terms: [
      'color', 'colour', 'color picker', 'hex to rgb', 'gradient', 'palette',
      'rang', 'color chuno', 'pichkari', 'color code', 'rangat', 'neela', 'peela', 'laal', 'rang pehchano',
      'رنگ', 'کلر', 'رنگ کوڈ', 'رنگ منتخب کریں',
      'रंग', 'कलर', 'रंग चुनें',
      'color', 'couleur', 'ألوان', 'منتقي الألوان'
    ],
  },
  // Stylish Fonts
  {
    toolIds: ['fancy-font-generator', 'small-caps-generator', 'zalgo-text-generator'],
    terms: [
      'stylish text', 'fancy font', 'cool fonts', 'bio generator', 'pubg name', 'font generator',
      'khat', 'likhawat', 'stylish likhai', 'design naam', 'fancy naam', 'free fire name', 'stylish font', 'khubsurat naam', 'font badlo', 'khubsurat likhai',
      'فونٹ', 'لکھائی', 'ڈیزائن', 'خوبصورت لکھائی', 'اسٹائلش فونٹ',
      'फॉन्ट', 'लिखावट', 'स्टाइलिश नाम',
      'fuentes', 'police'
    ],
  },
  // PDF Tools
  {
    toolIds: ['text-to-pdf', 'images-to-pdf', 'pdf-preview', 'pdf-metadata-viewer'],
    terms: [
      'pdf', 'pdf maker', 'text to pdf', 'images to pdf', 'document',
      'kagaz', 'dastaveez', 'pdf banao', 'likhai se pdf', 'tasveer se pdf', 'khatoot', 'file',
      'پی ڈی ایف', 'دستاویز', 'پی ڈی ایف بنائیں',
      'पीडीएफ', 'दस्तावेज़',
      'pdf', 'documento', 'ملف بي دي اف'
    ],
  },
  // Battery & Device Info
  {
    toolIds: ['battery-status', 'device-screen-info', 'network-speed-latency', 'browser-fingerprint-info'],
    terms: [
      'battery', 'screen', 'device', 'specs', 'internet speed', 'ping', 'wifi',
      'charging', 'battery kitni', 'mobail', 'phone ka screen', 'internet speed', 'ram', 'net speed', 'charg', 'display', 'screen size',
      'بیٹری', 'موبائل', 'انٹرنیٹ سپیڈ', 'سکرین سائز',
      'बैटरी', 'फोन', 'इंटरनेट स्पीड',
      'batería', 'batterie', 'بطارية', 'معلومات الجهاز'
    ],
  },
  // Password Generator
  {
    toolIds: ['password-generator', 'uuid-generator'],
    terms: [
      'password', 'generate password', 'security', 'pin', 'key',
      'khufia code', 'password banao', 'chabi', 'naya password', 'mahfooz', 'tala', 'ramz', 'mazboot password',
      'پاس ورڈ', 'خفیہ کوڈ', 'مضبوط پاس ورڈ',
      'पासवर्ड', 'गुप्त कोड',
      'contraseña', 'mot de passe', 'كلمة سر', 'توليد كلمة سر'
    ],
  },
  // Percentage & Discount & GST
  {
    toolIds: ['percentage-calculator', 'discount-calculator', 'gst-calculator', 'tax-calculator'],
    terms: [
      'percentage', 'percent', 'discount', 'gst', 'tax', 'sale',
      'munafa', 'choot', 'discount kitna', 'bachat', 'sasta', 'tax', 'gst kitna', 'hisab kitab', 'kharcha', 'feesad', 'fisad', 'pratishat',
      'فیصد', 'رعایت', 'ڈسکاؤنٹ', 'ٹیکس',
      'प्रतिशत', 'छूट', 'डिस्काउंट', 'टैक्स'
    ],
  },
  // BMI & Health
  {
    toolIds: ['bmi-calculator'],
    terms: [
      'bmi', 'body mass', 'weight loss', 'ideal weight', 'obesity',
      'motapa', 'sehat', 'wazan hisab', 'tandurusti', 'wazan kam', 'kad aur wazan',
      'بی ایم آئی', 'صحت', 'وزن', 'موٹاپا',
      'बीएमआई', 'स्वास्थ्य', 'मोटापा', 'वजन'
    ],
  },
  // Unit Converter
  {
    toolIds: ['unit-converter', 'length-converter', 'weight-converter', 'temperature-converter'],
    terms: [
      'unit converter', 'convert units', 'meters to feet', 'kg to lbs', 'celsius to fahrenheit',
      'paimana', 'vazan', 'lambaee', 'lambai', 'inch', 'kilo', 'foot', 'durie', 'taapmaan', 'garmi', 'unit badlo',
      'پیمانہ', 'یونٹ کنورٹر', 'لمبائی', 'وزن', 'درجہ حرارت',
      'इकाई परिवर्तक', 'इकाई', 'किलो', 'मीटर', 'तापमान'
    ],
  },
  // Coin Flip & Random
  {
    toolIds: ['coin-flip', 'dice-roller', 'random-number-calc'],
    terms: [
      'coin flip', 'toss', 'head or tail', 'dice', 'random picker',
      'sikka', 'chitt pat', 'head tail', 'dais', 'ludo ka dana', 'kismat', 'pasa',
      'سکہ', 'ٹاس', 'ہیڈ ٹیل', 'لڈو کا دانہ',
      'सिक्का', 'टॉस', 'हेड टेल', 'पासा'
    ],
  },
  // Developer Tools
  {
    toolIds: ['json-formatter', 'html-live-preview', 'base64-encoder', 'regex-tester', 'jwt-decoder'],
    terms: [
      'developer', 'json', 'html', 'base64', 'regex', 'jwt', 'code',
      'koding', 'developer', 'json theek karo', 'html chalao', 'kood', 'programmer', 'coding tools',
      'ڈیولپر', 'کوڈنگ', 'پروگرامنگ',
      'डेवलपर', 'कोडिंग', 'प्रोग्रामिंग'
    ],
  },
];

/**
 * Normalize search string:
 * - lowercase & trim
 * - strip punctuation and multiple spaces
 * - normalize common double vowels (aa->a, ee->e, oo->u)
 */
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'۔،؟]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Universal Multilingual Search Engine:
 * Matches query in ANY language (English, Roman Urdu, Urdu Script, Hindi Script, etc.)
 * Returns filtered and rank-ordered tools.
 */
export function searchToolsMultilingual(rawQuery: string): Tool[] {
  const query = normalizeQuery(rawQuery);
  if (!query) return ALL_TOOLS;

  const queryWords = query.split(' ').filter(Boolean);
  const matchedToolScores = new Map<string, number>();

  // 1. Check Synonym Groups for any matching term
  for (const group of MULTILINGUAL_SYNONYMS) {
    let groupMatched = false;
    let matchQuality = 0;

    for (const term of group.terms) {
      const normalizedTerm = normalizeQuery(term);

      // Exact match with whole query
      if (normalizedTerm === query) {
        groupMatched = true;
        matchQuality = Math.max(matchQuality, 100);
        break;
      }

      // Query starts with term or term starts with query
      if (normalizedTerm.startsWith(query) || query.startsWith(normalizedTerm)) {
        groupMatched = true;
        matchQuality = Math.max(matchQuality, 75);
      }

      // Query includes term or term includes query
      else if (normalizedTerm.includes(query) || query.includes(normalizedTerm)) {
        groupMatched = true;
        matchQuality = Math.max(matchQuality, 50);
      }

      // Word-level partial match
      else if (queryWords.some((qw) => qw.length >= 2 && normalizedTerm.includes(qw))) {
        groupMatched = true;
        matchQuality = Math.max(matchQuality, 30);
      }
    }

    if (groupMatched) {
      for (const toolId of group.toolIds) {
        const currentScore = matchedToolScores.get(toolId) || 0;
        matchedToolScores.set(toolId, Math.max(currentScore, matchQuality));
      }
    }
  }

  // 2. Direct Match on Tool Name, Description, Keywords, and Category
  for (const tool of ALL_TOOLS) {
    let score = matchedToolScores.get(tool.id) || 0;
    const nameNorm = normalizeQuery(tool.name);
    const descNorm = normalizeQuery(tool.description);
    const catNorm = normalizeQuery(tool.category);

    // Exact name match
    if (nameNorm === query) {
      score += 120;
    } else if (nameNorm.startsWith(query)) {
      score += 80;
    } else if (nameNorm.includes(query)) {
      score += 60;
    }

    // Category match
    if (catNorm.includes(query)) {
      score += 40;
    }

    // Keywords match
    for (const kw of tool.keywords) {
      const kwNorm = normalizeQuery(kw);
      if (kwNorm === query) {
        score += 70;
      } else if (kwNorm.includes(query) || query.includes(kwNorm)) {
        score += 35;
      }
    }

    // Description match
    if (descNorm.includes(query)) {
      score += 20;
    }

    // Word-by-word intersection
    const allText = `${nameNorm} ${descNorm} ${catNorm} ${tool.keywords.map(normalizeQuery).join(' ')}`;
    let wordsMatched = 0;
    for (const qw of queryWords) {
      if (qw.length >= 2 && allText.includes(qw)) {
        wordsMatched++;
      }
    }
    if (wordsMatched > 0) {
      score += (wordsMatched / queryWords.length) * 25;
    }

    if (score > 0) {
      matchedToolScores.set(tool.id, score);
    }
  }

  // 3. Filter and sort results by highest score first
  const results: { tool: Tool; score: number }[] = [];
  for (const tool of ALL_TOOLS) {
    const score = matchedToolScores.get(tool.id);
    if (score && score > 0) {
      results.push({ tool, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.map((r) => r.tool);
}
