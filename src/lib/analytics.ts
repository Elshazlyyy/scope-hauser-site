export function captureUTM(searchParams: URLSearchParams) {
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
  ];
  const out: Record<string, string> = {};
  keys.forEach((k) => {
    const v = searchParams.get(k);
    if (v) out[k] = v;
  });
  return out;
}
