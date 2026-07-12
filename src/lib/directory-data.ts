/**
 * VerifiedBusiness.in — Mock data for showcase
 * Realistic Indian business listings across cities, categories, and localities.
 * Used to populate the homepage, category listing, business detail, comparison,
 * search, and location views.
 *
 * Iteration 1: Expanded from 6 → 24 businesses across 8 cities and 10 states.
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
  Heart,
  Building2,
  Banknote,
  Globe,
} from "lucide-react";

export type BusinessStatus = "open" | "closed";
export type VerificationStatus = "verified" | "unverified";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  listingCount: number;
  description: string;
}

export interface DayHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

/* ---------------- SUBSCRIPTION (paid listing model) ---------------- */
export type SubscriptionPlan = "free" | "starter" | "growth" | "premium" | "elite" | "enterprise" | "ultimate";
export type SubscriptionStatus = "active" | "expired" | "pending" | "cancelled";

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;        // ISO date
  endDate: string;          // ISO date (expiry)
  amount: number;           // in INR (₹)
  autoRenew: boolean;
}

/* ---------------- SUBSCRIPTION PLANS (pricing) ---------------- */
export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free" as const,
    label: "Free",
    price: 0,
    durationDays: 0,
    adCredit: 0,
    features: [
      "Basic listing",
      "No verification badge",
      "Standard placement",
      "Limited to 3 photos",
      "No ad campaigns",
    ],
  },
  starter: {
    id: "starter" as const,
    label: "Starter",
    price: 999,
    durationDays: 365,
    adCredit: 0,
    features: [
      "Verified badge",
      "10 photos",
      "Basic analytics (views, calls)",
      "Standard placement",
      "Self-serve ad management",
    ],
  },
  growth: {
    id: "growth" as const,
    label: "Growth",
    price: 4999,
    durationDays: 365,
    adCredit: 500,
    features: [
      "Everything in Starter",
      "Priority placement in search",
      "Respond to reviews",
      "50 photos",
      "₹500 ad credit included",
      "Lead generation (Get Quote)",
    ],
  },
  premium: {
    id: "premium" as const,
    label: "Premium",
    price: 14999,
    durationDays: 365,
    adCredit: 1000,
    features: [
      "Everything in Growth",
      "★ Featured badge",
      "Advanced analytics",
      "API access",
      "₹1,000 ad credit included",
      "Unlimited photos",
    ],
  },
  elite: {
    id: "elite" as const,
    label: "Elite",
    price: 29999,
    durationDays: 365,
    adCredit: 2000,
    features: [
      "Everything in Premium",
      "5 locations",
      "Dedicated support",
      "₹2,000 ad credit included",
      "Ad campaign management by us",
    ],
  },
  enterprise: {
    id: "enterprise" as const,
    label: "Enterprise",
    price: 49999,
    durationDays: 365,
    adCredit: 5000,
    features: [
      "Everything in Elite",
      "Unlimited locations",
      "White-label option",
      "₹5,000 ad credit included",
      "Custom integrations",
      "Priority ad approval",
    ],
  },
  ultimate: {
    id: "ultimate" as const,
    label: "Ultimate",
    price: 499999,
    durationDays: 365,
    adCredit: 50000,
    features: [
      "Everything in Enterprise",
      "₹50,000 ad credit included",
      "Dedicated account manager",
      "Custom SLA",
      "Premium ad placements",
      "Co-branded campaigns",
    ],
  },
} as const;

export type SubscriptionPlanKey = keyof typeof SUBSCRIPTION_PLANS;

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
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
  email?: string;
  hours: string;
  weeklyHours: DayHours[];
  openNow: boolean;
  verified: boolean;
  paymentMethods: string[];
  description: string;
  highlights: string[];
  yearsActive: number;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  photos?: number;
  reviews?: Review[];
  tags?: string[];
  subscription: Subscription;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface StateInfo {
  code: string;
  name: string;
  capital: string;
  cityCount: number;
  businessCount: number;
  featuredCities: string[];
}

/* ---------------- CATEGORIES ---------------- */
export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Restaurants",
    slug: "restaurants",
    icon: UtensilsCrossed,
    listingCount: 248_190,
    description: "From street food legends to fine-dining institutions — every cuisine, every budget.",
  },
  {
    id: "2",
    name: "Doctors & Clinics",
    slug: "doctors",
    icon: Stethoscope,
    listingCount: 184_502,
    description: "Verified multispeciality hospitals, family clinics, and specialist doctors near you.",
  },
  {
    id: "3",
    name: "Home Services",
    slug: "home-services",
    icon: Wrench,
    listingCount: 156_778,
    description: "AC repair, deep cleaning, plumbing, electricals — background-verified professionals.",
  },
  {
    id: "4",
    name: "Education",
    slug: "education",
    icon: GraduationCap,
    listingCount: 132_415,
    description: "Coaching institutes, schools, colleges, and skilling centres across India.",
  },
  {
    id: "5",
    name: "Automotive",
    slug: "automotive",
    icon: Car,
    listingCount: 98_320,
    description: "Multi-brand garages, authorised service centres, tyre shops, and car washes.",
  },
  {
    id: "6",
    name: "Shopping",
    slug: "shopping",
    icon: ShoppingBag,
    listingCount: 312_540,
    description: "Sweet shops, apparel stores, electronics, and gift hampers — pan-India shipping.",
  },
  {
    id: "7",
    name: "Real Estate",
    slug: "real-estate",
    icon: Home,
    listingCount: 76_890,
    description: "RERA-registered builders, brokers, and rental agents you can trust.",
  },
  {
    id: "8",
    name: "Legal Services",
    slug: "legal",
    icon: Scale,
    listingCount: 42_105,
    description: "Advocates, notaries, and corporate law firms across all major courts.",
  },
  {
    id: "9",
    name: "Pharmacies",
    slug: "pharmacies",
    icon: Pill,
    listingCount: 68_220,
    description: "24/7 chemists, surgical suppliers, and online medicine delivery.",
  },
  {
    id: "10",
    name: "Beauty & Salon",
    slug: "beauty",
    icon: Scissors,
    listingCount: 145_830,
    description: "Unisex salons, spas, and bridal makeup artists with hygiene-first protocols.",
  },
  {
    id: "11",
    name: "Photography",
    slug: "photography",
    icon: Camera,
    listingCount: 38_410,
    description: "Wedding photographers, studio shoots, and product photography specialists.",
  },
  {
    id: "12",
    name: "Fitness",
    slug: "fitness",
    icon: Dumbbell,
    listingCount: 28_965,
    description: "Gyms, yoga studios, crossfit boxes, and personal trainers near you.",
  },
];

