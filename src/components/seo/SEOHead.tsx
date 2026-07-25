import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types';
import { ActiveView } from '@/config/site';

interface SEOHeadProps {
  activeView?: ActiveView | string;
  selectedProduct?: Product | null;
  selectedCategory?: string;
  searchQuery?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  activeView = 'home',
  selectedProduct,
  selectedCategory,
  searchQuery,
}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vsncashews.com';

  // 1. Dynamic Title & Description Calculation
  let title = 'V S N CASHEWS | Premium Export-Grade Mangalore Cashew Nuts Wholesale & Retail';
  let description =
    "Direct from Mangalore's premier processing units. Buy 100% pure W180 King Jumbo, W240, W320, Ghee Roasted, & Saffron Honey Cashews. Fast nationwide shipping, GST invoices, & B2B bulk rates.";
  let canonicalUrl = baseUrl;
  let ogImage = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1200';
  let ogType = 'website';

  if (selectedProduct) {
    title = `${selectedProduct.name} - V S N CASHEWS Mangalore Grade`;
    description = `${selectedProduct.description} Buy authentic ${selectedProduct.grade} grade cashews starting at ₹${selectedProduct.price}. FSSAI certified, 100% pure direct from Mangalore.`;
    canonicalUrl = `${baseUrl}/?product=${selectedProduct.slug || selectedProduct.id}`;
    if (selectedProduct.images && selectedProduct.images.length > 0) {
      ogImage = selectedProduct.images[0];
    }
    ogType = 'product';
  } else if (activeView === 'products') {
    if (selectedCategory && selectedCategory !== 'All') {
      title = `${selectedCategory} Cashews Wholesale & Online Buying | V S N CASHEWS`;
      description = `Explore top grade ${selectedCategory} cashew nuts from Mangalore's finest orchards. Direct processor rates, GST tax receipts, and express delivery.`;
      canonicalUrl = `${baseUrl}/?view=products&category=${encodeURIComponent(selectedCategory)}`;
    } else {
      title = 'Buy Premium Cashew Nuts Online - W180, W240, W320 & Flavored | V S N CASHEWS';
      description = 'Browse complete catalog of export-grade Mangalore cashew nuts, roasted gourmet flavors, and luxury gift hampers. 100% pure & certified.';
      canonicalUrl = `${baseUrl}/?view=products`;
    }
  } else if (activeView === 'quotes') {
    title = 'B2B Wholesale Cashew Bulk Supply & Price Quotations | V S N CASHEWS';
    description = 'Request bulk wholesale quotations for 50kg to 5000kg+ Mangalore cashew nut orders. Customized packing, pan-India logistics, and GST tax invoice claims.';
    canonicalUrl = `${baseUrl}/?view=quotes`;
  } else if (activeView === 'invoices') {
    title = 'GST Tax Receipts & Input Tax Credit (ITC) Portal | V S N CASHEWS';
    description = 'Access official GST tax invoices, download PDF receipts for ITC tax credit, and track payment status from V S N CASHEWS Mangalore.';
    canonicalUrl = `${baseUrl}/?view=invoices`;
  } else if (activeView === 'about') {
    title = '35+ Years Heritage & Mangalore Processing Excellence | V S N CASHEWS';
    description = 'Discover the legacy of V S N CASHEWS in Baikampady, Mangalore. Over 3 decades of steam processing excellence, zero-adulteration, and global exports.';
    canonicalUrl = `${baseUrl}/?view=about`;
  } else if (activeView === 'contact') {
    title = 'Contact & Wholesale Desk | V S N CASHEWS Baikampady Mangalore';
    description = 'Get in touch with V S N CASHEWS processing unit in Mangalore. Phone: +91 98450 12345, Email: wholesale@vsncashews.com. FSSAI & GST Compliant.';
    canonicalUrl = `${baseUrl}/?view=contact`;
  } else if (activeView === 'orders') {
    title = 'Track Orders & Purchase History | V S N CASHEWS';
    description = 'View live dispatch tracking, shipping details, and invoice downloads for your cashew nut orders.';
    canonicalUrl = `${baseUrl}/?view=orders`;
  }

  // 2. Structured Data: Organization & LocalBusiness
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'V S N CASHEWS',
    legalName: 'V S N CASHEWS Processing Unit',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: ogImage,
    description: "Mangalore's premier processor and exporter of whole, roasted, and gourmet cashew nuts.",
    telephone: '+91-9845012345',
    email: 'wholesale@vsncashews.com',
    priceRange: '₹460 - ₹2450',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 42, Baikampady Industrial Area',
      addressLocality: 'Mangalore',
      addressRegion: 'Karnataka',
      postalCode: '575011',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '12.9515',
      longitude: '74.8219',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://facebook.com/vsncashews',
      'https://instagram.com/vsncashews',
      'https://twitter.com/vsncashews',
    ],
    taxID: '29AABCV1234F1ZM',
  };

  // 3. WebSite & Sitelinks SearchBox Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'V S N CASHEWS',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // 4. Breadcrumb List Schema
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
  ];

  if (selectedProduct) {
    breadcrumbItems.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cashew Catalog',
        item: `${baseUrl}/?view=products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: selectedProduct.name,
        item: canonicalUrl,
      }
    );
  } else if (activeView !== 'home') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: activeView.charAt(0).toUpperCase() + activeView.slice(1),
      item: canonicalUrl,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  // 5. Product & Offer Schema (if product selected)
  let productSchema: object | null = null;
  if (selectedProduct) {
    productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: selectedProduct.name,
      image: selectedProduct.images,
      description: selectedProduct.description,
      sku: selectedProduct.sku,
      gtin: `890${selectedProduct.id.replace(/\D/g, '').padStart(10, '0')}`,
      mpn: selectedProduct.sku,
      brand: {
        '@type': 'Brand',
        name: 'V S N CASHEWS',
      },
      category: selectedProduct.category,
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'INR',
        price: selectedProduct.price,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: selectedProduct.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'V S N CASHEWS',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: selectedProduct.rating || 4.8,
        reviewCount: selectedProduct.reviewCount || 120,
        bestRating: '5',
        worstRating: '1',
      },
    };
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="V S N CASHEWS" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vsncashews" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schemas */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {productSchema && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}
    </Helmet>
  );
};
