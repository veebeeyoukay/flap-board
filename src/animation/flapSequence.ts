export const FLAP_CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:./+';

export function isFlapChar(c: string): boolean {
  return FLAP_CHARS.indexOf(c) >= 0;
}

export function nextChar(c: string): string {
  const i = FLAP_CHARS.indexOf(c);
  if (i < 0) return FLAP_CHARS[0]!;
  return FLAP_CHARS[(i + 1) % FLAP_CHARS.length]!;
}

export function flipSequence(from: string, to: string): string[] {
  if (from === to) return [];
  if (!isFlapChar(from) || !isFlapChar(to)) return [to];
  const seq: string[] = [];
  let cur = from;
  while (cur !== to) {
    cur = nextChar(cur);
    seq.push(cur);
    if (seq.length > FLAP_CHARS.length) break;
  }
  return seq;
}
