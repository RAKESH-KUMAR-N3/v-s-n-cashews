import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Plus,
  Download,
  RefreshCw,
  FileText,
  Building2,
  ChevronRight,
  Eye,
  Percent,
  Truck,
  XCircle,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Product, Category, Order } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { useOrders } from '@/context/OrderContext';
import { useQuotes } from '@/context/QuoteContext';
import { useInvoice } from '@/context/InvoiceContext';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';

interface AdminOverviewDashboardProps {
  products: Product[];
  categories: Category[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onOpenCategoryManager: () => void;
  onSwitchTab: (tab: 'products' | 'orders' | 'quotes' | 'invoices') => void;
}

const COLORS = ['#D4AF37', '#38BDF8', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export const AdminOverviewDashboard: React.FC<AdminOverviewDashboardProps> = ({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onUpdateProduct,
  onOpenCategoryManager,
  onSwitchTab
}) => {
  const { orders, updateOrderStatus } = useOrders();
  const { quotes } = useQuotes();
  const { invoices } = useInvoice();

  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [stockQuickEditId, setStockQuickEditId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);

  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. REVENUE METRICS
  const totalOrderRevenue = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const paidRevenue = orders
    .filter((ord) => ord.paymentStatus === 'PAID')
    .reduce((sum, ord) => sum + ord.grandTotal, 0);
  const pendingReceivables = orders
    .filter((ord) => ord.paymentStatus !== 'PAID')
    .reduce((sum, ord) => sum + ord.grandTotal, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalOrderRevenue / orders.length) : 0;

  // 2. ORDER METRICS
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const fulfilledOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length;

  // 3. CUSTOMER METRICS
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    gstin?: string;
    totalOrders: number;
    totalSpend: number;
  }>();

  orders.forEach((ord) => {
    const email = ord.shippingAddress.email.toLowerCase().trim();
    const existing = customerMap.get(email) || {
      name: ord.shippingAddress.fullName,
      email: email,
      phone: ord.shippingAddress.phone,
      companyName: ord.companyName,
      gstin: ord.gstin,
      totalOrders: 0,
      totalSpend: 0,
    };
    existing.totalOrders += 1;
    existing.totalSpend += ord.grandTotal;
    if (ord.companyName && !existing.companyName) existing.companyName = ord.companyName;
    if (ord.gstin && !existing.gstin) existing.gstin = ord.gstin;
    customerMap.set(email, existing);
  });

  const uniqueCustomers = Array.from(customerMap.values());
  const repeatCustomerCount = uniqueCustomers.filter((c) => c.totalOrders > 1).length;
  const repeatRate = uniqueCustomers.length > 0 ? Math.round((repeatCustomerCount / uniqueCustomers.length) * 100) : 0;

  // 4. PRODUCT METRICS
  const totalProductsCount = products.length;
  const lowStockProducts = products.filter((p) => p.stockQuantity <= 50 || !p.inStock);
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockQuantity === 0).length;

  // 5. RECHARTS ANALYTICS DATA
  const monthlyData = [
    { month: 'Feb', revenue: 142000, orders: 38 },
    { month: 'Mar', revenue: 185000, orders: 49 },
    { month: 'Apr', revenue: 210000, orders: 56 },
    { month: 'May', revenue: 195000, orders: 51 },
    { month: 'Jun', revenue: 245000, orders: 67 },
    { month: 'Jul', revenue: totalOrderRevenue || 289000, orders: totalOrders || 78 },
  ];

