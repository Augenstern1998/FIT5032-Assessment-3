// Simple client-side helpers to mitigate common XSS in UI bindings.

export function sanitizeText(input) {
  const s = String(input ?? '');
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default { sanitizeText };


