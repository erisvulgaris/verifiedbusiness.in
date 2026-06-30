/**
 * Bharat Directory — Mock data for showcase
 * Realistic Indian business listings across cities, categories, and localities.
 * Used to populate the homepage, category listing, and business detail views.
 */

import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  Stethoscope,
  Wrench,
  GraduationCap,
  Car,
  ShoppingBag,
  Home,
  Briefcase,
  Sparkles,
  Pill,
  Scale,
  Camera,
  Scissors,
  Dumbbell,
  Flower2,
  Laptop,
} from "lucide-react";

export type BusinessStatus = "open" | "closed";
export type VerificationStatus = "verified" | "unverified";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  listingCount: number;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  website?: string;
  hours: string;
  openNow: boolean;
  verified: boolean;
  paymentMethods: string[];
  description: string;
  highlights: string[];
  yearsActive: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

/* ---------------- CATEGORIES ---------------- */
export const CATEGORIES: Category[] = [
  { id: "1", name: "Restaurants", slug: "restaurants", icon: UtensilsCrossed, listingCount: 248_190 },
  { id: "2", name: "Doctors & Clinics", slug: "doctors", icon: Stethoscope, listingCount: 184_502 },
  { id: "3", name: "Home Services", slug: "home-services", icon: Wrench, listingCount: 156_778 },
  { id: "4", name: "Education", slug: "education", icon: GraduationCap, listingCount: 132_415 },
  { id: "5", name: "Automotive", slug: "automotive", icon: Car, listingCount: 98_320 },
  { id: "6", name: "Shopping", slug: "shopping", icon: ShoppingBag, listingCount: 312_540 },
  { id: "7", name: "Real Estate", slug: "real-estate", icon: Home, listingCount: 76_890 },
  { id: "8", name: "Legal Services", slug: "legal", icon: Scale, listingCount: 42_105 },
  { id: "9", name: "Pharmacies", slug: "pharmacies", icon: Pill, listingCount: 68_220 },
  { id: "10", name: "Beauty & Salon", slug: "beauty", icon: Scissors, listingCount: 145_830 },
  { id: "11", name: "Photography", slug: "photography", icon: Camera, listingCount: 38_410 },
  { id: "12", name: "Fitness", slug: "fitness", icon: Dumbbell, listingCount: 28_965 },
];

/* ---------------- FEATURED CATEGORIES (homepage grid) ---------------- */
export const FEATURED_CATEGORIES = CATEGORIES.slice(0, 8);

