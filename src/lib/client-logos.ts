import andLogo from "../assets/AND.svg";
import accentureLogo from "../assets/accenture.png";
import britishGasLogo from "../assets/britishgas.svg";
import cinchLogo from "../assets/cinch logo.svg";
import jdSportsLogo from "../assets/jdsports.svg";
import otbLogo from "../assets/otb_logo.svg";
import theRangeLogo from "../assets/therange.png";
import thinkMoneyLogo from "../assets/thinkmoney.png";

/** Client logo shown on a case study card that has no hero image. */
export interface ClientLogo {
  src: string;
  alt: string;
  /** Height in px, tuned per logo so the cards look balanced. */
  height: number;
}

const logo = (
  image: ImageMetadata,
  alt: string,
  height: number,
): ClientLogo => ({ src: image.src, alt, height });

/**
 * Case study slug to client logo. The logos are the same files as the
 * "Trusted by" carousel. Posts not listed here keep the plain gradient.
 */
const CLIENT_LOGOS: Record<string, ClientLogo> = {
  "case-study-jd-sports-checkout-rebuild": logo(jdSportsLogo, "JD Sports", 56),
  // The public health client is deliberately unnamed, so show Accenture.
  "case-study-public-health-clinical-advice-platform": logo(
    accentureLogo,
    "Accenture",
    36,
  ),
  "case-study-thinkmoney-mobile-banking-app": logo(
    thinkMoneyLogo,
    "thinkmoney",
    30,
  ),
  "case-study-the-range-greenfield-checkout": logo(
    theRangeLogo,
    "The Range",
    32,
  ),
  // Centrica's consumer brand.
  "case-study-centrica-boiler-quotes": logo(britishGasLogo, "British Gas", 36),
  "case-study-onthebeach-booking-path": logo(otbLogo, "On the Beach", 40),
  "case-study-and-digital-website-rebuild": logo(andLogo, "AND Digital", 36),
  "case-study-cinch-payment-and-finance": logo(cinchLogo, "Cinch", 32),
};

export function getClientLogo(slug: string): ClientLogo | null {
  return CLIENT_LOGOS[slug] ?? null;
}
