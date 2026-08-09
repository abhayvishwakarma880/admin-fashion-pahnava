import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, Loader2, Package, ToggleLeft, ToggleRight, Eye, X, Edit3, Check, Upload, Image as ImageIcon, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getProducts, updateProductStatus, deleteProduct, updateProduct, uploadImageApi } from '../api/productApi';
import { getCategories } from '../api/categoryApi';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);

  // Edit Modal state
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    _id: '',
    categoryid: '',
    name: '',
    description: '',
    price: '',
    offpercantage: '0',
    discountPrice: '',
    image: '',
    isActive: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch Products & Categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (catRes.success) setCategories(catRes.categories || []);
    } catch (error) {
      console.error('Error loading products/categories:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Edit Modal and prefill data
  const handleOpenEdit = (p) => {
    const price = p.price || 0;
    const off = p.offpercantage || 0;
    const discountPrice = p.discountPrice || p.descountPrice || Math.round((price - (price * off) / 100) * 100) / 100;
    setEditData({
      _id: p._id,
      categoryid: p.categoryid?._id || p.categoryid || '',
      name: p.name || '',
      description: p.description || '',
      price: price.toString(),
      offpercantage: off.toString(),
      discountPrice: discountPrice.toString(),
      image: p.image || '',
      isActive: Boolean(p.isActive),
    });
    setEditModal(true);
  };

  // Auto-calculate discountPrice in edit form
  const handleEditPriceOrOff = (field, value) => {
    const updated = { ...editData, [field]: value };
    const priceNum = parseFloat(updated.price) || 0;
    const offNum = parseFloat(updated.offpercantage) || 0;
    if (priceNum > 0) {
      const calc = Math.round((priceNum - (priceNum * offNum) / 100) * 100) / 100;
      updated.discountPrice = calc >= 0 ? calc.toString() : '0';
    } else {
      updated.discountPrice = '';
    }
    setEditData(updated);
  };

  // Cloudinary image upload in edit modal
  const handleEditImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB');
      return;
    }
    try {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const res = await uploadImageApi(reader.result);
          if (res.success && res.url) {
            setEditData((prev) => ({ ...prev, image: res.url }));
            toast.success('Image uploaded to Cloudinary!');
          } else {
            throw new Error(res.message);
          }
        } catch (err) {
          toast.error(err.message || 'Failed to upload image');
        } finally {
          setIsUploadingImage(false);
        }
      };
    } catch {
      toast.error('Failed to read file');
      setIsUploadingImage(false);
    }
  };

  // Submit Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData.name.trim()) { toast.error('Product name is required'); return; }
    if (!editData.price || parseFloat(editData.price) <= 0) { toast.error('Valid price is required'); return; }
    if (!editData.categoryid) { toast.error('Please select a category'); return; }

    try {
      setIsUpdating(true);
      const payload = {
        categoryid: editData.categoryid,
        name: editData.name.trim(),
        description: editData.description.trim(),
        price: Number(editData.price),
        offpercantage: Number(editData.offpercantage) || 0,
        discountPrice: Number(editData.discountPrice) || Number(editData.price),
        descountPrice: Number(editData.discountPrice) || Number(editData.price),
        image: editData.image.trim(),
        isActive: Boolean(editData.isActive),
      };

      const res = await updateProduct(editData._id, payload);
      if (res.success) {
        toast.success('Product updated successfully!');
        setEditModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle Product Active Status (PATCH API)
  const handleToggleStatus = async (product) => {
    const originalStatus = product.isActive;
    const newStatus = !originalStatus;
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, isActive: newStatus } : p))
    );
    try {
      const res = await updateProductStatus(product._id, newStatus);
      if (res.success) {
        toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, isActive: originalStatus } : p))
      );
    }
  };

  // Delete Product
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted successfully');
        fetchData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const categoryTitle = p.categoryid?.title || 'Uncategorized';
    const matchesCategory = selectedCategory === 'All' || categoryTitle === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#C79A5B]" />
            <span>Products Catalog</span>
          </h1>
          <p className="text-xs text-[#838280]">
            Manage product listings, categories, prices, and status for Fashion Pehnava
          </p>
        </div>
        <Link
          to="/add-product"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] text-white px-4 py-2.5 rounded font-semibold text-xs shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#EADBC8]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#1c1611] border border-[#342a20] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838280]" />
          <input
            type="text"
            placeholder="Search by product name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#241c15] border border-[#382c20] rounded pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white shadow-md border border-[#C79A5B]/40'
                : 'bg-[#241c15] text-[#838280] hover:text-white hover:bg-[#2d231b]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.title
                  ? 'bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white shadow-md border border-[#C79A5B]/40'
                  : 'bg-[#241c15] text-[#838280] hover:text-white hover:bg-[#2d231b]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#1c1611] border border-[#342a20] rounded p-5 shadow-xl overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#838280] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C79A5B]" />
            <p className="text-xs font-medium">Loading products catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#241c15] border border-[#342a20] flex items-center justify-center text-[#838280]">
              <Package className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-200">No Products Found</p>
            <p className="text-xs text-[#838280] max-w-xs">
              {searchTerm || selectedCategory !== 'All'
                ? 'No product matches your filters.'
                : 'Click on "Add New Product" to publish your first item.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#2e251e] text-[11px] font-bold text-[#838280] uppercase tracking-wider">
                <th className="pb-3 px-3 w-14">Image</th>
                <th className="pb-3 px-3">Product Name</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Regular Price</th>
                <th className="pb-3 px-3">Discount (%)</th>
                <th className="pb-3 px-3">Offer Price</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e251e] text-xs">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-[#241c15] transition-colors group">
                  {/* Image Thumbnail */}
                  <td className="py-3.5 px-3">
                    <div className="w-10 h-10 bg-[#2b2219] border border-[#3d3023] rounded flex items-center justify-center overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <Package className="w-5 h-5 text-[#838280]" />
                      )}
                    </div>
                  </td>

                  {/* Name & Description */}
                  <td className="py-3.5 px-3">
                    <div>
                      <p className="font-semibold text-white group-hover:text-[#C79A5B] transition-colors text-sm">{p.name}</p>
                      {p.description && (
                        <p className="text-[11px] text-[#838280] truncate max-w-xs">{p.description}</p>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded bg-[#2b2219] border border-[#3d3023] text-[#C79A5B] text-[11px]">
                      {p.categoryid?.title || 'Uncategorized'}
                    </span>
                  </td>

                  {/* Regular Price */}
                  <td className="py-3.5 px-3 font-semibold text-slate-300">₹{p.price?.toLocaleString()}</td>

                  {/* Off Percentage */}
                  <td className="py-3.5 px-3 font-semibold text-amber-400">
                    {p.offpercantage ? `${p.offpercantage}% OFF` : '0%'}
                  </td>

                  {/* Discount Price */}
                  <td className="py-3.5 px-3 font-extrabold text-white">
                    ₹{(p.discountPrice || p.descountPrice || p.price)?.toLocaleString()}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                        p.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                      title="Click to toggle status"
                    >
                      <span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      <span>{p.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <button
                        onClick={() => setSelectedViewProduct(p)}
                        className="p-1.5 rounded text-[#C79A5B] hover:text-white hover:bg-[#2d241c] transition-all cursor-pointer"
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded text-sky-400 hover:text-white hover:bg-sky-500/10 transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`p-1.5 rounded transition-all cursor-pointer ${
                          p.isActive
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-[#838280] hover:text-white hover:bg-[#2d241c]'
                        }`}
                        title={p.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {p.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== EDIT PRODUCT MODAL ===== */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200 relative">
            {/* Close */}
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded text-[#838280] hover:text-white hover:bg-[#282018] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#2e251e] pb-3 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#C79A5B]" />
              <h2 className="text-base font-bold text-white">Update Product</h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Category & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={editData.categoryid}
                    onChange={(e) => setEditData({ ...editData, categoryid: e.target.value })}
                    required
                    className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 cursor-pointer"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}{!cat.isActive ? ' (Inactive)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                    Product Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Banarasi Silk Saree"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    required
                    className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Product description..."
                  className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                    Regular Price (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number" min="0" step="0.01"
                    value={editData.price}
                    onChange={(e) => handleEditPriceOrOff('price', e.target.value)}
                    required
                    className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-[#C79A5B]" />
                    Off Percentage (%)
                  </label>
                  <input
                    type="number" min="0" max="100"
                    value={editData.offpercantage}
                    onChange={(e) => handleEditPriceOrOff('offpercantage', e.target.value)}
                    className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">Discount Price (₹)</label>
                  <input
                    type="number" readOnly
                    value={editData.discountPrice}
                    className="w-full bg-[#2a221a] border border-[#382c20] rounded px-4 py-2.5 text-xs text-[#C79A5B] font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C79A5B]" />
                  Product Image
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    {/* File Upload */}
                    <label className="border-2 border-dashed border-[#382c20] hover:border-[#C79A5B] rounded p-4 text-center bg-[#241c15] hover:bg-[#2e231b] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group">
                      <input type="file" accept="image/*" onChange={handleEditImageUpload} disabled={isUploadingImage} className="hidden" />
                      {isUploadingImage ? (
                        <div className="flex items-center gap-2 text-[#C79A5B]">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-xs">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[#C79A5B] group-hover:scale-110 transition-transform" />
                          <span className="text-xs text-white font-medium">Click to upload</span>
                          <span className="text-[10px] text-[#838280]">PNG, JPG, WEBP up to 10MB</span>
                        </>
                      )}
                    </label>
                    {/* Or URL input */}
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={editData.image}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      className="w-full bg-[#241c15] border border-[#382c20] rounded px-3 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40"
                    />
                  </div>
                  {/* Preview */}
                  <div className="flex flex-col items-center justify-center border border-[#342a20] rounded p-3 bg-[#241c15] min-h-[120px]">
                    <span className="text-[10px] text-[#838280] mb-2">Preview</span>
                    {editData.image ? (
                      <div className="relative">
                        <img
                          src={editData.image}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded border border-[#3d3023]"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setEditData({ ...editData, image: '' })}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#838280]" />
                    )}
                  </div>
                </div>
              </div>

              {/* isActive Toggle */}
              <div className="flex items-center justify-between p-3 rounded bg-[#241c15] border border-[#342a20]">
                <div>
                  <span className="block text-xs font-semibold text-slate-200">Active Status</span>
                  <span className="text-[10px] text-[#838280]">
                    {editData.isActive ? 'Visible in store' : 'Hidden from store'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditData({ ...editData, isActive: !editData.isActive })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${editData.isActive ? 'bg-[#774C13]' : 'bg-[#342a20]'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${editData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2e251e]">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2.5 rounded text-xs font-semibold text-[#838280] hover:text-white hover:bg-[#282018] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || isUploadingImage}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:opacity-95 text-white px-6 py-2.5 rounded font-semibold text-xs shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#EADBC8]" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#EADBC8]" />
                      <span>Update Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== VIEW PRODUCT MODAL ===== */}
      {selectedViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setSelectedViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded text-[#838280] hover:text-white hover:bg-[#282018] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#2e251e] pb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C79A5B]" />
              <h2 className="text-lg font-bold text-white">Product Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="w-full h-44 bg-[#241c15] border border-[#382c20] rounded flex items-center justify-center overflow-hidden shrink-0">
                {selectedViewProduct.image ? (
                  <img src={selectedViewProduct.image} alt={selectedViewProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-[#838280]" />
                )}
              </div>

              <div className="sm:col-span-2 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#2b2219] border border-[#3d3023] text-[#C79A5B] text-xs font-semibold">
                    {selectedViewProduct.categoryid?.title || 'Uncategorized'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedViewProduct.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {selectedViewProduct.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight">{selectedViewProduct.name}</h3>

                <div className="bg-[#241c15] border border-[#342a20] rounded p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#838280]">Regular Price:</span>
                    <span className="text-slate-300 font-semibold line-through">₹{selectedViewProduct.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#838280]">Discount Off:</span>
                    <span className="text-amber-400 font-bold">{selectedViewProduct.offpercantage || 0}% OFF</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1.5 border-t border-[#342a20]">
                    <span className="font-semibold text-white">Offer Price:</span>
                    <span className="text-lg font-extrabold text-[#C79A5B]">
                      ₹{(selectedViewProduct.discountPrice || selectedViewProduct.descountPrice || selectedViewProduct.price)?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 bg-[#241c15] border border-[#342a20] rounded p-3">
              <span className="text-xs font-semibold text-[#EADBC8] block">Description:</span>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedViewProduct.description || 'No description available for this product.'}
              </p>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[#2e251e]">
              <button
                type="button"
                onClick={() => setSelectedViewProduct(null)}
                className="bg-[#241c15] hover:bg-[#2e231b] border border-[#382c20] text-slate-200 px-5 py-2 rounded text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
