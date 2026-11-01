const TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

function isToken(s) {
  return s.length > 0 && TOKEN_RE.test(s);
}

function parseQ(s) {
  if (s === undefined || s === '') return null;
  const q = Number(s);
  if (Number.isNaN(q)) return null;
  if (q < 0 || q > 1) return null;
  return q;
}

export function parseAcceptEncoding(header) {
  if (header === undefined || header === null) return [];
  const raw = String(header);
  if (raw.trim() === '') return [];
  const entries = [];
  for (const part of raw.split(',')) {
    const piece = part.trim();
    if (piece === '') continue;
    const segments = piece.split(';').map((s) => s.trim());
    const coding = segments[0];
    if (!isToken(coding)) continue;
    let q = 1.0;
    let valid = true;
    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      if (seg === '') continue;
      const eq = seg.indexOf('=');
      if (eq === -1) {
        valid = false;
        break;
      }
      const name = seg.slice(0, eq).trim().toLowerCase();
      if (name !== 'q') {
        valid = false;
        break;
      }
      const value = seg.slice(eq + 1).trim();
      const parsed = parseQ(value);
      if (parsed === null) {
        valid = false;
        break;
      }
      q = parsed;
    }
    if (!valid) continue;
    entries.push({ coding, q });
  }
  entries.sort((a, b) => b.q - a.q);
  return entries;
}
