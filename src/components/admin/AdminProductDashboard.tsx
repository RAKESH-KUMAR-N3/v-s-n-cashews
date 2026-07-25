'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Layers,
  AlertTriangle,
  CheckCircle,
  PackageCheck,
  TrendingUp,
  Download,
  Eye,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { CategoryManagerModal } from './CategoryManagerModal';
import { ProductFormModal } from './ProductFormModal';

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
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'quotes' | 'invoices'>('dashboard');
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

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vsn_cashews_products_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="w-full min-h-screen bg-[#0B132B] text-[#F8F9FA] p-4 sm:p-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#D4AF37]/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <PackageCheck className="w-4 h-4" /> V S N CASHEWS Admin Operations
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F3E5AB]">
            {activeAdminTab === 'dashboard'
              ? 'Executive Business & Sales Dashboard'
              : activeAdminTab === 'products'
              ? 'Product Catalog & Inventory Engine'
              : activeAdminTab === 'orders'
              ? 'Order Fulfillment & Status Management'
              : activeAdminTab === 'quotes'
              ? 'B2B Wholesale Quotations Console'
              : 'GST Tax Invoices & Billing Engine'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeAdminTab === 'products' && (
            <>
              <SquareButton
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-[#D4AF37]" /> Categories ({categories.length})
              </SquareButton>

              <SquareButton
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" /> Export Catalog
              </SquareButton>

              <SquareButton
                variant="gold"
                size="md"
                onClick={handleOpenAdd}
                className="flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Product
              </SquareButton>
            </>
          )}
        </div>
      </div>

      {/* Admin Module Switcher Tabs */}
      <div className="flex items-center gap-2 bg-[#1C2541] p-1.5 border border-[#D4AF37]/40 max-w-3xl overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('dashboard')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'dashboard'
              ? 'bg-[#D4AF37] text-[#0B132B] shadow-md'
              : 'text-gray-300 hover:text-[#D4AF37]'
          }`}
        >
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'products'
              ? 'bg-[#D4AF37] text-[#0B132B] shadow-md'
              : 'text-gray-300 hover:text-[#D4AF37]'
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'orders'
              ? 'bg-[#D4AF37] text-[#0B132B] shadow-md'
              : 'text-gray-300 hover:text-[#D4AF37]'
          }`}
        >
          Orders
        </button>

        <button
          onClick={() => setActiveAdminTab('quotes')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'quotes'
              ? 'bg-[#D4AF37] text-[#0B132B] shadow-md'
              : 'text-gray-300 hover:text-[#D4AF37]'
          }`}
        >
          B2B Quotes
        </button>

        <button
          onClick={() => setActiveAdminTab('invoices')}
          className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'invoices'
              ? 'bg-[#D4AF37] text-[#0B132B] shadow-md'
              : 'text-gray-300 hover:text-[#D4AF37]'
          }`}
        >
          Tax Invoices
        </button>
      </div>

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
        <>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/50 backdrop-blur-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
            Total Active Products
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#F3E5AB]">{totalProducts}</span>
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <p className="text-[11px] text-gray-400">Across {categories.length} product categories</p>
        </div>

        <div className="p-4 border border-emerald-500/30 bg-[#1C2541]/50 backdrop-blur-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
            Ready In Stock
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-emerald-300">{inStockCount}</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-[11px] text-emerald-400/80">Available for immediate fulfillment</p>
        </div>

        <div className="p-4 border border-amber-500/30 bg-[#1C2541]/50 backdrop-blur-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
            Low Stock Alerts
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-amber-300">{lowStockCount}</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-[11px] text-amber-400/80">Inventory count &le; 50 units</p>
        </div>

        <div className="p-4 border border-red-500/30 bg-[#1C2541]/50 backdrop-blur-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block">
            Out of Stock
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-red-400">{outOfStockCount}</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-[11px] text-red-400/80">Action required: Restock or hide</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/60 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search products by title, SKU, grade, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B132B] border border-[#D4AF37]/40 pl-9 pr-3 py-2 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0B132B] border border-[#D4AF37]/40 py-2 px-3 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1 border border-[#D4AF37]/30 bg-[#0B132B] p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'inStock', label: 'In Stock' },
              { id: 'lowStock', label: 'Low Stock' },
              { id: 'outOfStock', label: 'Out of Stock' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStockFilter(st.id as any)}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  stockFilter === st.id
                    ? 'bg-[#D4AF37] text-[#0B132B]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-[#D4AF37]/30 bg-[#0B132B] overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-[#1C2541] uppercase text-[10px] text-[#D4AF37] font-bold tracking-widest">
            <tr>
              <th className="p-3 border-b border-[#D4AF37]/20">Product</th>
              <th className="p-3 border-b border-[#D4AF37]/20">SKU / Grade</th>
              <th className="p-3 border-b border-[#D4AF37]/20">Category</th>
              <th className="p-3 border-b border-[#D4AF37]/20">Price (₹)</th>
              <th className="p-3 border-b border-[#D4AF37]/20">Stock Quantity</th>
              <th className="p-3 border-b border-[#D4AF37]/20">Status</th>
              <th className="p-3 border-b border-[#D4AF37]/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/10">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  No products found matching search filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#1C2541]/40 transition-colors">
                  {/* Product Info */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover border border-[#D4AF37]/40 flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-[#F8F9FA] hover:text-[#D4AF37] transition-colors">
                          {p.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 block font-mono">
                          /{p.slug}
                        </span>
                        {p.isFeatured && (
                          <span className="inline-block bg-[#D4AF37] text-[#0B132B] text-[8px] font-bold uppercase px-1 py-0.2 mt-0.5 mr-1">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="inline-block bg-amber-600 text-white text-[8px] font-bold uppercase px-1 py-0.2 mt-0.5">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* SKU & Grade */}
                  <td className="p-3">
                    <span className="font-mono text-gray-300 block">{p.sku}</span>
                    <span className="text-[#D4AF37] font-bold text-[11px]">{p.grade}</span>
                  </td>

                  {/* Category */}
                  <td className="p-3">
                    <span className="bg-[#1C2541] border border-[#D4AF37]/20 px-2 py-1 text-[11px] text-[#F3E5AB]">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-3">
                    <span className="font-bold text-[#F8F9FA] text-sm">₹{p.price}</span>
                    {p.compareAtPrice && (
                      <span className="line-through text-gray-500 text-[10px] block">
                        ₹{p.compareAtPrice}
                      </span>
                    )}
                  </td>

                  {/* Stock Quantity Control */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={p.stockQuantity}
                        onChange={(e) => handleQuickStockUpdate(p, Number(e.target.value))}
                        className="w-20 bg-[#1C2541] border border-[#D4AF37]/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <span className="text-[10px] text-gray-400">units</span>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStock(p)}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                        p.inStock && p.stockQuantity > 0
                          ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                          : 'border-red-500/50 bg-red-950/40 text-red-400 hover:bg-red-900/60'
                      }`}
                    >
                      {p.inStock && p.stockQuantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onViewProductPublic && (
                        <button
                          onClick={() => onViewProductPublic(p.slug)}
                          className="p-1.5 border border-[#D4AF37]/30 text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer"
                          title="View Product Public Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onDeleteProduct(p.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase hover:bg-red-700 cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-[10px] uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
        </>
      )}
    </div>
  );
};
