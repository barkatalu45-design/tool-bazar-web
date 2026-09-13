// Text manipulation, conversion, extraction, and encoding utilities

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  letters: number;
  numbers: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  if (!text) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      letters: 0,
      numbers: 0,
      sentences: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  const wordsArray = text.trim().match(/[\w\d'-]+/gu) || [];
  const words = wordsArray.length;
  const letters = (text.match(/[\p{L}]/gu) || []).length;
  const numbers = (text.match(/[\d]/gu) || []).length;
  const sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || (text.trim() ? [text] : [])).length;
  const lines = text.split(/\r\n|\r|\n/).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  // Standard reading rate ~ 200 wpm; speaking ~ 130 wpm
  const readingTimeMinutes = +(words / 200).toFixed(1);
  const speakingTimeMinutes = +(words / 130).toFixed(1);

  return {
    words,
    characters,
    charactersNoSpaces,
    letters,
    numbers,
    sentences,
    lines,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}

export function repeatText(text: string, count: number, separator: string = '\n'): string {
  const safeCount = Math.max(0, Math.min(count, 10000));
  if (!text || safeCount === 0) return '';
  return Array(safeCount).fill(text).join(separator);
}

export function toUppercase(text: string): string {
  return text.toUpperCase();
}

export function toLowercase(text: string): string {
  return text.toLowerCase();
}

export function toCapitalized(text: string): string {
  return text.replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (match, prefix, letter) => prefix + letter.toUpperCase());
}

export function toTitleCase(text: string): string {
  const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']);
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word, index, arr) => {
      if (index === 0 || index === arr.length - 1 || !minorWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

export function removeExtraSpaces(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim().replace(/[ \t]+/g, ' '))
    .join('\n')
    .trim();
}

export function removeEmptyLines(text: string): string {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .join('\n');
}

export function removeDuplicateLines(text: string): string {
  const lines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const uniqueLines: string[] = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      uniqueLines.push(line);
    }
  }
  return uniqueLines.join('\n');
}

export function sortLines(text: string, ascending: boolean = true): string {
  const lines = text.split(/\r?\n/);
  lines.sort((a, b) => (ascending ? a.localeCompare(b) : b.localeCompare(a)));
  return lines.join('\n');
}

export function reverseText(text: string): string {
  return Array.from(text).reverse().join('');
}

export function reverseLines(text: string): string {
  return text.split(/\r?\n/).reverse().join('\n');
}

export function findAndReplace(text: string, find: string, replaceWith: string, isRegex: boolean = false, matchCase: boolean = true): string {
  if (!find) return text;
  try {
    if (isRegex) {
      const flags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(find, flags);
      return text.replace(regex, replaceWith);
    } else {
      if (!matchCase) {
        const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        return text.replace(regex, replaceWith);
      }
      return text.split(find).join(replaceWith);
    }
  } catch {
    return text;
  }
}

export function cleanText(text: string): string {
  // Strip HTML tags, zero-width chars, normalize non-breaking spaces
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .trim();
}

export function extractEmails(text: string): string[] {
  const matches = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g) || [];
  return Array.from(new Set(matches));
}

export function extractUrls(text: string): string[] {
  const matches = text.match(/(https?:\/\/[^\s]+)/gi) || [];
  return Array.from(new Set(matches));
}

export function extractPhoneNumbers(text: string): string[] {
  const matches = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
  return Array.from(new Set(matches));
}

export function extractNumbers(text: string): string[] {
  const matches = text.match(/-?\d+(?:\.\d+)?/g) || [];
  return Array.from(new Set(matches));
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return Array.from(new Set(matches));
}

export function extractMentions(text: string): string[] {
  const matches = text.match(/@[a-zA-Z0-9_]+/g) || [];
  return Array.from(new Set(matches));
}

// Encoders and Decoders
export function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join(' ');
}

export function binaryToText(binary: string): string {
  try {
    const clean = binary.replace(/[^01\s]/g, '').trim();
    if (!clean) return '';
    const bytes = clean.split(/\s+/).map((bin) => parseInt(bin, 2));
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    throw new Error('Invalid binary string');
  }
}

export function textToAscii(text: string): string {
  return Array.from(text)
    .map((char) => char.charCodeAt(0))
    .join(' ');
}

export function asciiToText(ascii: string): string {
  try {
    const numbers = ascii.trim().split(/[\s,]+/);
    return numbers.map((n) => String.fromCharCode(parseInt(n, 10))).join('');
  } catch {
    throw new Error('Invalid ASCII code sequence');
  }
}

export function textToBase64(text: string): string {
  try {
    const bytes = new TextEncoder().encode(text);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binString);
  } catch {
    throw new Error('Encoding error');
  }
}

export function base64ToText(b64: string): string {
  try {
    const binString = atob(b64.trim());
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error('Invalid Base64 sequence');
  }
}

export function textToHex(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

export function hexToText(hex: string): string {
  try {
    const clean = hex.replace(/[^0-9a-fA-F]/g, '');
    if (clean.length % 2 !== 0) {
      throw new Error('Hex length must be even');
    }
    const bytes: number[] = [];
    for (let i = 0; i < clean.length; i += 2) {
      bytes.push(parseInt(clean.slice(i, i + 2), 16));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Invalid Hex string');
  }
}

const MORSE_CODE_MAP: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.',
  g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..',
  m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.',
  s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
  y: '-.--', z: '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
  ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
  '@': '.--.-.',
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([char, code]) => [code, char])
);

export function textToMorse(text: string): string {
  return Array.from(text.toLowerCase())
    .map((char) => MORSE_CODE_MAP[char] || char)
    .join(' ');
}

export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s+/)
    .map((code) => {
      if (code === '/') return ' ';
      return REVERSE_MORSE[code] || code;
    })
    .join('');
}
