import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Eye,
  Loader2,
  Package,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getOrders, updateOrderStatus, deleteOrder } from '../api/orderApi';

const STATUS_LIST = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    case 'Confirmed':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/30';
    case 'Processing':
    case 'Shipped':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    case 'Cancelled':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(10);

  // View modal state
  const [selectedViewOrder, setSelectedViewOrder] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch orders from API with server-side filter, search, & pagination
  const fetchOrdersData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: limit,
      };

      if (selectedStatus && selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await getOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
        setTotalPages(res.totalPages || 1);
        setTotalOrders(res.totalOrders || 0);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  // Handle status tab change
  const handleStatusTabChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle Order Status Update (PATCH API)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedViewOrder && selectedViewOrder._id === orderId) {
          setSelectedViewOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  // Handle Delete Order
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteOrder(orderToDelete._id);
      if (res.success) {
        toast.success('Order deleted successfully');
        setDeleteModalOpen(false);
        setOrderToDelete(null);
        fetchOrdersData();
      }
    } catch (error) {
      console.error('Delete order error:', error);
      toast.error(error.message || 'Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#C79A5B]" />
            <span>Order Management</span>
          </h1>
          <p className="text-xs text-[#838280] mt-1">
            View, search, filter and process customer orders across India
          </p>
        </div>
        <div className="text-xs font-semibold text-[#838280] bg-[#1c1611] border border-[#342a20] px-4 py-2 rounded self-start sm:self-auto">
          Total Orders: <span className="text-[#C79A5B] font-bold text-sm ml-1">{totalOrders}</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#1c1611] border border-[#342a20] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838280]" />
          <input
            type="text"
            placeholder="Search by order #, customer name, phone, email, pincode..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-[#241c15] border border-[#382c20] rounded pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {STATUS_LIST.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusTabChange(status)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white shadow-md border border-[#C79A5B]/40'
                  : 'bg-[#241c15] text-[#838280] hover:text-white hover:bg-[#2d231b]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#1c1611] border border-[#342a20] rounded p-5 shadow-xl overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#838280] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C79A5B]" />
            <p className="text-xs font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#241c15] border border-[#342a20] flex items-center justify-center text-[#838280]">
              <Package className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-200">No Orders Found</p>
            <p className="text-xs text-[#838280] max-w-xs">
              {searchTerm || selectedStatus !== 'All'
                ? 'No orders match your filter criteria.'
                : 'Customer orders will appear here once booked.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-[#2e251e] text-[11px] font-bold text-[#838280] uppercase tracking-wider">
                <th className="pb-3 px-3">Order #</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Product</th>
                <th className="pb-3 px-3">Pincode & Address</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e251e] text-xs">
              {orders.map((o) => {
                const prod = o.productId;
                const prodName = prod?.name || 'Standard Item';
                const prodPrice = prod?.discountPrice || prod?.descountPrice || prod?.price || 0;
                const prodImg = prod?.image || '';

                return (
                  <tr key={o._id} className="hover:bg-[#241c15] transition-colors group">
                    {/* Order Number */}
                    <td className="py-3.5 px-3 font-bold text-[#C79A5B] font-mono">
                      {o.orderNumber || 'N/A'}
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="font-semibold text-white group-hover:text-[#C79A5B] transition-colors">
                          {o.name}
                        </p>
                        <p className="text-[10px] text-[#838280]">{o.phone}</p>
                        {o.email && <p className="text-[10px] text-[#838280] truncate max-w-[140px]">{o.email}</p>}
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded bg-[#2b2219] border border-[#3d3023] flex items-center justify-center overflow-hidden shrink-0">
                          {prodImg ? (
                            <img src={prodImg} alt={prodName} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-[#838280]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200 line-clamp-1">{prodName}</p>
                          <p className="text-[11px] font-bold text-[#C79A5B]">₹{prodPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Address / Pincode */}
                    <td className="py-3.5 px-3">
                      <div className="max-w-xs">
                        <p className="text-slate-300 line-clamp-1">{o.fullAddress}</p>
                        <p className="text-[10px] text-[#838280]">
                          {o.district ? `${o.district}, ` : ''}{o.state ? `${o.state} - ` : ''}PIN: <span className="text-slate-300 font-semibold">{o.pincode}</span>
                        </p>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={o.status || 'Pending'}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded cursor-pointer border focus:outline-none transition-all ${getStatusBadgeStyle(
                          o.status
                        )}`}
                      >
                        <option value="Pending" className="bg-[#1c1611] text-yellow-400">Pending</option>
                        <option value="Confirmed" className="bg-[#1c1611] text-sky-400">Confirmed</option>
                        <option value="Processing" className="bg-[#1c1611] text-amber-400">Processing</option>
                        <option value="Shipped" className="bg-[#1c1611] text-amber-400">Shipped</option>
                        <option value="Delivered" className="bg-[#1c1611] text-emerald-400">Delivered</option>
                        <option value="Cancelled" className="bg-[#1c1611] text-rose-400">Cancelled</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-[#838280] font-medium whitespace-nowrap">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedViewOrder(o)}
                          className="p-1.5 rounded text-[#C79A5B] hover:text-white hover:bg-[#2d241c] transition-all cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setOrderToDelete(o);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Server-side Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#2e251e] text-xs">
            <div className="text-[#838280]">
              Showing Page <span className="text-white font-bold">{currentPage}</span> of{' '}
              <span className="text-white font-bold">{totalPages}</span> ({totalOrders} total orders)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#241c15] border border-[#382c20] text-[#838280] hover:text-white hover:bg-[#2d231b] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pg
                        ? 'bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white border border-[#C79A5B]/40'
                        : 'bg-[#241c15] text-[#838280] hover:text-white'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#241c15] border border-[#382c20] text-[#838280] hover:text-white hover:bg-[#2d231b] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== VIEW ORDER MODAL ===== */}
      {selectedViewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedViewOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded text-[#838280] hover:text-white hover:bg-[#282018] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#2e251e] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C79A5B]" />
                <h2 className="text-lg font-bold text-white font-mono">{selectedViewOrder.orderNumber}</h2>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusBadgeStyle(selectedViewOrder.status)}`}>
                {selectedViewOrder.status}
              </span>
            </div>

            {/* Customer & Address Details */}
            <div className="bg-[#241c15] border border-[#342a20] rounded p-4 space-y-3">
              <h3 className="text-xs font-bold text-[#EADBC8] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C79A5B]" />
                Customer Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-[#838280]" />
                  <span className="font-semibold text-white">{selectedViewOrder.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-[#838280]" />
                  <span>{selectedViewOrder.phone}</span>
                </div>
                {selectedViewOrder.email && (
                  <div className="flex items-center gap-2 text-slate-300 sm:col-span-2">
                    <Mail className="w-3.5 h-3.5 text-[#838280]" />
                    <span>{selectedViewOrder.email}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#342a20] pt-2.5 space-y-1 text-xs">
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#C79A5B] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{selectedViewOrder.fullAddress}</p>
                    <p className="text-[11px] text-[#838280]">
                      {selectedViewOrder.district ? `${selectedViewOrder.district}, ` : ''}
                      {selectedViewOrder.state ? `${selectedViewOrder.state} - ` : ''}
                      PIN: <span className="text-white font-bold">{selectedViewOrder.pincode}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Summary */}
            <div className="bg-[#241c15] border border-[#342a20] rounded p-4 space-y-3">
              <h3 className="text-xs font-bold text-[#EADBC8] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#C79A5B]" />
                Product Details
              </h3>
              {selectedViewOrder.productId ? (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#2b2219] border border-[#3d3023] rounded flex items-center justify-center overflow-hidden shrink-0">
                    {selectedViewOrder.productId.image ? (
                      <img src={selectedViewOrder.productId.image} alt={selectedViewOrder.productId.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-[#838280]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{selectedViewOrder.productId.name}</p>
                    <p className="text-xs font-bold text-[#C79A5B]">
                      ₹{(selectedViewOrder.productId.discountPrice || selectedViewOrder.productId.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#838280]">Item details not linked</p>
              )}
            </div>

            {/* Date & Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2e251e] text-xs">
              <div className="flex items-center gap-1.5 text-[#838280]">
                <Calendar className="w-3.5 h-3.5 text-[#C79A5B]" />
                <span>
                  Placed on:{' '}
                  {selectedViewOrder.createdAt
                    ? new Date(selectedViewOrder.createdAt).toLocaleString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedViewOrder(null)}
                className="bg-[#241c15] hover:bg-[#2e231b] border border-[#382c20] text-slate-200 px-5 py-2 rounded font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-2xl max-w-sm w-full space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Order?</h3>
              <p className="text-xs text-[#838280] mt-1">
                Are you sure you want to delete order <span className="text-white font-semibold font-mono">"{orderToDelete.orderNumber}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded text-xs font-semibold text-[#838280] hover:text-white hover:bg-[#282018] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
