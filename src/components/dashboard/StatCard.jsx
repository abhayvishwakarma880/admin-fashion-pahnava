import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, icon: Icon, color, subtitle = 'vs last month' }) => {
  const colorVariants = {
    gold: 'from-[#774C13]/30 to-[#C79A5B]/10 text-[#C79A5B] border-[#C79A5B]/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-[#C79A5B]/20 to-[#EADBC8]/5 text-[#EADBC8] border-[#C79A5B]/30',
    bronze: 'from-[#774C13]/40 to-slate-900/5 text-[#EADBC8] border-[#774C13]/30',
  };

  const iconBgVariants = {
    gold: 'bg-[#774C13]/20 text-[#C79A5B] ring-[#C79A5B]/40',
    emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
    amber: 'bg-[#C79A5B]/15 text-[#EADBC8] ring-[#C79A5B]/30',
    bronze: 'bg-[#774C13]/30 text-[#C79A5B] ring-[#774C13]/50',
  };

  return (
    <div className="relative group bg-[#1c1611] border border-[#342a20] rounded p-5 hover:border-[#C79A5B]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden">
      {/* Background Accent Glow */}
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gradient-to-br ${colorVariants[color] || colorVariants.gold} blur-2xl opacity-40 group-hover:opacity-90 transition-opacity`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#838280] tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
        </div>

        <div className={`w-11 h-11 rounded flex items-center justify-center ring-1 ${iconBgVariants[color] || iconBgVariants.gold} shrink-0 shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {change}
        </span>
        <span className="text-xs text-[#838280] font-medium">{subtitle}</span>
      </div>
    </div>
  );
};

export default StatCard;
