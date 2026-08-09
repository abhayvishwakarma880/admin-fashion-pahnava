import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Layers,
  Loader2,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  uploadCategoryImageApi,
} from '../api/categoryApi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast.error(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset modal fields
  const resetModal = () => {
    setTitle('');
    setIsActive(true);
    setImage('');
    setSelectedCategoryId(null);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    resetModal();
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat) => {
    setModalMode('edit');
    setSelectedCategoryId(cat._id);
    setTitle(cat.title);
    setIsActive(cat.isActive);
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  // Cloudinary Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const res = await uploadCategoryImageApi(reader.result);
          if (res.success && res.url) {
            setImage(res.url);
            toast.success('Image uploaded successfully!');
          } else {
            throw new Error(res.message || 'Upload failed');
          }
        } catch (err) {
          toast.error(err.message || 'Failed to upload image');
        } finally {
          setIsUploadingImage(false);
        }
      };
    } catch {
      toast.error('Failed to read image file');
      setIsUploadingImage(false);
    }
  };

  // Submit Create or Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter category title');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { title: title.trim(), isActive, image: image.trim() };

      if (modalMode === 'create') {
        const res = await createCategory(payload);
        if (res.success) {
          toast.success('Category created successfully!');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await updateCategory(selectedCategoryId, payload);
        if (res.success) {
          toast.success('Category updated successfully!');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (error) {
      console.error('Save category error:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Category Status (PATCH API)
  const handleToggleStatus = async (cat) => {
    const originalStatus = cat.isActive;
    const newStatus = !originalStatus;

    setCategories((prev) =>
      prev.map((item) => (item._id === cat._id ? { ...item, isActive: newStatus } : item))
    );

    try {
      const res = await updateCategoryStatus(cat._id, newStatus);
      if (res.success) {
        toast.success(`Category ${newStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.error(error.message || 'Failed to update status');
      setCategories((prev) =>
        prev.map((item) => (item._id === cat._id ? { ...item, isActive: originalStatus } : item))
      );
    }
  };

  // Open Delete Modal
  const handleConfirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  // Execute Delete
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteCategory(categoryToDelete._id);
      if (res.success) {
        toast.success('Category deleted successfully!');
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#C79A5B]" />
            <span>Category Management</span>
          </h1>
          <p className="text-xs text-[#838280] mt-1">
            Manage your store product categories, images and active status
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:from-[#8c5916] hover:to-[#b87a24] text-white px-5 py-2.5 rounded font-semibold text-xs shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#EADBC8]" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#1c1611] border border-[#342a20] rounded p-4 flex items-center justify-between shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838280]" />
          <input
            type="text"
            placeholder="Search categories by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#241c15] border border-[#382c20] rounded pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 transition-all"
          />
        </div>
        <div className="text-xs font-semibold text-[#838280] hidden sm:block">
          Total: <span className="text-[#C79A5B] font-bold">{filteredCategories.length}</span>
        </div>
      </div>

      {/* Categories Table Container */}
      <div className="bg-[#1c1611] border border-[#342a20] rounded p-5 shadow-xl overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#838280] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C79A5B]" />
            <p className="text-xs font-medium">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#241c15] border border-[#342a20] flex items-center justify-center text-[#838280]">
              <Layers className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-200">No Categories Found</p>
            <p className="text-xs text-[#838280] max-w-xs">
              {searchTerm
                ? 'No category matches your search filter.'
                : 'Click on "Create Category" to add your first category.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#2e251e] text-[11px] font-bold text-[#838280] uppercase tracking-wider">
                <th className="pb-3 px-3 w-12 text-center">#</th>
                <th className="pb-3 px-3 w-14">Image</th>
                <th className="pb-3 px-3">Title</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 px-3 text-center">Created At</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e251e] text-xs">
              {filteredCategories.map((cat, index) => (
                <tr key={cat._id} className="hover:bg-[#241c15] transition-colors group">
                  {/* Index */}
                  <td className="py-4 px-3 text-center font-bold text-[#838280]">
                    {index + 1}
                  </td>

                  {/* Image */}
                  <td className="py-4 px-3">
                    <div className="w-10 h-10 rounded bg-[#2b2219] border border-[#3d3023] flex items-center justify-center overflow-hidden shrink-0">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Layers className="w-4 h-4 text-[#C79A5B]" />
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-4 px-3">
                    <span className="font-semibold text-slate-100 group-hover:text-[#C79A5B] transition-colors text-sm">
                      {cat.title}
                    </span>
                  </td>

                  {/* Status Badge & Toggle */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                        cat.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                      title="Click to toggle status"
                    >
                      <span className={`w-2 h-2 rounded-full ${cat.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>

                  {/* Created At */}
                  <td className="py-4 px-3 text-center text-[#838280] font-medium">
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Status Quick Toggle Button */}
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`p-2 rounded transition-all cursor-pointer ${
                          cat.isActive
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-[#838280] hover:text-white hover:bg-[#2d241c]'
                        }`}
                        title={cat.isActive ? 'Deactivate Category' : 'Activate Category'}
                      >
                        {cat.isActive ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 rounded text-[#C79A5B] hover:bg-[#2d241c] hover:text-white transition-all cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleConfirmDelete(cat)}
                        className="p-2 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete Category"
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

      {/* ===== Create / Edit Modal ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-2xl max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2e251e] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-gradient-to-tr from-[#774C13] to-[#C79A5B] flex items-center justify-center text-white shadow-md">
                  <Layers className="w-5 h-5 text-[#EADBC8]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {modalMode === 'create' ? 'Create New Category' : 'Edit Category'}
                  </h2>
                  <p className="text-[11px] text-[#838280]">
                    {modalMode === 'create' ? 'Add a new product category' : 'Update category details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded text-[#838280] hover:text-white hover:bg-[#282018] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Title Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Category Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarees, Lehenga, Kurti"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="w-full bg-[#241c15] border border-[#382c20] rounded px-4 py-3 text-xs text-white placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B] transition-all"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C79A5B]" />
                  Category Image
                </label>

                <div className="grid grid-cols-2 gap-3 items-start">
                  <div className="space-y-2">
                    {/* File upload button */}
                    <label className="border-2 border-dashed border-[#382c20] hover:border-[#C79A5B] rounded p-3 text-center bg-[#241c15] hover:bg-[#2e231b] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                      {isUploadingImage ? (
                        <div className="flex items-center gap-1.5 text-[#C79A5B]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-[11px]">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#C79A5B] group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] text-white font-medium">Click to upload</span>
                          <span className="text-[10px] text-[#838280]">PNG, JPG, WEBP</span>
                        </>
                      )}
                    </label>
                    {/* Or URL input */}
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-[#241c15] border border-[#382c20] rounded px-3 py-2 text-[11px] text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40"
                    />
                  </div>

                  {/* Preview */}
                  <div className="flex flex-col items-center justify-center border border-[#342a20] rounded p-3 bg-[#241c15] min-h-[100px]">
                    <span className="text-[10px] text-[#838280] mb-2">Preview</span>
                    {image ? (
                      <div className="relative">
                        <img
                          src={image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border border-[#3d3023]"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <ImageIcon className="w-7 h-7 text-[#838280]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded bg-[#241c15] border border-[#342a20]">
                <div>
                  <span className="block text-xs font-semibold text-slate-200">Active Status</span>
                  <span className="text-[10px] text-[#838280]">
                    {isActive ? 'Category will be visible to users' : 'Category will be hidden'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    isActive ? 'bg-[#774C13]' : 'bg-[#342a20]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2e251e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded text-xs font-semibold text-[#838280] hover:text-white hover:bg-[#282018] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#774C13] via-[#8c5916] to-[#A36B1E] hover:from-[#8c5916] hover:to-[#b87a24] text-white px-6 py-2.5 rounded font-semibold text-xs shadow-lg shadow-[#774C13]/30 border border-[#C79A5B]/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#EADBC8]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#EADBC8]" />
                      <span>{modalMode === 'create' ? 'Create Category' : 'Update Category'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[#1c1611] border border-[#342a20] rounded p-6 shadow-2xl max-w-sm w-full space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Category?</h3>
              <p className="text-xs text-[#838280] mt-1">
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">"{categoryToDelete.title}"</span>? This action cannot be undone.
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
                onClick={handleDeleteCategory}
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

export default Categories;
