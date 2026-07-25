import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { SEOHead } from '@/components/seo/SEOHead';
import { HomeView } from '@/components/views/HomeView';
import { ProductsView } from '@/components/views/ProductsView';
import { Product, Category, CashewWeight } from '@/types';
import { ActiveView, SITE_CONFIG } from '@/config/site';
import { registerServiceWorker } from '@/lib/pwa';
import { generateOrganizationJsonLd, generateProductJsonLd } from '@/lib/seo';
import { PRODUCTS_CATALOG } from '@/data/products';
import { INITIAL_CATEGORIES } from '@/data/categories';
import { useCart } from '@/context/CartContext';

// Dynamic Imports with React.lazy for non-critical views
const ProductDetailsView = lazy(() =>
  import('@/components/views/ProductDetailsView').then((m) => ({ default: m.ProductDetailsView }))
);
const AboutView = lazy(() =>
  import('@/components/views/AboutView').then((m) => ({ default: m.AboutView }))
);
const ContactView = lazy(() =>
  import('@/components/views/ContactView').then((m) => ({ default: m.ContactView }))
);
const CheckoutView = lazy(() =>
  import('@/components/views/CheckoutView').then((m) => ({ default: m.CheckoutView }))
);
const AdminProductDashboard = lazy(() =>
  import('@/components/admin/AdminProductDashboard').then((m) => ({ default: m.AdminProductDashboard }))
);
const CustomerOrderHistoryView = lazy(() =>
  import('@/components/orders/CustomerOrderHistoryView').then((m) => ({ default: m.CustomerOrderHistoryView }))
);
const CustomerQuotesView = lazy(() =>
  import('@/components/quotes/CustomerQuotesView').then((m) => ({ default: m.CustomerQuotesView }))
);
const CustomerInvoicesView = lazy(() =>
  import('@/components/invoices/CustomerInvoicesView').then((m) => ({ default: m.CustomerInvoicesView }))
);