  const statusCounts = {
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    CONFIRMED: orders.filter((o) => o.status === 'CONFIRMED').length,
    PACKED: orders.filter((o) => o.status === 'PACKED').length,
    SHIPPED: orders.filter((o) => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
  };

  const statusPieData = [
    { name: 'Pending', value: statusCounts.PENDING, color: '#F59E0B' },
    { name: 'Confirmed', value: statusCounts.CONFIRMED, color: '#38BDF8' },
    { name: 'Packed', value: statusCounts.PACKED, color: '#8B5CF6' },
    { name: 'Shipped', value: statusCounts.SHIPPED, color: '#10B981' },
    { name: 'Delivered', value: statusCounts.DELIVERED, color: '#059669' },
    { name: 'Cancelled', value: statusCounts.CANCELLED, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Items', 'Total (INR)', 'Payment Status', 'Order Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      `"${o.shippingAddress.fullName}"`,
      o.shippingAddress.email,
      o.items.length,
      o.grandTotal,
      o.paymentStatus,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VSN_Cashews_Admin_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveStockQuick = (prod: Product) => {
    onUpdateProduct({
      ...prod,
      stockQuantity: stockValue,
      inStock: stockValue > 0
    });
    setStockQuickEditId(null);
  };

  return (
    <div className="space-y-6">
      {/* QUICK ACTIONS TOOLBAR (COMPACT MOBILE FRIENDLY) */}
      <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest">
                Admin Console
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-serif font-extrabold text-[#F3E5AB]">
              Executive Overview & Control
            </h2>
          </div>
        </div>

        {/* Compact Quick Action Buttons Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <SquareButton variant="gold" size="sm" onClick={onAddProduct} className="text-xs py-2">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Product
          </SquareButton>

          <SquareButton variant="outline" size="sm" onClick={() => onSwitchTab('quotes')} className="text-xs py-2">
            <Building2 className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Quotes ({quotes.length})
          </SquareButton>

          <SquareButton variant="outline" size="sm" onClick={() => onSwitchTab('invoices')} className="text-xs py-2">
            <FileText className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Invoices ({invoices.length})
          </SquareButton>

          <SquareButton variant="navy" size="sm" onClick={onOpenCategoryManager} className="text-xs py-2">
            <Package className="w-3.5 h-3.5 mr-1 text-sky-400" /> Categories
          </SquareButton>

          <SquareButton variant="ghost" size="sm" onClick={handleExportCSV} className="col-span-2 sm:col-span-1 text-xs py-2">
            <Download className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Export CSV Report
          </SquareButton>
        </div>
      </div>

      {/* TOP KPI STAT CARDS: 2 IN A ROW ON MOBILE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* CARD 1: REVENUE */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-3 sm:p-5 shadow-lg relative overflow-hidden group hover:border-[#D4AF37] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-gray-400 font-bold">
              Total Revenue
            </span>
            <div className="p-1.5 sm:p-2 bg-[#0B132B] border border-[#D4AF37]/30 text-[#D4AF37]">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-serif font-extrabold text-[#F3E5AB]">
              ₹{totalOrderRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[11px] font-mono mt-1.5 pt-1.5 border-t border-gray-800 gap-0.5">
              <span className="text-emerald-400 font-bold">
                Paid: ₹{paidRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-amber-400">
                Pend: ₹{pendingReceivables.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: ORDERS */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-3 sm:p-5 shadow-lg relative overflow-hidden group hover:border-[#D4AF37] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-gray-400 font-bold">
              Total Orders
            </span>
            <div className="p-1.5 sm:p-2 bg-[#0B132B] border border-sky-500/30 text-sky-400">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-serif font-extrabold text-white">
              {totalOrders} <span className="text-[10px] font-mono font-normal text-gray-400">orders</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[11px] font-mono mt-1.5 pt-1.5 border-t border-gray-800 gap-0.5">
              <span className="text-amber-400 font-bold">
                {pendingOrders.length} Pending
              </span>
              <span className="text-emerald-400">
                {fulfilledOrdersCount} Delivered
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: CUSTOMERS */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-3 sm:p-5 shadow-lg relative overflow-hidden group hover:border-[#D4AF37] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-gray-400 font-bold">
              Customers
            </span>
            <div className="p-1.5 sm:p-2 bg-[#0B132B] border border-emerald-500/30 text-emerald-400">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-serif font-extrabold text-white">
              {uniqueCustomers.length} <span className="text-[10px] font-mono font-normal text-gray-400">clients</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[11px] font-mono mt-1.5 pt-1.5 border-t border-gray-800 gap-0.5">
              <span className="text-sky-300">
                Avg: ₹{avgOrderValue.toLocaleString('en-IN')}
              </span>
              <span className="text-[#D4AF37] font-bold">
                {repeatRate}% Repeat
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: PRODUCTS / LOW STOCK */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-3 sm:p-5 shadow-lg relative overflow-hidden group hover:border-[#D4AF37] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-gray-400 font-bold">
              Catalog SKUs
            </span>
            <div className="p-1.5 sm:p-2 bg-[#0B132B] border border-rose-500/30 text-rose-400">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-serif font-extrabold text-white">
              {totalProductsCount} <span className="text-[10px] font-mono font-normal text-gray-400">SKUs</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[11px] font-mono mt-1.5 pt-1.5 border-t border-gray-800 gap-0.5">
              <span className="text-rose-400 font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> {lowStockProducts.length} Low
              </span>
              <span className="text-emerald-400">
                {totalProductsCount - outOfStockCount} Stocked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS & CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE & ORDERS TREND CHART */}
        <div className="lg:col-span-2 bg-[#1C2541] border border-[#D4AF37]/40 p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
                Financial Performance Analytics
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#D4AF37]" /> Revenue & Order Volume
              </h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400 bg-[#0B132B] px-2 py-1 border border-gray-700">
              Past 6 Months
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#D4AF37', borderRadius: '0px', color: '#fff', fontSize: '11px' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                Loading Analytics Chart...
              </div>
            )}
          </div>
        </div>

        {/* ORDER STATUS DONUT CHART */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-4 sm:p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
                  Fulfillment Status
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#D4AF37]" /> Order Distribution
                </h3>
              </div>
            </div>

            <div className="h-48 sm:h-52 w-full mt-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B132B', borderColor: '#D4AF37', color: '#fff', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                  Loading Status Distribution...
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-gray-800">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-300">{item.name}:</span>
                </div>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PENDING ORDERS & LOW STOCK DUAL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PENDING ORDERS HIGH-PRIORITY ACTION PANEL */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#F3E5AB]">
                  Pending Orders ({pendingOrders.length})
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">
                  Orders waiting for dispatch
                </p>
              </div>
            </div>
            <SquareButton variant="outline" size="sm" onClick={() => onSwitchTab('orders')} className="text-xs">
              Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </SquareButton>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-400 font-mono text-xs bg-[#0B132B]/50 border border-gray-800 space-y-2">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
              <div>All orders are processed and fulfilled!</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#0B132B] border border-gray-800 p-3 hover:border-[#D4AF37]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#D4AF37]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[9px] font-mono bg-amber-950 text-amber-300 border border-amber-600/50 px-1.5 py-0.5 font-bold uppercase">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-xs text-white mt-1 font-bold">
                      {ord.shippingAddress.fullName}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {ord.items.length} item(s) • ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SquareButton
                      variant="gold"
                      size="sm"
                      onClick={() => updateOrderStatus(ord.id, 'PACKED')}
                      className="text-[9px] py-1 px-2"
                    >
                      Packed
                    </SquareButton>
                    <SquareButton
                      variant="navy"
                      size="sm"
                      onClick={() => updateOrderStatus(ord.id, 'SHIPPED')}
                      className="text-[9px] py-1 px-2"
                    >
                      Shipped
                    </SquareButton>
                    <button
                      onClick={() => setSelectedOrderForModal(ord)}
                      className="p-1.5 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOW STOCK INVENTORY ALERTS PANEL */}
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-rose-300">
                  Stock Alerts ({lowStockProducts.length})
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">
                  Items requiring replenishment
                </p>
              </div>
            </div>
            <SquareButton variant="outline" size="sm" onClick={() => onSwitchTab('products')} className="text-xs">
              Catalog <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </SquareButton>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-400 font-mono text-xs bg-[#0B132B]/50 border border-gray-800 space-y-2">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
              <div>Inventory levels healthy across all SKUs!</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0B132B] border border-rose-900/40 p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80'}
                      alt={prod.name}
                      className="w-8 h-8 object-cover border border-gray-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">
                        {prod.name}
                      </div>
                      <div className="text-[9px] font-mono text-gray-400">
                        Grade: {prod.grade}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {stockQuickEditId === prod.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={stockValue}
                          onChange={(e) => setStockValue(Number(e.target.value))}
                          className="w-14 bg-gray-900 border border-[#D4AF37] px-1.5 py-0.5 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => handleSaveStockQuick(prod)}
                          className="bg-emerald-500 text-black px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-rose-400 block">
                            {prod.stockQuantity} kg
                          </span>
                        </div>
                        <SquareButton
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setStockQuickEditId(prod.id);
                            setStockValue(prod.stockQuantity);
                          }}
                          className="text-[9px] py-0.5 px-1.5 border-gray-700"
                        >
                          Replenish
                        </SquareButton>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
              Transaction Log
            </span>
            <h3 className="font-serif text-base sm:text-xl font-bold text-white">
              Recent Customer Orders
            </h3>
          </div>
          <SquareButton variant="gold" size="sm" onClick={() => onSwitchTab('orders')} className="text-xs">
            View All ({orders.length}) <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </SquareButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#0B132B] text-gray-400 uppercase text-[9px] border-b border-gray-800">
                <th className="p-2.5">Order</th>
                <th className="p-2.5">Customer</th>
                <th className="p-2.5">Total</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-[11px]">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-[#0B132B]/60 transition-colors">
                  <td className="p-2.5 font-bold text-[#D4AF37]">
                    {ord.orderNumber}
                  </td>
                  <td className="p-2.5">
                    <div className="text-white font-bold">{ord.shippingAddress.fullName}</div>
                  </td>
                  <td className="p-2.5 font-bold text-white">
                    ₹{ord.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold uppercase border ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                          : ord.status === 'SHIPPED'
                          ? 'bg-sky-950 text-sky-300 border-sky-600/50'
                          : 'bg-amber-950 text-amber-300 border-amber-600/50'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => setSelectedOrderForModal(ord)}
                      className="p-1 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] text-[10px]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrderForModal && (
        <OrderDetailsModal
          order={selectedOrderForModal}
          onClose={() => setSelectedOrderForModal(null)}
        />
      )}
    </div>
  );
};
