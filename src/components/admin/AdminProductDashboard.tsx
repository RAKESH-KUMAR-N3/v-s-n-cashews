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

  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'quotes' | 'invoices'>('dashboard');
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products Catalog', icon: PackageCheck },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'quotes', label: 'B2B Wholesale Quotes', icon: FileSpreadsheet },
    { id: 'invoices', label: 'GST Tax Invoices', icon: FileText },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B132B] text-[#F8F9FA] p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Top Admin Navigation Bar with Hamburger Menu */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30 bg-[#1C2541]/80 p-3 sm:p-4 backdrop-blur-md sticky top-16 z-30">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 border border-[#D4AF37] bg-[#0B132B] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all cursor-pointer"
            title="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
              <span>V S N Admin</span>
            </div>
            <h1 className="font-serif text-lg sm:text-2xl font-black text-[#F3E5AB]">
              {menuItems.find((m) => m.id === activeAdminTab)?.label}
            </h1>
          </div>
        </div>

        {/* Top Actions */}
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
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Hamburger Mobile & Desktop Sidebar Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* Menu Drawer Slide-in */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0B132B] border-r-2 border-[#D4AF37] p-5 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
                  <div className="flex items-center gap-2">
                    <img src="/assets/v-s-n-logo.png" alt="VSN" className="h-10 w-auto" />
                    <span className="font-serif font-black text-lg gold-gradient-text">VSN ADMIN</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-[#D4AF37]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeAdminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveAdminTab(item.id as any);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full p-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37] font-black shadow-lg'
                            : 'bg-[#1C2541]/60 text-gray-300 border-transparent hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Drawer Footer */}
              <div className="pt-4 border-t border-[#D4AF37]/20">
                <button
                  onClick={() => {
                    logoutUser();
                    router.push('/');
                  }}
                  className="w-full py-2.5 px-3 bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out Admin
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Admin Tab View Content */}
      {activeAdminTab === 'dashboard' ? (
        <AdminOverviewDashboard
          products={products}
          categories={categories}
          onAddProduct={handleOpenAdd}
          onEditProduct={handleOpenEdit}
          onUpdateProduct={onUpdateProduct}
          onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
          onSwitchTab={(tab) => setActiveAdminTab(tab)}
        />
      ) : activeAdminTab === 'orders' ? (
        <AdminOrderManagementView />
      ) : activeAdminTab === 'quotes' ? (
        <AdminQuotationManager />
      ) : activeAdminTab === 'invoices' ? (
        <AdminInvoiceManager />
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
