export function formatAddressLines(address = '') {
  if (address == null || address === '') return [];
  return String(address)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}