// Smooth Suspense Fallback
const ViewLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
    <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
    <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#F3E5AB]">
      Loading V S N Cashews Catalog...
    </span>
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic Products and Categories Catalog State
  const [products, setProducts] = useState<Product[]>(PRODUCTS_CATALOG);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const { addToCart, totalCartCount } = useCart();

  // Handle SEO Document Title & JSON-LD updates when active view or selected product changes
  useEffect(() => {
    registerServiceWorker();

    // Inject Organization JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'vsn-org-jsonld';
    script.text = JSON.stringify(generateOrganizationJsonLd());
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('vsn-org-jsonld');
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    let title = `${SITE_CONFIG.name} - Sovereign Grade Mangalore Cashews`;
    let desc = SITE_CONFIG.description;

    if (selectedProduct) {
      title = `${selectedProduct.name} | ${SITE_CONFIG.name}`;
      desc = selectedProduct.description;

      // Inject Product JSON-LD
      let prodScript = document.getElementById('vsn-product-jsonld') as HTMLScriptElement;
      if (!prodScript) {
        prodScript = document.createElement('script');
        prodScript.type = 'application/ld+json';
        prodScript.id = 'vsn-product-jsonld';
        document.head.appendChild(prodScript);
      }
      prodScript.text = JSON.stringify(generateProductJsonLd(selectedProduct));
    } else {
      const prodScript = document.getElementById('vsn-product-jsonld');
      if (prodScript) document.head.removeChild(prodScript);

      switch (activeView) {
        case 'products':
          title = `Cashew Products Catalog | ${SITE_CONFIG.name}`;
          desc = 'Explore our handpicked W-180 King Cashews, Ghee Roasted gourmet flavors, and Velvet Gift Hampers.';
          break;
        case 'about':
          title = `Mangalore Heritage & 1988 Legacy | ${SITE_CONFIG.name}`;
          desc = 'Discover our 38+ years of 7-stage hand-sorting, zero chemical bleaching, and nitrogen freshness lock processing.';
          break;
        case 'contact':
          title = `Contact Mangalore Estate & Bulk Exports | ${SITE_CONFIG.name}`;
          desc = 'Connect with our Mangalore office for retail express orders, corporate gifting, or container export inquiries.';
          break;
        case 'checkout':
          title = `Sovereign Express Checkout | ${SITE_CONFIG.name}`;
          desc = 'Complete your cashew order with instant UPI, Cards, NetBanking, COD, or Corporate GST tax invoice.';
          break;
        case 'admin':
          title = `Admin Operations & Inventory Portal | ${SITE_CONFIG.name}`;
          desc = 'Manage product catalog, inventory stock levels, category listings, and SEO parameters.';
          break;
        default:
          title = `${SITE_CONFIG.name} - Sovereign Grade Mangalore Cashew Nuts`;
          desc = SITE_CONFIG.description;
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [activeView, selectedProduct]);

  // Catalog Handlers (Admin Operations)
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProduct && selectedProduct.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Cart Handler
  const handleAddToCart = (product: Product, weight: CashewWeight, quantity = 1) => {
    addToCart(product, weight, quantity);
    setIsCartOpen(true);
  };

  const handleNavigate = (view: ActiveView) => {
    setSelectedProduct(null);
    setActiveView(view);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedProduct(null);
    setSelectedCategoryName(category);
    setActiveView('products');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-[#F8F9FA] selection:bg-[#D4AF37] selection:text-[#0B132B]">
      {/* Dynamic SEO Head Manager */}
      <SEOHead
        activeView={activeView}
        selectedProduct={selectedProduct}
        selectedCategory={selectedCategoryName}
        searchQuery={searchTerm}
      />

      {/* Header / Navbar */}
      <Header
        activeView={selectedProduct ? 'products' : activeView}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleMobileNav={() => setIsMobileNavOpen(true)}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeView={selectedProduct ? 'products' : activeView}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Router Content */}
      <main className="flex-1">
        <Suspense fallback={<ViewLoadingFallback />}>
          <AnimatePresence mode="wait">
            {selectedProduct ? (
              <ProductDetailsView
                key={`product-${selectedProduct.id}`}
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : activeView === 'home' ? (
              <HomeView
                key="view-home"
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigate={handleNavigate}
                onSelectCategory={handleSelectCategory}
                searchTerm={searchTerm}
              />
            ) : activeView === 'products' ? (
              <ProductsView
                key="view-products"
                products={products}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                initialSearchTerm={searchTerm}
                initialCategory={selectedCategoryName}
              />
            ) : activeView === 'about' ? (
              <AboutView key="view-about" onNavigate={handleNavigate} />
            ) : activeView === 'contact' ? (
              <ContactView key="view-contact" onNavigate={handleNavigate} />
            ) : activeView === 'checkout' ? (
              <CheckoutView
                key="view-checkout"
                onBackToCatalog={() => handleNavigate('products')}
              />
            ) : activeView === 'admin' ? (
              <AdminProductDashboard
                key="view-admin"
                products={products}
                categories={categories}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onViewProductPublic={(slug) => {
                  const p = products.find((prod) => prod.slug === slug);
                  if (p) {
                    setSelectedProduct(p);
                    setActiveView('products');
                  }
                }}
              />
            ) : activeView === 'orders' ? (
              <CustomerOrderHistoryView
                key="view-orders"
                onBackToCatalog={() => handleNavigate('products')}
              />
            ) : activeView === 'quotes' ? (
              <CustomerQuotesView
                key="view-quotes"
                onBackToCatalog={() => handleNavigate('products')}
              />
            ) : activeView === 'invoices' ? (
              <CustomerInvoicesView
                key="view-invoices"
                onBackToCatalog={() => handleNavigate('products')}
              />
            ) : (
              <HomeView
                key="view-default"
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedProduct}
                onNavigate={handleNavigate}
                onSelectCategory={handleSelectCategory}
                searchTerm={searchTerm}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => handleNavigate('checkout')}
      />

      {/* Royal Club Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onNavigateToCheckout={() => handleNavigate('checkout')}
      />

      {/* PWA Prompt */}
      <PwaInstallPrompt />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
