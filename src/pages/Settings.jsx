import React, { useState } from 'react';
import { Store, CreditCard, Save, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [storeName, setStoreName] = useState('Fashion Pehnava');
  const [currency, setCurrency] = useState('INR (₹)');
  const [supportEmail, setSupportEmail] = useState('support@fashionpahnawa.com');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Store Settings</h1>
          <p className="text-xs text-[#838280]">Configure store info, payments, tax, and notifications</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-[#774C13] to-[#925f1a] text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md border border-[#C79A5B]/30 transition-all active:scale-95"
        >
          <Save className="w-4 h-4 text-[#EADBC8]" />
          <span>Save Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Settings Cards */}
      <div className="space-y-6">
        {/* General Store Details */}
        <div className="bg-[#1c1611] border border-[#342a20] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#774C13]/20 text-[#C79A5B] flex items-center justify-center border border-[#774C13]/40">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Store Profile</h3>
              <p className="text-xs text-[#838280]">Basic information about your e-commerce store</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#241c15] border border-[#382c20] rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#C79A5B]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-[#241c15] border border-[#382c20] rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#C79A5B]/40"
              />
            </div>
          </div>
        </div>

        {/* Currency & Payment Gateway */}
        <div className="bg-[#1c1611] border border-[#342a20] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#774C13]/20 text-[#C79A5B] flex items-center justify-center border border-[#774C13]/40">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Payment & Currency</h3>
              <p className="text-xs text-[#838280]">Payment gateways & billing defaults</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">Store Currency</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full bg-[#241c15] border border-[#2e251e] rounded-xl px-4 py-2.5 text-xs text-[#838280]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#EADBC8] mb-1.5">Active Payment Gateway</label>
              <div className="flex items-center gap-2 p-2.5 bg-[#241c15] border border-[#382c20] rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-white">Razorpay / UPI Integration Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
