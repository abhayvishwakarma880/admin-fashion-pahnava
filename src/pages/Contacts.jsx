import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Eye, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getContacts, deleteContact } from '../api/contactApi';

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [limit] = useState(10);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const res = await getContacts(params);
      if (res.success) {
        setContacts(res.contacts || []);
        setTotalPages(res.totalPages || 1);
        setTotalContacts(res.totalContacts || res.count || 0);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error(error.message || 'Unable to load contact messages');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, limit]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
  };

  const handleConfirmDelete = (contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteContact(contactToDelete._id);
      if (res.success) {
        toast.success('Contact message deleted');
        setDeleteModalOpen(false);
        setContactToDelete(null);
        fetchContacts();
      }
    } catch (error) {
      console.error('Delete contact error:', error);
      toast.error(error.message || 'Failed to delete contact message');
    } finally {
      setIsDeleting(false);
    }
  };

  const goToPage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      setPage(targetPage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Messages</h1>
          <p className="text-xs text-[#838280]">Review contact us submissions, search messages, and manage inquiries.</p>
        </div>
        <div className="text-xs font-semibold text-[#838280] bg-[#1c1611] border border-[#342a20] px-4 py-2 rounded">
          Total Messages: <span className="text-[#C79A5B] font-bold">{totalContacts}</span>
        </div>
      </div>

      <div className="bg-[#1c1611] border border-[#342a20] rounded p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838280]" />
          <input
            type="text"
            placeholder="Search by name, email, phone, subject or message..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-[#241c15] border border-[#382c20] rounded pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-[#838280] focus:outline-none focus:ring-2 focus:ring-[#C79A5B]/40 transition-all"
          />
        </div>
      </div>

      <div className="bg-[#1c1611] border border-[#342a20] rounded overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#838280]">
            <Loader2 className="w-8 h-8 animate-spin text-[#C79A5B]" />
            <p className="text-sm">Loading contact messages...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="py-20 text-center text-[#838280]">
            <p className="text-sm font-semibold text-white">No contact messages found.</p>
            <p className="text-xs mt-2">Try a different search query or refresh the page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs border-collapse">
              <thead className="bg-[#1b1611] text-[#838280] uppercase tracking-[0.16em] text-[10px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e251e] text-sm">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-[#241c15] transition-colors">
                    <td className="px-4 py-4 text-white font-medium">{contact.name}</td>
                    <td className="px-4 py-4 text-[#d7d7d7] truncate max-w-[180px]">{contact.email}</td>
                    <td className="px-4 py-4 text-[#d7d7d7]">{contact.phone}</td>
                    <td className="px-4 py-4 text-[#d7d7d7]">{contact.subject}</td>
                    <td className="px-4 py-4 text-[#d7d7d7] truncate max-w-[320px]">{contact.message}</td>
                    <td className="px-4 py-4 text-[#838280]">{new Date(contact.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleView(contact)}
                        className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-[#2d1f16] text-[#f3f3f3] border border-[#3a2c22] hover:bg-[#3a2c27] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(contact)}
                        className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-rose-600 text-white border border-rose-500 hover:bg-rose-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1c1611] border border-[#342a20] rounded p-4 text-xs text-[#838280]">
          <div>
            Showing page {page} of {totalPages} — {totalContacts} total messages
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded border border-[#342a20] px-3 py-2 text-[11px] font-semibold hover:bg-[#241c15] transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 rounded border border-[#342a20] px-3 py-2 text-[11px] font-semibold hover:bg-[#241c15] transition-colors disabled:opacity-50"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {viewModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[#1c1611] border border-[#342a20] rounded shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#342a20]">
              <div>
                <h2 className="text-lg font-bold text-white">Contact Message</h2>
                <p className="text-xs text-[#838280]">View the selected inquiry details.</p>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-[#838280] cursor-pointer hover:text-white rounded p-2 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-[#d7d7d7]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#838280]">Name</p>
                  <p className="text-white font-semibold">{selectedContact.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#838280]">Email</p>
                  <p>{selectedContact.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#838280]">Phone</p>
                  <p>{selectedContact.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#838280]">Subject</p>
                  <p>{selectedContact.subject}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-[#838280]">Message</p>
                <div className="rounded bg-[#191310] border border-[#342a20] p-4 text-sm leading-7 text-[#e3e3e3] whitespace-pre-line">
                  {selectedContact.message}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-[#838280]">
                <span>Received: {new Date(selectedContact.createdAt).toLocaleString()}</span>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded bg-[#2d1f16] px-4 py-2 text-xs font-semibold text-[#f3f3f3] hover:bg-[#3a2c27] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[#1c1611] border border-[#342a20] rounded shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete message?</h3>
            <p className="text-xs text-[#838280] mt-2">
              Are you sure you want to delete the message from{' '}
              <span className="text-white font-semibold">{contactToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded text-xs font-semibold text-[#838280] border border-[#342a20] hover:text-white hover:bg-[#241c15] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
