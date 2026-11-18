/** Site-wide contact details and links, so they are changed in one place. */
export const CONTACT_EMAIL = "matthew.claffey@northstardigitalconsulting.co.uk";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CV_URL = "/matt-claffey-cv.pdf";
export const LINKEDIN_URL = "https://www.linkedin.com/company/130174180";
export const GITHUB_URL = "https://github.com/code-mattclaffey";

export const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Case studies", href: "/#case-studies" },
  { label: "Blog", href: "/blog" },
] as const;
