/**
 * Sonovita social profiles. Each link comes from its env var at build time;
 * an icon without a URL is still shown, just not clickable.
 */
export const socialLinks = [
  { name: 'Facebook', url: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '' },
  { name: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '' },
  { name: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '' },
] as const

export type SocialNetwork = (typeof socialLinks)[number]['name']