/* ---------------- BUSINESSES ---------------- */
export const BUSINESSES: Business[] = [
  {
    id: "b1",
    name: "Sankalp South Indian Restaurant",
    category: "Restaurants",
    categorySlug: "restaurants",
    rating: 4.6,
    reviewCount: 2841,
    address: "Shop 14, Phoenix Marketcity, Whitefield Main Road",
    locality: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560048",
    phone: "+91 80 4900 1234",
    website: "sankalprestaurants.com",
    hours: "11:00 AM – 11:00 PM",
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cash"],
    description:
      "Serving authentic South Indian vegetarian cuisine since 1981. Known for filter coffee, masala dosa, and a thali that locals travel across the city for. Family-friendly seating, hygienic kitchen, and consistent quality across three decades of operation.",
    highlights: [
      "Pure vegetarian kitchen",
      "AC family dining hall",
      "Online table reservation",
      "Bulk order catering available",
    ],
    yearsActive: 23,
  },
  {
    id: "b2",
    name: "Aster CMI Multispeciality Hospital",
    category: "Doctors & Clinics",
    categorySlug: "doctors",
    rating: 4.4,
    reviewCount: 1820,
    address: "43, Bellary Road, Sahakara Nagar",
    locality: "Sahakara Nagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560092",
    phone: "+91 80 4342 0100",
    website: "astercmi.in",
    hours: "Open 24 hours",
    openNow: true,
    verified: true,
    paymentMethods: ["Cashless Insurance", "UPI", "Cards"],
    description:
      "NABH-accredited 500-bed multispeciality hospital offering cardiology, neurology, oncology, orthopaedics, and 24/7 emergency care. Senior consultants, modular operation theatres, and an in-house diagnostic lab with NABL certification.",
    highlights: [
      "24/7 emergency & trauma care",
      "Cashless insurance across 30 providers",
      "NABH & NABL accredited",
      "Air ambulance available",
    ],
    yearsActive: 12,
  },
  {
    id: "b3",
    name: "Urban Company Home Services",
    category: "Home Services",
    categorySlug: "home-services",
    rating: 4.3,
    reviewCount: 9620,
    address: "Prestige Tech Park, Marathahalli – Sarjapur Ring Road",
    locality: "Kadubeesanahalli",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    phone: "+91 90000 11122",
    website: "urbancompany.com",
    hours: "7:00 AM – 10:00 PM",
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Wallets"],
    description:
      "Background-verified professionals for AC service, deep cleaning, plumbing, electrical repairs, and salon-at-home. Transparent pricing, photo-uploaded service reports, and a 30-day service guarantee on every booking.",
    highlights: [
      "Background-verified professionals",
      "30-day service guarantee",
      "Transparent upfront pricing",
      "Same-day slots available",
    ],
    yearsActive: 9,
  },
  {
    id: "b4",
    name: "Allen Career Institute — Kota Branch",
    category: "Education",
    categorySlug: "education",
    rating: 4.5,
    reviewCount: 4210,
    address: "S-14, Talwandi, Near CA Road",
    locality: "Talwandi",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324005",
    phone: "+91 744 275 0000",
    website: "allen.ac.in",
    hours: "8:00 AM – 8:00 PM",
    openNow: false,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cheque", "Cash"],
    description:
      "Coaching for JEE (Main + Advanced) and NEET-UG. Hostel partner network, doubt-resolution sessions, and the country's largest curated question bank. Batches start in April and July every year with scholarship tests in March.",
    highlights: [
      "JEE & NEET full-time batches",
      "Hostel assistance cell",
      "Periodic test series with All-India rank",
      "Scholarship up to 90% via ASAT",
    ],
    yearsActive: 36,
  },
  {
    id: "b5",
    name: "Carz Service Hub — Multi-Brand Garage",
    category: "Automotive",
    categorySlug: "automotive",
    rating: 4.2,
    reviewCount: 1180,
    address: "Plot 22, MIDC Phase 1, Hinjewadi Marunji Road",
    locality: "Hinjewadi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411057",
    phone: "+91 98220 44556",
    hours: "9:00 AM – 7:00 PM",
    openNow: true,
    verified: false,
    paymentMethods: ["UPI", "Cards", "Cash"],
    description:
      "Multi-brand car service station for Maruti, Hyundai, Honda, Tata, and VW. Genuine parts with bill, digital service history, and free pickup-drop within 8 km. Manufacturer-equivalent warranty on repairs up to 6 months.",
    highlights: [
      "Genuine parts with itemised bill",
      "Free pickup & drop within 8 km",
      "6-month repair warranty",
      "Digital service history",
    ],
    yearsActive: 7,
  },
  {
    id: "b6",
    name: "Anand Sweets & Savouries",
    category: "Shopping",
    categorySlug: "shopping",
    rating: 4.7,
    reviewCount: 6450,
    address: "100 Feet Road, Indiranagar",
    locality: "Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    phone: "+91 80 2520 1212",
    website: "anandsweets.net",
    hours: "8:30 AM – 10:30 PM",
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cash", "Wallets"],
    description:
      "Heritage Bengaluru sweet shop since 1936. Kaju Katli, Mysore Pak, and dry-fruit gift hampers shipped pan-India. FSSAI-certified kitchen, no preservatives, and a separate sugar-free counter for diabetic customers.",
    highlights: [
      "Heritage brand since 1936",
      "Pan-India shipping",
      "Sugar-free options",
      "Festival gift hampers",
    ],
    yearsActive: 88,
  },
];

