"use client";

import { useEffect } from "react";
import type { Business } from "@/lib/directory-data";

/**
 * Enhanced SEO structured data system.
 *
 * Adds WebSite schema (for sitelinks search box),
 * Organization schema (for knowledge panel),
 * and enhances the existing LocalBusiness schema.
 */

/** Inject WebSite + Organization schema globally */
export function useGlobalSeoSchema() {
  useEffect(() => {
    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "VerifiedBusiness.in",
      url: "https://verifiedbusiness.in",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://verifiedbusiness.in/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    };

    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "VerifiedBusiness.in",
      url: "https://verifiedbusiness.in",
      logo: "https://verifiedbusiness.in/logo.png",
      description: "India's premium local business directory with verified listings across 28 states and 19,000+ pincodes.",
      foundingDate: "2026",
      areaServed: "IN",
      knowsLanguage: ["en", "hi", "ta", "te", "bn", "mr", "kn"],
    };

    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.text = JSON.stringify(website);
    script1.dataset.seo = "website";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.text = JSON.stringify(organization);
    script2.dataset.seo = "organization";
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);
}

/** Generate FAQ schema for FAQ pages */
export function useFaqJsonLd(faqs: { question: string; answer: string }[]) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.dataset.seo = "faq";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [faqs]);
}

/** Generate BreadcrumbList schema for any page */
export function useBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `https://verifiedbusiness.in${item.url}`,
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.dataset.seo = "breadcrumb";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [items]);
}
