export const SOCIAL_NETWORKS = [
  { key: 'instagramUrl', label: 'Instagram', icon: 'mdi:instagram' },
  { key: 'facebookUrl', label: 'Facebook', icon: 'mdi:facebook' },
  { key: 'twitterUrl', label: 'X', icon: 'mdi:twitter' },
  { key: 'youtubeUrl', label: 'YouTube', icon: 'mdi:youtube' },
  { key: 'tiktokUrl', label: 'TikTok', icon: 'ri:tiktok-fill' },
  { key: 'linkedinUrl', label: 'LinkedIn', icon: 'mdi:linkedin' },
];

export function unitSocialLinks(unit) {
  if (!unit) return [];
  return SOCIAL_NETWORKS.filter((item) => unit[item.key]).map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    href: unit[item.key],
  }));
}

export function socialUnit(unit, units = []) {
  return units.find((item) => item.isDefault) || unit || units[0] || null;
}