/* ---------------- FEATURED CATEGORIES (homepage grid) ---------------- */
export const FEATURED_CATEGORIES = CATEGORIES.slice(0, 8);

/* ---------------- INDIA STATES (for Browse by Location) ---------------- */
export const INDIA_STATES: StateInfo[] = [
  {
    code: "KA",
    name: "Karnataka",
    capital: "Bengaluru",
    cityCount: 268,
    businessCount: 842_310,
    featuredCities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  },
  {
    code: "MH",
    name: "Maharashtra",
    capital: "Mumbai",
    cityCount: 412,
    businessCount: 1_942_180,
    featuredCities: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  },
  {
    code: "DL",
    name: "Delhi",
    capital: "New Delhi",
    cityCount: 58,
    businessCount: 1_184_602,
    featuredCities: ["New Delhi", "Dwarka", "Rohini", "Saket"],
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    capital: "Chennai",
    cityCount: 384,
    businessCount: 1_054_720,
    featuredCities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  },
  {
    code: "TG",
    name: "Telangana",
    capital: "Hyderabad",
    cityCount: 142,
    businessCount: 612_415,
    featuredCities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  },
  {
    code: "WB",
    name: "West Bengal",
    capital: "Kolkata",
    cityCount: 296,
    businessCount: 784_302,
    featuredCities: ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  },
  {
    code: "GJ",
    name: "Gujarat",
    capital: "Gandhinagar",
    cityCount: 248,
    businessCount: 712_045,
    featuredCities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  },
  {
    code: "RJ",
    name: "Rajasthan",
    capital: "Jaipur",
    cityCount: 222,
    businessCount: 485_120,
    featuredCities: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    capital: "Lucknow",
    cityCount: 632,
    businessCount: 1_354_810,
    featuredCities: ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  },
  {
    code: "KL",
    name: "Kerala",
    capital: "Thiruvananthapuram",
    cityCount: 159,
    businessCount: 421_090,
    featuredCities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
  },
  {
    code: "PB",
    name: "Punjab",
    capital: "Chandigarh",
    cityCount: 168,
    businessCount: 312_540,
    featuredCities: ["Ludhiana", "Amritsar", "Jalandhar", "Mohali"],
  },
  {
    code: "HR",
    name: "Haryana",
    capital: "Chandigarh",
    cityCount: 154,
    businessCount: 298_140,
    featuredCities: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  },
];

/* ---------------- HELPER: standard weekly hours ---------------- */
function stdHours(
  weekday: [string, string] = ["9:00 AM", "9:00 PM"],
  weekend: [string, string] = ["9:00 AM", "11:00 PM"],
  closedDays: string[] = [],
): DayHours[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => {
    const isWeekend = d === "Sat" || d === "Sun";
    const isClosed = closedDays.includes(d);
    const [open, close] = isClosed ? ["", ""] : isWeekend ? weekend : weekday;
    return { day: d, open, close, closed: isClosed };
  });
}