/* ---------------- FAQ ---------------- */
export const FAQS: FAQItem[] = [
  {
    id: "f1",
    question: "How are businesses verified on Bharat Directory?",
    answer:
      "Every listed business goes through a three-step verification process: GST or shop establishment proof, a phone call to confirm operating hours, and a physical address cross-check using Google Maps plus India Post pincode data. Verified listings carry a green Verified badge in the listing card and on the detail page. Unverified listings still appear but show an amber Unverified badge so users can make an informed choice.",
  },
  {
    id: "f2",
    question: "Is Bharat Directory free to use?",
    answer:
      "Yes, searching and viewing business details is completely free for end users. You can search across all 28 states, 780+ districts, and 19,000+ pincodes without an account. Businesses can claim a basic listing for free; paid plans only unlock premium placement, analytics, and multi-branch management.",
  },
  {
    id: "f3",
    question: "How often is the directory updated?",
    answer:
      "We re-verify contact details and operating hours every 90 days for verified listings. Pincode-level data is refreshed monthly using India Post's official dataset. If you spot outdated information, use the Report an Update link on any business detail page — corrections from users are typically reviewed within 48 hours.",
  },
  {
    id: "f4",
    question: "Which cities and pincodes does the platform cover?",
    answer:
      "Phase 1 covers all 4,000+ cities and towns listed in the Census of India 2011, mapped to all 19,000+ unique India Post pincodes. We are adding tier-3 and tier-4 towns in Phase 2 along with regional language interfaces in Hindi, Tamil, Telugu, Bengali, Marathi, and Kannada.",
  },
  {
    id: "f5",
    question: "Can I list my own business on the directory?",
    answer:
      "Absolutely. Click List Your Business in the top navigation, submit your GST or shop establishment number, address, and contact details. Our team verifies the listing within 3-5 business days. Once approved, you receive a Verified badge and access to a free dashboard to manage hours, photos, and offers.",
  },
  {
    id: "f6",
    question: "How do reviews and ratings work?",
    answer:
      "Only users who book a service or visit a business through the platform can leave a review — this keeps ratings authentic. Reviews are moderated within 24 hours for abusive or promotional content. Businesses can respond publicly to any review, and the average rating is recalculated in real time as new reviews arrive.",
  },
];

/* ---------------- FEATURE CARDS ---------------- */
export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FEATURES: FeatureItem[] = [
  {
    id: "ft1",
    title: "Verified listings only",
    description: "Every business is checked against GST and India Post pincode data.",
    icon: Sparkles,
  },
  {
    id: "ft2",
    title: "Pan-India coverage",
    description: "28 states, 780+ districts, 4,000+ cities, and 19,000+ pincodes.",
    icon: Home,
  },
  {
    id: "ft3",
    title: "Call in one tap",
    description: "Click-to-call with verified phone numbers — no copy-paste needed.",
    icon: Briefcase,
  },
  {
    id: "ft4",
    title: "Updated every 90 days",
    description: "Hours and contact details are re-verified quarterly for accuracy.",
    icon: Laptop,
  },
];

/* ---------------- HOMEPAGE HERO STATS ---------------- */
export const HERO_STATS = [
  { label: "Verified businesses", value: "1.2 Cr+" },
  { label: "Cities covered", value: "4,000+" },
  { label: "Pincodes mapped", value: "19,000+" },
];

/* ---------------- STYLE GUIDE: DO / DON'T EXAMPLES ---------------- */
export const DO_EXAMPLES = [
  "Use the warm #FAFAF8 base for page backgrounds",
  "Tighten letter-spacing by 0.3–0.5px on headings ≥22px",
  "Use 1px border as primary card boundary; reserve shadow for hover",
  "Left-align all body content; only hero tagline may be centred",
  "Render every null state with intentional empty-state copy",
];

export const DONT_EXAMPLES = [
  "Mix card borders AND drop shadows simultaneously as defaults",
  "Use pure #FFFFFF as page background — feels clinical at scale",
  "Stack more than two font families on a single page",
  "Centre body paragraphs or list items — left-align everything",
  "Show empty fields, dashes, or \"Not available\" in listing cards",
];

/* ---------------- FILTER OPTIONS (Category Listing Page) ---------------- */
export const FILTER_OPTIONS = {
  sortBy: [
    { label: "Relevance", value: "relevance" },
    { label: "Highest rated", value: "rating" },
    { label: "Most reviewed", value: "reviews" },
    { label: "Newly listed", value: "newest" },
  ],
  paymentMethods: ["UPI", "Cards", "Cash", "Cashless Insurance", "Wallets"],
  ratings: ["4.5+", "4.0+", "3.5+"],
  verification: ["Verified only", "Include unverified"],
};
