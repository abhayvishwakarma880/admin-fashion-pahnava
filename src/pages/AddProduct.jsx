import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, Package, Tag, Percent, DollarSign, FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getCategories } from '../api/categoryApi';
import { createProduct, uploadImageApi } from '../api/productApi';

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    categoryid: '',
    name: '',
    description: '',
    price: '',
    offpercantage: '0',
    discountPrice: '',
    image: '',
    isActive: true,
  });

  // Fetch categories for categoryid dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
          const activeCats = res.categories.filter((c) => c.isActive);
          if (activeCats.length > 0) {
            setFormData((prev) => ({ ...prev, categoryid: activeCats[0]._id }));
          } else if (res.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryid: res.categories[0]._id }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle File Upload to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    try {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result;
        try {
          const res = await uploadImageApi(base64Data);
          if (res.success && res.url) {
            setFormData((prev) => ({ ...prev, image: res.url }));
            toast.success('Image uploaded to Cloudinary!');
          } else {
            throw new Error(res.message);
          }
        } catch (err) {
          console.error('Cloudinary upload error:', err);
          toast.error(err.message || 'Failed to upload image to Cloudinary');
        } finally {
          setIsUploadingImage(false);
        }
      };
    } catch (err) {
      console.error('File reading error:', err);
      toast.error('Failed to read image file');
      setIsUploadingImage(false);
    }
  };

  // Auto-calculate discountPrice when price or offpercantage changes
  const handlePriceOrOffChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    const priceNum = parseFloat(updated.price) || 0;
    const offNum = parseFloat(updated.offpercantage) || 0;

    if (priceNum > 0) {
      const calculated = Math.round((priceNum - (priceNum * offNum) / 100) * 100) / 100;
      updated.discountPrice = calculated >= 0 ? calculated : 0;
    } else {
      updated.discountPrice = '';
    }

    setFormData(updated);
  };

  // Submit Product Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryid) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter product name');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid product price');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        categoryid: formData.categoryid,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        offpercantage: Number(formData.offpercantage) || 0,
        discountPrice: Number(formData.discountPrice) || Number(formData.price),
        descountPrice: Number(formData.discountPrice) || Number(formData.price),
        image: formData.image.trim(),
        isActive: Boolean(formData.isActive),
      };

      const res = await createProduct(payload);

      if (res.success) {
        toast.success('Product created successfully!');
        setFormData({
          categoryid: categories.length > 0 ? categories[0]._id : '',
          name: '',
          description: '',
          price: '',
          offpercantage: '0',
          discountPrice: '',
          image: '',
          isActive: true,
        });
        setTimeout(() => {
          navigate('/products');
        }, 1200);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="p-2 rounded text-slate-400 hover:text-white bg-[#1c1611] border border-[#342a20] hover:bg-[#251d16] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#C79A5B]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-[#C79A5B]" />
              <span>Add New Product</span>
            </h1>
            <p className="text-xs text-[#838280]">
              Create a new product catalog item with image, category, and pricing details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isUploadingImage}
          className="flex items-center gap-2 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:opacity-95 text-white px-5 py-2.5 rounded font-semibold text-xs shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#EADBC8]" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#EADBC8]" />
              <span>Publish Product</span>
            </>
          )}
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category & Product Name */}
        <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm border-b border-[#2e251e] pb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#C79A5B]" />
            <span>Product Identity & Category</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category ID Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              {loadingCategories ? (
                <div className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-[#838280] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C79A5B]" />
                  <span>Loading categories...</span>
                </div>
              ) : (
                <select
                  value={formData.categoryid}
                  onChange={(e) => setFormData({ ...formData, categoryid: e.target.value })}
                  required
                  className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 focus:border-[#C79A5B] transition-all cursor-pointer"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title} {!cat.isActive ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Banarasi Zari Silk Saree"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 focus:border-[#C79A5B] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C79A5B]" />
              <span>Description</span>
            </label>
            <textarea
              rows={4}
              placeholder="Enter detailed product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 focus:border-[#C79A5B] transition-all"
            />
          </div>
        </div>

        {/* Product Image Section (Cloudinary Upload) */}
        <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm border-b border-[#2e251e] pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C79A5B]" />
            <span>Product Image (Cloudinary Upload)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* File Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#EADBC8]">
                Upload Image File
              </label>

              <label className="border-2 border-dashed border-[#382c20] hover:border-[#C79A5B] rounded p-6 text-center bg-[#241c15] hover:bg-[#2e231b] transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                {isUploadingImage ? (
                  <div className="flex flex-col items-center space-y-2 text-[#C79A5B]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-semibold">Uploading to Cloudinary...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded bg-[#774C13]/20 text-[#C79A5B] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-white">Click to browse & upload</span>
                    <span className="text-[10px] text-[#838280]">Supports PNG, JPG, WEBP up to 10MB</span>
                  </>
                )}
              </label>

              {/* Or Direct Image URL Input */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-[#838280] mb-1">
                  Or enter Direct Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/... or image link"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 focus:border-[#C79A5B] transition-all"
                />
              </div>
            </div>

            {/* Cloudinary Preview Display */}
            <div className="flex flex-col items-center justify-center border border-[#342a20] rounded p-4 bg-[#241c15] space-y-3 min-h-[190px]">
              <span className="text-xs font-semibold text-[#EADBC8]">Cloudinary Preview</span>

              {formData.image ? (
                <div className="relative group flex flex-col items-center">
                  <img
                    src={formData.image}
                    alt="Cloudinary Product Preview"
                    className="w-36 h-36 object-cover rounded border border-[#3d3023] shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="mt-2 flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-[#838280] space-y-2">
                  <ImageIcon className="w-10 h-10" />
                  <span className="text-xs">No image uploaded yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm border-b border-[#2e251e] pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#C79A5B]" />
            <span>Pricing & Discount Setup</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                Regular Price (₹) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 4999"
                value={formData.price}
                onChange={(e) => handlePriceOrOffChange('price', e.target.value)}
                required
                className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 focus:border-[#C79A5B] transition-all"
              />
            </div>

            {/* Off Percentage */}
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-[#C79A5B]" />
                <span>Off Percentage (%)</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 15"
                value={formData.offpercantage}
                onChange={(e) => handlePriceOrOffChange('offpercantage', e.target.value)}
                className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-2.5 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 focus:border-[#C79A5B] transition-all"
              />
            </div>

            {/* Discount Price */}
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">
                Calculated Discount Price (₹)
              </label>
              <input
                type="number"
                readOnly
                placeholder="Auto-calculated"
                value={formData.discountPrice}
                className="w-full bg-[#2a221a] border border-[#382c20] rounded px-4 py-2.5 text-xs text-[#C79A5B] font-bold focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-xl flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white text-xs">Product Active Status</h4>
            <p className="text-[11px] text-[#838280] mt-0.5">
              {formData.isActive ? 'Product will be visible in store' : 'Product will be hidden from store'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
              formData.isActive ? 'bg-[#774C13]' : 'bg-[#342a20]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                formData.isActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/products"
            className="px-5 py-2.5 rounded text-xs font-semibold text-[#838280] hover:text-white hover:bg-[#282018] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:opacity-95 text-white px-6 py-2.5 rounded font-semibold text-xs shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#EADBC8]" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#EADBC8]" />
                <span>Save & Publish Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
