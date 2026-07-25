import { SITE_CONFIG } from "@/config/site";
import { Product } from "@/types";

export interface SeoMetadata {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export function generateSeoMetadata(override: Partial<SeoMetadata> = {}): SeoMetadata {
  return {
    title: override.title ? `${override.title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - Royal Rajahmundry Cashew Nuts & Dry Fruits`,
    description: override.description || SITE_CONFIG.description,
    canonical: override.canonical || SITE_CONFIG.url,
    ogImage: override.ogImage || `${SITE_CONFIG.url}/og-vsn-cashews.jpg`,
  };
}

/**
 * Generates Schema.org Product Structured Data JSON-LD for Search Engine Rich Snippets
 */
export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": SITE_CONFIG.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_CONFIG.url}/#product-${product.id}`,
      "priceCurrency": SITE_CONFIG.currencyCode,
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.name
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    }
  };
}

/**
 * Generates Schema.org Store Organization JSON-LD
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": SITE_CONFIG.name,
    "image": `${SITE_CONFIG.url}/vsn-cashews-storefront.jpg`,
    "@id": SITE_CONFIG.url,
    "url": SITE_CONFIG.url,
    "telephone": SITE_CONFIG.contact.phone,
    "priceRange": "₹₹ - ₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Morampudi Junction",
      "addressLocality": "Rajahmundry",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "533107",
      "addressCountry": "IN"
    }
  };
}
