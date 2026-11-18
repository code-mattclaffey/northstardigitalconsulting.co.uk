/** Site-wide contact details and links, so they are changed in one place. */
export const CONTACT_EMAIL = "matthew.claffey@northstardigitalconsulting.co.uk";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CV_URL = "/matt-claffey-cv.pdf";
/**
 * Last day of the current contract (YYYY-MM-DD). From 30 days before this
 * date the footer CTA switches to its "available soon" look. Update it when
 * a new contract is signed.
 */
export const CONTRACT_END = "2027-01-31";
export const AVAILABILITY_WINDOW_DAYS = 30;
export const LINKEDIN_URL = "https://www.linkedin.com/company/130174180";
export const GITHUB_URL = "https://github.com/code-mattclaffey";

export const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Case studies", href: "/#case-studies" },
  { label: "Blog", href: "/blog" },
] as const;

/** Production origin, for absolute URLs in meta tags. */
export const SITE_URL = "https://northstardigitalconsulting.co.uk";
