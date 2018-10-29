const ALPHA_NUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateID(length = 10) {
  const n = [];
  for (let q = 0; q < length; q += 1) {
    n.push(ALPHA_NUMERIC_CHARS.charAt(Math.floor(Math.random() * ALPHA_NUMERIC_CHARS.length)));
  }
  return n.join('');
}