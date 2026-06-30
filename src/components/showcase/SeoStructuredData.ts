"use client";

import { useEffect } from "react";
import type { Business } from "@/lib/directory-data";

/**
 * useDocumentTitle — sets the document title while mounted, restores on unmount.
 * Per-view SEO without needing per-route metadata.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}

/**
 * SEO — JSON-LD structured data injection.
 *
 * Per the platform spec: "Every level is a first-class SEO asset."
 * We inject schema.org LocalBusiness JSON-LD for each business detail page,
 * plus BreadcrumbList for navigation context.
 *
 * This helps Google rich results show ratings, hours, address, and phone
 * directly in search results.
 */
export function useBusinessJsonLd(business: Business | undefined) {
  useEffect(() => {
    if (!business) return;

    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `https://bharatdirectory.in/business/${business.id}`,
      name: business.name,
      image: `https://bharatdirectory.in/photos/${business.id}/main.jpg`,
      telephone: business.phone,
      email: business.email,
      url: business.website ? `https://${business.website}` : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address,
        addressLocality: business.locality,
        addressRegion: business.state,
        addressCountry: "IN",
        postalCode: business.pincode,
      },
      geo: {
        "@type": "GeoCoordinates",
        // Placeholder — would be geocoded from pincode in production
        latitude: 0,
        longitude: 0,
      },
      openingHoursSpecification: business.weeklyHours
        .filter((h) => !h.closed)
        .map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: expandDay(h.day),
          opens: to24h(h.open),
          closes: to24h(h.close),
        })),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating,
        reviewCount: business.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
      priceRange: business.priceRange,
      paymentAccepted: business.paymentMethods.join(", "),
      currenciesAccepted: "INR",
      isVerified: business.verified,
      foundingDate: String(new Date().getFullYear() - business.yearsActive),
      description: business.description,
      makesOffer: business.highlights.map((h) => ({
        "@type": "Offer",
        name: h,
      })),
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "India", item: "https://bharatdirectory.in" },
        { "@type": "ListItem", position: 2, name: business.state, item: `https://bharatdirectory.in/${business.state}` },
        { "@type": "ListItem", position: 3, name: business.city, item: `https://bharatdirectory.in/${business.state}/${business.city}` },
        { "@type": "ListItem", position: 4, name: business.category, item: `https://bharatdirectory.in/${business.state}/${business.city}/${business.categorySlug}` },
        { "@type": "ListItem", position: 5, name: business.name, item: `https://bharatdirectory.in/business/${business.id}` },
      ],
    };

    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.text = JSON.stringify(localBusiness);
    script1.dataset.seo = "localbusiness";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.text = JSON.stringify(breadcrumb);
    script2.dataset.seo = "breadcrumb";
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [business]);
}

function expandDay(short: string): string {
  const map: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return map[short] ?? short;
}

function to24h(time12h: string): string {
  // "9:00 AM" → "09:00", "10:30 PM" → "22:30"
  if (!time12h) return "";
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12h;
  let [_, h, m, period] = match;
  let hour = parseInt(h, 10);
  if (period.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${m}`;
}