/* ---------------- BUSINESSES (24 listings across 8 cities) ---------------- */
export const BUSINESSES: Business[] = [
  /* 1. Bengaluru — Restaurants */
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
    email: "whitefield@sankalprestaurants.com",
    hours: "11:00 AM – 11:00 PM",
    weeklyHours: stdHours(["11:00 AM", "11:00 PM"], ["11:00 AM", "11:30 PM"]),
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
    priceRange: "$$",
    photos: 48,
    tags: ["South Indian", "Vegetarian", "Family dining", "Filter coffee"],
    reviews: [
      {
        id: "r1",
        author: "Priya Menon",
        initials: "PM",
        rating: 5,
        date: "2 weeks ago",
        text: "The masala dosa here is unbeatable — crispy outside, soft inside, and the chutneys are freshly ground. Filter coffee is the perfect end to the meal.",
        helpful: 42,
      },
      {
        id: "r2",
        author: "Rahul Krishnan",
        initials: "RK",
        rating: 4,
        date: "1 month ago",
        text: "Consistent quality across visits. The thali is generous and reasonably priced. Gets crowded on weekends — book ahead.",
        helpful: 18,
      },
      {
        id: "r3",
        author: "Anita Reddy",
        initials: "AR",
        rating: 5,
        date: "2 months ago",
        text: "Been coming here for 15 years. The rava idli and sambar vada are still the best in Whitefield.",
        helpful: 31,
      },
    ],
  },
  /* 2. Bengaluru — Doctors */
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
    email: "care@astercmi.in",
    hours: "Open 24 hours",
    weeklyHours: stdHours(["12:00 AM", "11:59 PM"], ["12:00 AM", "11:59 PM"]),
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
    priceRange: "$$$",
    photos: 32,
    tags: ["Multispeciality", "Emergency", "Cashless insurance", "NABH"],
    reviews: [
      {
        id: "r4",
        author: "Karthik Subramanian",
        initials: "KS",
        rating: 5,
        date: "1 week ago",
        text: "Took my father for a cardiac emergency at 2 AM. The response was immediate and the cardiologist was thorough. Saved his life.",
        helpful: 56,
      },
      {
        id: "r5",
        author: "Lakshmi Nair",
        initials: "LN",
        rating: 4,
        date: "3 weeks ago",
        text: "Clean facilities, professional staff. Wait times for OPD can be long — book appointment online to skip the queue.",
        helpful: 22,
      },
    ],
  },
  /* 3. Bengaluru — Home Services */
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
    weeklyHours: stdHours(["7:00 AM", "10:00 PM"], ["7:00 AM", "10:00 PM"]),
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
    priceRange: "$$",
    photos: 24,
    tags: ["AC repair", "Deep cleaning", "Plumbing", "Salon at home"],
    reviews: [
      {
        id: "r6",
        author: "Sneha Patel",
        initials: "SP",
        rating: 5,
        date: "5 days ago",
        text: "Booked a deep cleaning — the team was on time, polite, and the kitchen looks brand new. The app updates after each task are reassuring.",
        helpful: 88,
      },
      {
        id: "r7",
        author: "Vikram Joshi",
        initials: "VJ",
        rating: 3,
        date: "2 weeks ago",
        text: "AC service was decent but the technician tried to upsell a service contract. Stuck to my original request and it was fine.",
        helpful: 14,
      },
    ],
  },
  /* 4. Kota — Education */
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
    email: "kota@allen.ac.in",
    hours: "8:00 AM – 8:00 PM",
    weeklyHours: stdHours(["8:00 AM", "8:00 PM"], ["8:00 AM", "8:00 PM"], ["Sun"]),
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
    priceRange: "$$$",
    photos: 56,
    tags: ["JEE coaching", "NEET coaching", "Scholarship", "Hostel assistance"],
    reviews: [
      {
        id: "r8",
        author: "Rohit Sharma",
        initials: "RS",
        rating: 5,
        date: "1 month ago",
        text: "Cleared JEE Advanced because of Allen. The teachers are accessible and the test series is closest to the real exam.",
        helpful: 124,
      },
      {
        id: "r9",
        author: "Deepak Verma",
        initials: "DV",
        rating: 4,
        date: "2 months ago",
        text: "Stressful environment but worth it if you are serious. Hostel arrangements were decent — make sure you visit before booking.",
        helpful: 38,
      },
    ],
  },
  /* 5. Pune — Automotive */
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
    weeklyHours: stdHours(["9:00 AM", "7:00 PM"], ["9:00 AM", "5:00 PM"], ["Sun"]),
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
    priceRange: "$$",
    photos: 18,
    tags: ["Multi-brand service", "Pickup & drop", "Warranty repairs"],
    reviews: [
      {
        id: "r10",
        author: "Aditi Kulkarni",
        initials: "AK",
        rating: 4,
        date: "3 weeks ago",
        text: "Got my Hyundai i20 serviced. Picked up on time, returned clean, and the bill was itemised. No surprises.",
        helpful: 19,
      },
    ],
  },
  /* 6. Bengaluru — Shopping */
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
    email: "orders@anandsweets.net",
    hours: "8:30 AM – 10:30 PM",
    weeklyHours: stdHours(["8:30 AM", "10:30 PM"], ["8:30 AM", "11:00 PM"]),
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
    priceRange: "$$",
    photos: 42,
    tags: ["Sweets", "Savouries", "Gift hampers", "Heritage brand"],
    reviews: [
      {
        id: "r11",
        author: "Meera Iyer",
        initials: "MI",
        rating: 5,
        date: "1 week ago",
        text: "Ordered Diwali hampers for the family — packaging was beautiful and the Mysore Pak melted in the mouth. Worth every rupee.",
        helpful: 67,
      },
      {
        id: "r12",
        author: "Sanjay Gupta",
        initials: "SG",
        rating: 5,
        date: "3 weeks ago",
        text: "Sugar-free Kaju Katli for my father. Tastes just like the regular one. Thank you for thinking of diabetic customers.",
        helpful: 41,
      },
    ],
  },
  /* 7. Mumbai — Real Estate */
  {
    id: "b7",
    name: "Oberoi Realty — Sales Office",
    category: "Real Estate",
    categorySlug: "real-estate",
    rating: 4.3,
    reviewCount: 412,
    address: "Oberoi Gardens, Off Western Express Highway, Goregaon East",
    locality: "Goregaon East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400063",
    phone: "+91 22 6172 0000",
    website: "oberoirealty.com",
    hours: "10:00 AM – 7:00 PM",
    weeklyHours: stdHours(["10:00 AM", "7:00 PM"], ["10:00 AM", "7:00 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["Cheque", "RTGS", "Cards"],
    description:
      "RERA-registered developer of premium residential towers across Mumbai. Current projects include 3 BHK and 4 BHK sea-view apartments in Goregaon, Andheri, and Borivali. Site visits by appointment, transparent pricing, and MahaRERA compliance on every listing.",
    highlights: [
      "RERA-registered developer",
      "Premium sea-view apartments",
      "Transparent pricing — no brokerage",
      "Site visit by appointment",
    ],
    yearsActive: 32,
    priceRange: "$$$$",
    photos: 28,
    tags: ["RERA registered", "Premium apartments", "Sea view", "No brokerage"],
    reviews: [
      {
        id: "r13",
        author: "Rajesh Mehta",
        initials: "RM",
        rating: 4,
        date: "2 months ago",
        text: "Booked a 3 BHK at Goregaon. The sales team was transparent about pricing and timelines. Construction quality looks promising.",
        helpful: 12,
      },
    ],
  },
  /* 8. New Delhi — Legal */
  {
    id: "b8",
    name: "Khaitan & Co — Advocates",
    category: "Legal Services",
    categorySlug: "legal",
    rating: 4.6,
    reviewCount: 284,
    address: "Khaitan House, B-10, Greater Kailash Enclave II",
    locality: "Greater Kailash II",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110048",
    phone: "+91 11 4606 5000",
    website: "khaitanco.com",
    hours: "9:30 AM – 6:30 PM",
    weeklyHours: stdHours(["9:30 AM", "6:30 PM"], ["10:00 AM", "2:00 PM"], ["Sun"]),
    openNow: false,
    verified: true,
    paymentMethods: ["Cheque", "RTGS", "Cards"],
    description:
      "Full-service corporate law firm established in 1911. Practice areas include M&A, banking & finance, disputes, intellectual property, and tax. Offices in New Delhi, Mumbai, Bengaluru, and Kolkata. Senior partners available by appointment.",
    highlights: [
      "Established 1911 — over a century old",
      "Offices in 4 metros",
      "M&A, IP, banking & disputes",
      "Senior partners by appointment",
    ],
    yearsActive: 114,
    priceRange: "$$$$",
    photos: 14,
    tags: ["Corporate law", "M&A", "Intellectual property", "Disputes"],
    reviews: [
      {
        id: "r14",
        author: "Anand Deshpande",
        initials: "AD",
        rating: 5,
        date: "1 month ago",
        text: "Handled our company's M&A transaction with precision. Communication was clear throughout — they explained every clause in plain English.",
        helpful: 9,
      },
    ],
  },
  /* 9. Chennai — Pharmacies */
  {
    id: "b9",
    name: "Apollo Pharmacy — 24/7 Branch",
    category: "Pharmacies",
    categorySlug: "pharmacies",
    rating: 4.4,
    reviewCount: 3120,
    address: "12, TTK Road, Alwarpet",
    locality: "Alwarpet",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600018",
    phone: "+91 44 2498 4444",
    website: "apollopharmacy.in",
    hours: "Open 24 hours",
    weeklyHours: stdHours(["12:00 AM", "11:59 PM"], ["12:00 AM", "11:59 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cash", "Insurance"],
    description:
      "24/7 Apollo Pharmacy branch with a wide inventory of chronic-disease medicines, surgical supplies, and Ayurvedic products. Cold-chain compliant storage for insulin and biologics. Home delivery within 5 km in under 90 minutes.",
    highlights: [
      "Open 24 hours, every day",
      "Cold-chain compliant storage",
      "Home delivery in under 90 min",
      "Insurance reimbursement support",
    ],
    yearsActive: 24,
    priceRange: "$",
    photos: 16,
    tags: ["24/7", "Home delivery", "Chronic medicines", "Surgical supplies"],
    reviews: [
      {
        id: "r15",
        author: "Lakshmi Venkat",
        initials: "LV",
        rating: 5,
        date: "4 days ago",
        text: "Needed insulin at 3 AM during a travel emergency. They had it in stock and even helped me store it correctly. Lifesavers.",
        helpful: 38,
      },
    ],
  },
  /* 10. Hyderabad — Beauty */
  {
    id: "b10",
    name: "Naturals Salon — Jubilee Hills",
    category: "Beauty & Salon",
    categorySlug: "beauty",
    rating: 4.5,
    reviewCount: 2840,
    address: "Road No 36, Jubilee Hills",
    locality: "Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    phone: "+91 40 2354 1122",
    website: "naturalssalon.in",
    hours: "10:00 AM – 8:00 PM",
    weeklyHours: stdHours(["10:00 AM", "8:00 PM"], ["10:00 AM", "8:00 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Wallets"],
    description:
      "Unisex salon with trained stylists for haircuts, colour, keratin, facials, and bridal makeup. Hygiene-first protocol with single-use kits for threading and waxing. Online booking with slot reminders and a 7-day service redo guarantee.",
    highlights: [
      "Hygiene-first single-use kits",
      "Bridal makeup specialist",
      "7-day service redo guarantee",
      "Online booking with reminders",
    ],
    yearsActive: 18,
    priceRange: "$$",
    photos: 36,
    tags: ["Haircut", "Keratin", "Bridal makeup", "Facial"],
    reviews: [
      {
        id: "r16",
        author: "Sindhu Reddy",
        initials: "SR",
        rating: 5,
        date: "1 week ago",
        text: "Got my keratin treatment done here. The stylist explained the process, showed the products, and the result lasted 5 months.",
        helpful: 22,
      },
    ],
  },
  /* 11. Jaipur — Photography */
  {
    id: "b11",
    name: "Studio Lotus — Wedding Photographers",
    category: "Photography",
    categorySlug: "photography",
    rating: 4.8,
    reviewCount: 184,
    address: "C-Scheme, Ashok Marg",
    locality: "C-Scheme",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    phone: "+91 141 237 8800",
    website: "studiolotus.in",
    email: "hello@studiolotus.in",
    hours: "11:00 AM – 7:00 PM",
    weeklyHours: stdHours(["11:00 AM", "7:00 PM"], ["11:00 AM", "7:00 PM"], ["Sun"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cheque", "RTGS"],
    description:
      "Award-winning wedding photography studio specialising in candid, documentary-style coverage of multi-day Indian weddings. In-house team of 8 photographers and 3 cinematographers. Pre-wedding shoots at heritage locations across Rajasthan.",
    highlights: [
      "Candid & documentary style",
      "Team of 8 photographers",
      "Pre-wedding shoots at heritage sites",
      "Cinematography & drone coverage",
    ],
    yearsActive: 14,
    priceRange: "$$$$",
    photos: 124,
    tags: ["Wedding photography", "Candid", "Cinematography", "Pre-wedding"],
    reviews: [
      {
        id: "r17",
        author: "Ananya Bhatt",
        initials: "AB",
        rating: 5,
        date: "2 weeks ago",
        text: "Booked them for our 3-day Jaipur wedding. Every ritual was captured with so much care — the candid moments are now our favourites.",
        helpful: 28,
      },
    ],
  },
  /* 12. Mumbai — Fitness */
  {
    id: "b12",
    name: "Cult.fit — Bandra West",
    category: "Fitness",
    categorySlug: "fitness",
    rating: 4.4,
    reviewCount: 5240,
    address: "Linking Road, Near Hill Road",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    phone: "+91 22 6900 1234",
    website: "cult.fit",
    hours: "5:30 AM – 11:00 PM",
    weeklyHours: stdHours(["5:30 AM", "11:00 PM"], ["6:00 AM", "10:00 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Wallets"],
    description:
      "Group fitness studio offering HRX, S&C, Yoga, Boxing, and Dance Fitness. Certified trainers, online class booking via the app, and a free 7-day trial for new members. Cross-city access across 200+ Cult centres in India.",
    highlights: [
      "Cross-city access — 200+ centres",
      "Free 7-day trial",
      "Certified trainers",
      "App-based class booking",
    ],
    yearsActive: 8,
    priceRange: "$$",
    photos: 22,
    tags: ["Group fitness", "Yoga", "Boxing", "Strength training"],
    reviews: [
      {
        id: "r18",
        author: "Aditya Kulkarni",
        initials: "AK",
        rating: 4,
        date: "1 month ago",
        text: "Great energy in the S&C classes. App booking is smooth. Can get crowded in the evenings — book 30 min ahead.",
        helpful: 19,
      },
    ],
  },
  /* 13. Kolkata — Restaurants */
  {
    id: "b13",
    name: "6 Ballygunge Place",
    category: "Restaurants",
    categorySlug: "restaurants",
    rating: 4.5,
    reviewCount: 4180,
    address: "6 Ballygunge Place, Ballygunge",
    locality: "Ballygunge",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700019",
    phone: "+91 33 4004 1111",
    website: "6ballygungeplace.com",
    hours: "12:00 PM – 10:30 PM",
    weeklyHours: stdHours(["12:00 PM", "10:30 PM"], ["12:00 PM", "11:00 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cash"],
    description:
      "Heritage Bengali restaurant in a restored colonial-era bungalow. Famous for its fish moilee, mutton biryani, and the traditional Bengali thali served on bell-metal ware. Pre-book the thali on weekends — it sells out by 1 PM.",
    highlights: [
      "Heritage Bengali cuisine",
      "Colonial-era bungalow setting",
      "Bengali thali on bell-metal ware",
      "Weekend thali sells out — pre-book",
    ],
    yearsActive: 27,
    priceRange: "$$",
    photos: 64,
    tags: ["Bengali cuisine", "Heritage restaurant", "Biryani", "Thali"],
    reviews: [
      {
        id: "r19",
        author: "Arjun Bose",
        initials: "AB",
        rating: 5,
        date: "3 weeks ago",
        text: "The fish moilee is the best I've had outside a Bengali home. The thali on bell-metal is a beautiful touch.",
        helpful: 54,
      },
    ],
  },
  /* 14. Ahmedabad — Education */
  {
    id: "b14",
    name: "IIM Ahmedabad — Executive Education",
    category: "Education",
    categorySlug: "education",
    rating: 4.8,
    reviewCount: 612,
    address: "Vastrapur, IIM Road",
    locality: "Vastrapur",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
    phone: "+91 79 6632 0000",
    website: "iima.ac.in",
    hours: "9:00 AM – 6:00 PM",
    weeklyHours: stdHours(["9:00 AM", "6:00 PM"], ["9:00 AM", "6:00 PM"], ["Sun"]),
    openNow: true,
    verified: true,
    paymentMethods: ["Cheque", "RTGS", "Cards", "UPI"],
    description:
      "India's #1 ranked business school offering executive education programmes for senior managers and founders. Open-enrolment programmes run throughout the year in leadership, strategy, finance, and digital transformation. Residential on-campus format.",
    highlights: [
      "India's #1 B-school (NIRF)",
      "Senior leadership programmes",
      "Residential on-campus format",
      "Open enrolment — no application required",
    ],
    yearsActive: 62,
    priceRange: "$$$$",
    photos: 88,
    tags: ["MBA", "Executive education", "Leadership", "Strategy"],
    reviews: [
      {
        id: "r20",
        author: "Prakash Shah",
        initials: "PS",
        rating: 5,
        date: "1 month ago",
        text: "Attended the Senior Leadership Programme. The faculty calibre and peer learning are unmatched in India.",
        helpful: 47,
      },
    ],
  },
  /* 15. Bengaluru — Shopping (Electronics) */
  {
    id: "b15",
    name: "Croma Electronics — Koramangala",
    category: "Shopping",
    categorySlug: "shopping",
    rating: 4.2,
    reviewCount: 3820,
    address: "5th Block, 80 Feet Road, Koramangala",
    locality: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560095",
    phone: "+91 80 4900 9999",
    website: "croma.com",
    hours: "10:00 AM – 9:30 PM",
    weeklyHours: stdHours(["10:00 AM", "9:30 PM"], ["10:00 AM", "9:30 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Wallets", "EMI", "Cash"],
    description:
      "Tata-owned consumer electronics retailer stocking 6000+ products across smartphones, laptops, appliances, and accessories. Price-match guarantee, no-cost EMI on all major cards, and same-day home delivery within Bengaluru for orders before 6 PM.",
    highlights: [
      "Price-match guarantee",
      "No-cost EMI on all cards",
      "Same-day delivery in Bengaluru",
      "Tata-owned — trusted brand",
    ],
    yearsActive: 17,
    priceRange: "$$",
    photos: 32,
    tags: ["Electronics", "Smartphones", "Appliances", "EMI"],
    reviews: [
      {
        id: "r21",
        author: "Harish Rao",
        initials: "HR",
        rating: 4,
        date: "2 weeks ago",
        text: "Bought a microwave — same-day delivery worked as advertised. The salesperson knew the products well.",
        helpful: 16,
      },
    ],
  },
  /* 16. New Delhi — Restaurants */
  {
    id: "b16",
    name: "Indian Accent — The Lodhi",
    category: "Restaurants",
    categorySlug: "restaurants",
    rating: 4.7,
    reviewCount: 2840,
    address: "The Lodhi, Lodhi Road",
    locality: "Lodhi Road",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110003",
    phone: "+91 11 6617 5151",
    website: "indianaccent.com",
    email: "reservations@indianaccent.com",
    hours: "12:30 PM – 3:00 PM, 7:00 PM – 11:30 PM",
    weeklyHours: stdHours(["12:30 PM", "11:30 PM"], ["12:30 PM", "11:30 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "American Express"],
    description:
      "Award-winning modern Indian fine-dining restaurant consistently ranked among Asia's 50 best. Chef Manish Mehrotra's tasting menu reinvents classics — blue cheese naan, pulled pork phulka tacos, and miso salmon kachori. Reservation-only.",
    highlights: [
      "Asia's 50 Best Restaurants",
      "Tasting menu by Chef Manish Mehrotra",
      "Reservation-only",
      "Modern Indian fine dining",
    ],
    yearsActive: 14,
    priceRange: "$$$$",
    photos: 96,
    tags: ["Fine dining", "Tasting menu", "Modern Indian", "Award-winning"],
    reviews: [
      {
        id: "r22",
        author: "Vandana Khanna",
        initials: "VK",
        rating: 5,
        date: "1 month ago",
        text: "The blue cheese naan alone is worth the trip. Every dish is a clever reinvention of a classic. Service is impeccable.",
        helpful: 73,
      },
    ],
  },
  /* 17. Pune — Home Services (Interior design) */
  {
    id: "b17",
    name: "Livspace — Pune Studio",
    category: "Home Services",
    categorySlug: "home-services",
    rating: 4.1,
    reviewCount: 6420,
    address: "Baner-Balewadi Road, Balewadi",
    locality: "Balewadi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    phone: "+91 99800 22211",
    website: "livspace.com",
    hours: "10:00 AM – 8:00 PM",
    weeklyHours: stdHours(["10:00 AM", "8:00 PM"], ["10:00 AM", "8:00 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "EMI", "Cheque"],
    description:
      "End-to-end interior design and execution studio. 3D walkthrough before construction, fixed-price quotes with no hidden charges, and a 10-year warranty on structural work. Modular kitchens delivered in 45 days and full-home interiors in 90 days.",
    highlights: [
      "10-year structural warranty",
      "Fixed-price — no hidden charges",
      "Modular kitchens in 45 days",
      "Full-home interiors in 90 days",
    ],
    yearsActive: 11,
    priceRange: "$$$",
    photos: 76,
    tags: ["Interior design", "Modular kitchen", "Full-home", "Warranty"],
    reviews: [
      {
        id: "r23",
        author: "Saurabh Pandey",
        initials: "SP",
        rating: 4,
        date: "1 month ago",
        text: "Got our 3 BHK done — design walkthrough was useful, execution took 95 days instead of 90 but the team communicated throughout.",
        helpful: 33,
      },
    ],
  },
  /* 18. Coimbatore — Automotive */
  {
    id: "b18",
    name: "Mahindra First Choice — Coimbatore",
    category: "Automotive",
    categorySlug: "automotive",
    rating: 4.0,
    reviewCount: 540,
    address: "Avinashi Road, Near Hope College",
    locality: "Peelamedu",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641004",
    phone: "+91 422 456 7890",
    website: "mahindrafirstchoice.com",
    hours: "9:30 AM – 7:00 PM",
    weeklyHours: stdHours(["9:30 AM", "7:00 PM"], ["9:30 AM", "5:00 PM"], ["Sun"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Loans", "Cash"],
    description:
      "Certified pre-owned car dealer with 118-point inspection, 1-year warranty, and 7-day money-back guarantee. Financing through Mahindra Finance with same-day approval for salaried buyers. Stock of 80+ verified pre-owned cars across brands.",
    highlights: [
      "118-point inspection",
      "1-year warranty",
      "7-day money-back guarantee",
      "Same-day loan approval",
    ],
    yearsActive: 14,
    priceRange: "$$",
    photos: 24,
    tags: ["Pre-owned cars", "Certified", "Warranty", "Finance"],
    reviews: [
      {
        id: "r24",
        author: "Murugan S",
        initials: "MS",
        rating: 4,
        date: "2 months ago",
        text: "Bought a 3-year-old Swift. The inspection report was detailed and transparent. Financing was completed same-day.",
        helpful: 8,
      },
    ],
  },
  /* 19. Surat — Shopping (Textiles) */
  {
    id: "b19",
    name: "Ring Road Textile Market — Surat",
    category: "Shopping",
    categorySlug: "shopping",
    rating: 4.3,
    reviewCount: 1820,
    address: "Ring Road, Near Sahara Darwaja",
    locality: "Sahara Darwaja",
    city: "Surat",
    state: "Gujarat",
    pincode: "395002",
    phone: "+91 261 245 6789",
    hours: "10:00 AM – 8:00 PM",
    weeklyHours: stdHours(["10:00 AM", "8:00 PM"], ["10:00 AM", "6:00 PM"], ["Sun"]),
    openNow: true,
    verified: false,
    paymentMethods: ["UPI", "Cards", "Cash", "Cheque"],
    description:
      "Surat's largest wholesale-cum-retail textile market. Sarees, dress materials, and synthetic fabrics direct from weavers. Bulk discounts on orders above ₹10,000, and pan-India dispatch via registered transport. Best time to visit — October to March.",
    highlights: [
      "Direct from weavers — no middlemen",
      "Bulk discounts above ₹10,000",
      "Pan-India dispatch",
      "Best season: October to March",
    ],
    yearsActive: 38,
    priceRange: "$",
    photos: 18,
    tags: ["Textiles", "Sarees", "Wholesale", "Direct from weavers"],
    reviews: [
      {
        id: "r25",
        author: "Hetal Patel",
        initials: "HP",
        rating: 4,
        date: "3 weeks ago",
        text: "Great variety at wholesale prices. Cash-only in many shops — carry enough or use UPI.",
        helpful: 21,
      },
    ],
  },
  /* 20. Chandigarh — Beauty */
  {
    id: "b20",
    name: "YLG Salon — Sector 8",
    category: "Beauty & Salon",
    categorySlug: "beauty",
    rating: 4.4,
    reviewCount: 1620,
    address: "Sector 8-C, Madhya Marg",
    locality: "Sector 8",
    city: "Chandigarh",
    state: "Punjab",
    pincode: "160008",
    phone: "+91 172 504 6789",
    website: "ylg.in",
    hours: "10:00 AM – 8:00 PM",
    weeklyHours: stdHours(["10:00 AM", "8:00 PM"], ["10:00 AM", "8:00 PM"]),
    openNow: false,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Wallets"],
    description:
      "Boutique unisex salon with a focus on hair colour, hair spa, and bridal packages. International products — L'Oréal Professional, Schwarzkopf, and Kérastase. Loyalty programme with cashback on every visit and birthday-month free hair spa.",
    highlights: [
      "International product range",
      "Bridal packages available",
      "Loyalty cashback programme",
      "Birthday-month free hair spa",
    ],
    yearsActive: 12,
    priceRange: "$$$",
    photos: 28,
    tags: ["Hair colour", "Hair spa", "Bridal", "Loyalty programme"],
    reviews: [
      {
        id: "r26",
        author: "Navleen Kaur",
        initials: "NK",
        rating: 4,
        date: "1 month ago",
        text: "Got global hair colour done. The stylist understood the exact shade I wanted. Slightly pricey but worth it.",
        helpful: 12,
      },
    ],
  },
  /* 21. Bengaluru — Legal */
  {
    id: "b21",
    name: "AZB & Partners — Bengaluru Office",
    category: "Legal Services",
    categorySlug: "legal",
    rating: 4.7,
    reviewCount: 96,
    address: "Prestige Atlanta, 80 Feet Road, Koramangala",
    locality: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560095",
    phone: "+91 80 6900 4500",
    website: "azbpartners.com",
    hours: "9:30 AM – 6:30 PM",
    weeklyHours: stdHours(["9:30 AM", "6:30 PM"], ["10:00 AM", "2:00 PM"], ["Sun"]),
    openNow: true,
    verified: true,
    paymentMethods: ["Cheque", "RTGS", "Cards"],
    description:
      "Top-tier law firm advising on private equity, venture capital, and cross-border M&A. Bengaluru office works closely with the startup ecosystem on founder-side fund-raises, ESOPs, and IPO readiness. Senior partners available for retained clients only.",
    highlights: [
      "PE, VC & startup practice",
      "Cross-border M&A expertise",
      "Founder-side fund-raises",
      "IPO readiness advisory",
    ],
    yearsActive: 24,
    priceRange: "$$$$",
    photos: 12,
    tags: ["PE/VC", "Startups", "M&A", "IPO"],
    reviews: [
      {
        id: "r27",
        author: "Kavya Reddy",
        initials: "KR",
        rating: 5,
        date: "2 months ago",
        text: "Handled our Series B with precision. Term sheet review was thorough and saved us from a bad liquidation preference.",
        helpful: 14,
      },
    ],
  },
  /* 22. Hyderabad — Doctors */
  {
    id: "b22",
    name: "KIMS Hospitals — Secunderabad",
    category: "Doctors & Clinics",
    categorySlug: "doctors",
    rating: 4.5,
    reviewCount: 8240,
    address: "1-8-31/1, Minister Road, Krishna Nagar",
    locality: "Krishna Nagar",
    city: "Secunderabad",
    state: "Telangana",
    pincode: "500003",
    phone: "+91 40 4488 5000",
    website: "kimshospitals.com",
    hours: "Open 24 hours",
    weeklyHours: stdHours(["12:00 AM", "11:59 PM"], ["12:00 AM", "11:59 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["Cashless Insurance", "UPI", "Cards", "Cash"],
    description:
      "1,000-bed NABH-accredited multispeciality hospital with institutes for cardiac sciences, neurosciences, oncology, and orthopaedics. South India's largest lung transplant programme. 24/7 trauma centre with helipad for air-ambulance transfers.",
    highlights: [
      "NABH-accredited 1,000 beds",
      "South India's largest lung transplant",
      "24/7 trauma with helipad",
      "Cashless across 40+ insurers",
    ],
    yearsActive: 28,
    priceRange: "$$$",
    photos: 44,
    tags: ["Multispeciality", "Transplant", "Trauma", "NABH"],
    reviews: [
      {
        id: "r28",
        author: "Venkatesh Rao",
        initials: "VR",
        rating: 5,
        date: "2 weeks ago",
        text: "My mother's knee replacement was handled exceptionally. Physiotherapy team was patient and thorough.",
        helpful: 26,
      },
    ],
  },
  /* 23. Kochi — Fitness */
  {
    id: "b23",
    name: "Gold's Gym — Marine Drive",
    category: "Fitness",
    categorySlug: "fitness",
    rating: 4.3,
    reviewCount: 1240,
    address: "Marine Drive, Shanmugham Road",
    locality: "Marine Drive",
    city: "Kochi",
    state: "Kerala",
    pincode: "682031",
    phone: "+91 484 404 1234",
    website: "goldsgym.in",
    hours: "5:00 AM – 11:00 PM",
    weeklyHours: stdHours(["5:00 AM", "11:00 PM"], ["6:00 AM", "10:00 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Wallets", "Cash"],
    description:
      "Heritage global fitness brand with strength training, free weights, cardio zone, and group fitness studios. Certified personal trainers available for 1-on-1 sessions. Monthly, quarterly, and annual memberships with no joining fee during offer periods.",
    highlights: [
      "Heritage global brand",
      "Certified personal trainers",
      "Strength + cardio + group fitness",
      "No joining fee during offers",
    ],
    yearsActive: 16,
    priceRange: "$$",
    photos: 22,
    tags: ["Strength training", "Personal training", "Cardio", "Group fitness"],
    reviews: [
      {
        id: "r29",
        author: "Sreejith Nair",
        initials: "SN",
        rating: 4,
        date: "3 weeks ago",
        text: "Good equipment, knowledgeable trainers. The AC could be stronger in peak hours. Otherwise solid.",
        helpful: 14,
      },
    ],
  },
  /* 24. Lucknow — Restaurants */
  {
    id: "b24",
    name: "Tunday Kababi — Aminabad",
    category: "Restaurants",
    categorySlug: "restaurants",
    rating: 4.6,
    reviewCount: 12_840,
    address: "94, Nazirabad Road, Aminabad",
    locality: "Aminabad",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226018",
    phone: "+91 522 261 2612",
    website: "tundaykababi.in",
    hours: "11:00 AM – 11:00 PM",
    weeklyHours: stdHours(["11:00 AM", "11:00 PM"], ["11:00 AM", "11:30 PM"]),
    openNow: true,
    verified: true,
    paymentMethods: ["UPI", "Cards", "Cash"],
    description:
      "Legend of Awadhi cuisine since 1905. Famous for galouti kebabs made with 160 spices — said to have been created for a toothless Nawab. The mutton biryani, sheermal, and phirni complete the experience. CASH queue moves fast; air-conditioned seating available upstairs.",
    highlights: [
      "Awadhi cuisine since 1905",
      "Galouti kebabs — 160 spices",
      "Air-conditioned seating upstairs",
      "Fast-moving queue",
    ],
    yearsActive: 120,
    priceRange: "$",
    photos: 54,
    tags: ["Awadhi cuisine", "Galouti kebab", "Biryani", "Heritage brand"],
    reviews: [
      {
        id: "r30",
        author: "Faisal Ahmed",
        initials: "FA",
        rating: 5,
        date: "1 week ago",
        text: "The galouti kebab lives up to the legend — melts in the mouth. Pair with sheermal and you have a meal to remember.",
        helpful: 92,
      },
      {
        id: "r31",
        author: "Priyanka Singh",
        initials: "PS",
        rating: 4,
        date: "2 weeks ago",
        text: "Iconic, but go upstairs for AC seating. The ground floor is hot and crowded. Food is consistently excellent.",
        helpful: 47,
      },
    ],
  },
];

/* ---------------- Assign subscriptions to each business ---------------- */
// Verified businesses get paid plans distributed across tiers.
// Unverified businesses get free plan.
// Deterministic based on business ID hash so data is stable across renders.
function assignSubscriptions() {
  const planKeys: SubscriptionPlan[] = ["starter", "growth", "premium", "elite", "enterprise", "ultimate"];
  for (const b of BUSINESSES) {
    if (!b.verified) {
      b.subscription = {
        plan: "free",
        status: "active",
        startDate: "2026-01-01",
        endDate: "",
        amount: 0,
        autoRenew: false,
      };
      continue;
    }
    // Verified → distribute across paid plans deterministically
    const idHash = b.id.charCodeAt(b.id.length - 1) ?? 0;
    const planIdx = idHash % planKeys.length;
    const plan = planKeys[planIdx];
    const planConfig = SUBSCRIPTION_PLANS[plan];
    const days = planConfig.durationDays;

    // Some subscriptions are expired (status variety for admin testing)
    const statusRoll = idHash % 7;
    const status: SubscriptionStatus =
      statusRoll === 0 ? "expired" : statusRoll === 1 ? "pending" : "active";

    const startDate = new Date("2026-01-15");
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    b.subscription = {
      plan,
      status,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      amount: planConfig.price,
      autoRenew: status === "active" ? idHash % 2 === 0 : false,
    };
  }
}
assignSubscriptions();

/* ---------------- FAQ ---------------- */
export const FAQS: FAQItem[] = [
  {
    id: "f1",
    question: "How are businesses verified on VerifiedBusiness.in?",
    answer:
      "Every listed business goes through a three-step verification process: GST or shop establishment proof, a phone call to confirm operating hours, and a physical address cross-check using Google Maps plus India Post pincode data. Verified listings carry a green Verified badge in the listing card and on the detail page. Unverified listings still appear but show an amber Unverified badge so users can make an informed choice.",
  },
  {
    id: "f2",
    question: "Is VerifiedBusiness.in free to use?",
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
    icon: Building2,
  },
  {
    id: "ft3",
    title: "Call in one tap",
    description: "Click-to-call with verified phone numbers — no copy-paste needed.",
    icon: Phone as LucideIcon,
  },
  {
    id: "ft4",
    title: "Updated every 90 days",
    description: "Hours and contact details are re-verified quarterly for accuracy.",
    icon: Globe,
  },
];

// Helper import for FEATURES (avoid circular)
import { Phone } from "lucide-react";

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
  'Show empty fields, dashes, or "Not available" in listing cards',
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

/* ---------------- SEARCH HELPER ---------------- */
export function searchBusinesses(
  query: string,
  location: string,
  filters?: {
    verification?: "verified" | "all";
    minRating?: number | null;
    paymentMethods?: string[];
  },
): Business[] {
  const q = query.trim().toLowerCase();
  const loc = location.trim().toLowerCase();

  return BUSINESSES.filter((b) => {
    // Query match — across name, category, tags, description, locality
    if (q) {
      const haystack = [
        b.name,
        b.category,
        b.description,
        b.locality,
        b.city,
        b.state,
        ...(b.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // Location match — across locality, city, state, pincode
    if (loc) {
      const locationHaystack = [
        b.locality,
        b.city,
        b.state,
        b.pincode,
      ]
        .join(" ")
        .toLowerCase();
      if (!locationHaystack.includes(loc)) return false;
    }

    // Filters
    if (filters?.verification === "verified" && !b.verified) return false;
    if (filters?.minRating !== null && filters?.minRating !== undefined) {
      if (b.rating < (filters.minRating as number)) return false;
    }
    if (filters?.paymentMethods && filters.paymentMethods.length > 0) {
      const hasMethod = filters.paymentMethods.some((m) =>
        b.paymentMethods.includes(m),
      );
      if (!hasMethod) return false;
    }

    return true;
  });
}

/* ---------------- LOCATION HIERARCHY HELPER ---------------- */
export function getBusinessesByCity(city: string): Business[] {
  return BUSINESSES.filter((b) => b.city.toLowerCase() === city.toLowerCase());
}

export function getBusinessesByState(state: string): Business[] {
  return BUSINESSES.filter(
    (b) => b.state.toLowerCase() === state.toLowerCase(),
  );
}

export function getBusinessesByCategory(slug: string): Business[] {
  return BUSINESSES.filter((b) => b.categorySlug === slug);
}
