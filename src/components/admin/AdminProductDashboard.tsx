'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Plus,
  Edit3,
  Trash2,
  Search,
  Layers,
  AlertTriangle,
  CheckCircle,
  PackageCheck,
  TrendingUp,
  Download,
  Eye,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  FileText,
  FileSpreadsheet,
  Users,
  Tag,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { CategoryManagerModal } from './CategoryManagerModal';
import { ProductFormModal } from './ProductFormModal';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

import { AdminOrderManagementView } from '@/components/orders/AdminOrderManagementView';
import { AdminQuotationManager } from './AdminQuotationManager';
import { AdminInvoiceManager } from './AdminInvoiceManager';
import { AdminOverviewDashboard } from './AdminOverviewDashboard';

interface AdminProductDashboardProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onViewProductPublic?: (slug: string) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'quotes' | 'invoices' | 'customers' | 'coupons';

export const AdminProductDashboard: React.FC<AdminProductDashboardProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onViewProductPublic,
}) => {
  const router = useRouter();
  const { logoutUser } = useCart();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Statistics
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock && p.stockQuantity > 0).length;
  const lowStockCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 50).length;
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockQuantity === 0).length;

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    let matchesStock = true;
    if (stockFilter === 'inStock') matchesStock = p.inStock && p.stockQuantity > 0;
    if (stockFilter === 'lowStock') matchesStock = p.stockQuantity > 0 && p.stockQuantity <= 50;
    if (stockFilter === 'outOfStock') matchesStock = !p.inStock || p.stockQuantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleToggleStock = (p: Product) => {
    const updated = {
      ...p,
      inStock: !p.inStock,
      stockQuantity: !p.inStock && p.stockQuantity === 0 ? 50 : p.stockQuantity,
    };
    onUpdateProduct(updated);
  };

  const handleQuickStockUpdate = (p: Product, newQty: number) => {
    const updated = {
      ...p,
      stockQuantity: newQty,
      inStock: newQty > 0,
    };
    onUpdateProduct(updated);
  };

  const categoryNames = categories.map((c) => c.name);

  // Admin Sidebar Nav Items
  const navItems: { id: AdminTab; label: string; icon: any; count?: number | string }[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: PackageCheck, count: products.length },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: '3 Active' },
    { id: 'quotes', label: 'B2B Wholesale Quotes', icon: FileSpreadsheet, count: '3 Pending' },
    { id: 'invoices', label: 'GST Tax Invoices', icon: FileText, count: '3 Issued' },
    { id: 'customers', label: 'Registered Customers', icon: Users, count: '1,420' },
    { id: 'coupons', label: 'Coupons & Promos', icon: Tag, count: '3 Active' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B132B] text-[#F8F9FA] p-3 sm:p-6 space-y-6 animate-fade-in pb-24 sm:pb-8">
      {/* Top Floating Header with Hamburger Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30 bg-[#1C2541]/95 p-3 sm:p-4 backdrop-blur-md sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Hamburger Trigger Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 border border-[#D4AF37] bg-[#0B132B] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            title="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menu</span>
          </button>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] block">
              V S N CASHEWS Admin
            </span>
            <h1 className="font-serif text-base sm:text-xl font-black text-[#F3E5AB]">
              {navItems.find((n) => n.id === activeAdminTab)?.label}
            </h1>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2">
          {activeAdminTab === 'products' && (
            <SquareButton variant="gold" size="sm" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </SquareButton>
          )}

          <button
            onClick={() => {
              logoutUser();
              router.push('/');
            }}
            className="p-2 border border-red-500/50 bg-red-950/40 text-red-300 hover:bg-red-900 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
            title="Sign Out Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Modern High-End Admin Hamburger Slide-in Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[9999999] flex">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-[85vw] bg-[#060A17] border-r-2 border-[#D4AF37] text-[#F8F9FA] flex flex-col justify-between p-5 z-10 shadow-[0_0_50px_rgba(212,175,55,0.3)] h-full overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
                  <div className="flex items-center gap-2">
                    <img src="/assets/v-s-n-logo.png" alt="VSN" className="h-10 w-auto object-contain" />
                    <div>
                      <span className="font-serif font-black text-lg gold-gradient-text block leading-none">
                        VSN ADMIN
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                        Management Console
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-[#D4AF37] border border-gray-700 hover:border-[#D4AF37] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeAdminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveAdminTab(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] text-[#0B132B] border-[#F3E5AB] font-extrabold shadow-md'
                            : 'bg-[#1C2541]/60 text-gray-300 border-gray-800 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B132B]' : 'text-[#D4AF37]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count && (
                          <span
                            className={`text-[10px] px-2 py-0.5 font-bold ${
                              isActive ? 'bg-[#0B132B] text-[#D4AF37]' : 'bg-[#0B132B] text-gray-300 border border-[#D4AF37]/30'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Admin Drawer Footer */}
              <div className="pt-6 border-t border-[#D4AF37]/30 space-y-3">
                <div className="p-3 bg-[#1C2541] border border-[#D4AF37]/20 text-center space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase block">Logged in as</span>
                  <p className="font-serif font-bold text-xs text-[#F3E5AB]">admin123@gmail.com</p>
                </div>

                <button
                  onClick={() => {
                    logoutUser();
                    router.push('/');
                  }}
                  className="w-full py-3 px-4 bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Admin Content Views */}
      {activeAdminTab === 'dashboard' ? (
        <AdminOverviewDashboard
          products={products}
          categories={categories}
          onAddProduct={handleOpenAdd}
          onEditProduct={handleOpenEdit}
          onUpdateProduct={onUpdateProduct}
          onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
          onSwitchTab={(tab) => setActiveAdminTab(tab as any)}
        />
      ) : activeAdminTab === 'orders' ? (
        <AdminOrderManagementView />
      ) : activeAdminTab === 'quotes' ? (
        <AdminQuotationManager />
      ) : activeAdminTab === 'invoices' ? (
        <AdminInvoiceManager />
      ) : activeAdminTab === 'customers' ? (
        /* CUSTOMERS DIRECTORY TAB */
        <div className="space-y-4 bg-[#1C2541]/80 border border-[#D4AF37]/40 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
            <h2 className="font-serif font-bold text-lg text-[#F3E5AB] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" /> Registered Customers & B2B Buyers Directory
            </h2>
            <SquareButton variant="outline" size="sm" onClick={() => alert('Exporting Customer Directory to CSV...')}>
              <Download className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Export Contacts
            </SquareButton>
          </div>

          <div className="divide-y divide-[#D4AF37]/20 text-xs space-y-2">
            {[
              { name: 'Rakesh Kumar', email: 'nrakeshkumar36@gmail.com', phone: '+91 98450 99887', role: 'Royal Member (5% Discount)', totalOrders: 3, spend: '₹14,500' },
              { name: 'Sovereign Exports Pvt Ltd', email: 'wholesale@vsncashews.com', phone: '+91 824 240 8899', role: 'B2B Wholesale Buyer (10% Volume)', totalOrders: 8, spend: '₹1,85,000' },
              { name: 'Prabhu Gourmet Sweets', email: 'orders@prabhugourmet.com', phone: '+91 98450 99887', role: 'Commercial Bakery Buyer', totalOrders: 5, spend: '₹86,230' },
            ].map((usr, i) => (
              <div key={i} className="pt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h4 className="font-bold text-[#F8F9FA] text-sm">{usr.name}</h4>
                  <p className="text-gray-400 font-mono">{usr.email} • {usr.phone}</p>
                  <span className="inline-block text-[10px] text-[#D4AF37] font-semibold mt-0.5">{usr.role}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="block text-[10px] text-gray-400 uppercase">Total Spend</span>
                  <span className="font-serif font-black text-sm text-[#F3E5AB]">{usr.spend} ({usr.totalOrders} Orders)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeAdminTab === 'coupons' ? (
        /* COUPONS & DISCOUNTS TAB */
        <div className="space-y-4 bg-[#1C2541]/80 border border-[#D4AF37]/40 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
            <h2 className="font-serif font-bold text-lg text-[#F3E5AB] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#D4AF37]" /> Active Discount Coupons & Promo Engine
            </h2>
            <SquareButton variant="gold" size="sm" onClick={() => alert('New coupon created!')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Create New Coupon
            </SquareButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { code: 'ROYAL10', discount: '10% OFF', desc: 'Valid for all registered Royal Club patrons', usage: '142 Redemption Uses' },
              { code: 'VSNKING', discount: '15% OFF', desc: 'Applicable on W-180 King Jumbo cashews > ₹2,499', usage: '88 Redemption Uses' },
              { code: 'FREESHIP', discount: 'Extra 5% + Free Priority Air', desc: 'Pan-India Express Air Shipping on orders > ₹1,499', usage: '310 Redemption Uses' },
            ].map((c, i) => (
              <div key={i} className="p-4 bg-[#0B132B] border border-[#D4AF37]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base text-[#F3E5AB]">{c.code}</span>
                  <span className="bg-[#D4AF37] text-[#0B132B] px-2 py-0.5 text-[10px] font-extrabold uppercase">{c.discount}</span>
                </div>
                <p className="text-gray-300 text-[11px]">{c.desc}</p>
                <span className="text-[10px] text-emerald-400 font-bold block">{c.usage}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PRODUCTS CATALOG VIEW */
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 border border-[#D4AF37]/30 bg-[#1C2541]/50 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">
                Total Products
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl font-bold text-[#F3E5AB]">{totalProducts}</span>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>

            <div className="p-3.5 border border-emerald-500/30 bg-[#1C2541]/50 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 block">
                In Stock
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl font-bold text-emerald-300">{inStockCount}</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="p-3.5 border border-amber-500/30 bg-[#1C2541]/50 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 block">
                Low Stock
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl font-bold text-amber-300">{lowStockCount}</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="p-3.5 border border-red-500/30 bg-[#1C2541]/50 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 block">
                Out of Stock
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl font-bold text-red-400">{outOfStockCount}</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>

          {/* Search & Action Controls */}
          <div className="p-3 border border-[#D4AF37]/30 bg-[#1C2541]/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, grade, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0B132B] border border-[#D4AF37]/40 pl-9 pr-3 py-1.5 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SquareButton
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                <Layers className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Categories
              </SquareButton>

              <SquareButton variant="gold" size="sm" onClick={handleOpenAdd}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Product
              </SquareButton>
            </div>
          </div>

          {/* Products Table */}
          <div className="border border-[#D4AF37]/30 bg-[#0B132B] overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#1C2541] uppercase text-[10px] text-[#D4AF37] font-bold tracking-widest">
                <tr>
                  <th className="p-3 border-b border-[#D4AF37]/20">Product</th>
                  <th className="p-3 border-b border-[#D4AF37]/20">Grade</th>
                  <th className="p-3 border-b border-[#D4AF37]/20">Price</th>
                  <th className="p-3 border-b border-[#D4AF37]/20">Stock</th>
                  <th className="p-3 border-b border-[#D4AF37]/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1C2541]/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-cover border border-[#D4AF37]/40 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-[#F8F9FA]">{p.name}</h3>
                          <span className="text-[10px] text-gray-400">{p.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="text-[#D4AF37] font-bold">{p.grade}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-[#F8F9FA]">₹{p.price}</span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={p.stockQuantity}
                          onChange={(e) => handleQuickStockUpdate(p, Number(e.target.value))}
                          className="w-16 bg-[#1C2541] border border-[#D4AF37]/40 px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
        categories={categoryNames}
        onSaveProduct={(prod) => {
          if (editingProduct) {
            onUpdateProduct(prod);
          } else {
            onAddProduct(prod);
          }
        }}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={onAddCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};
