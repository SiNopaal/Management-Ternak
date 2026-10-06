import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  Scale, 
  Syringe, 
  FileText, 
  Sparkles, 
  User, 
  AlertTriangle, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Activity, Animal } from '../../types';

interface ViewActivitiesProps {
  activities: Activity[];
  animals: Animal[];
  onBack: () => void;
  onSelectAnimalTag: (tag: string) => void;
}

export const ViewActivities: React.FC<ViewActivitiesProps> = ({
  activities,
  animals,
  onBack,
  onSelectAnimalTag
}) => {
  const [filterType, setFilterType] = useState<'all' | 'timbang' | 'obat' | 'registrasi'>('all');
  const [search, setSearch] = useState('');

  const filteredActivities = activities.filter((act) => {
    const matchSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.animalTag.toLowerCase().includes(search.toLowerCase()) ||
      act.operator.toLowerCase().includes(search.toLowerCase());

    const matchType = filterType === 'all' || act.type === filterType;
    return matchSearch && matchType;
  });

  const todayActivities = filteredActivities.filter(a => a.dateGroup === 'Hari Ini');
  const yesterdayActivities = filteredActivities.filter(a => a.dateGroup === 'Kemarin');

  return (
    <div className="space-y-4 pb-20 md:pb-8 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Semua Aktivitas</h1>
            <p className="text-xs text-gray-500">Log penimbangan, tindakan medis & registrasi kandang</p>
          </div>
        </div>

        <div className="bg-[#E6F4EA] text-[#1E7E34] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E7E34]"></span>
          Shift 1 • Live Sync
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari eartag, tindakan medis, atau operator..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#27532B]/20 focus:border-[#27532B] transition"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Date Dropdown Row */}
      <div className="flex items-center justify-between text-xs">
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 shadow-xs transition">
          <Calendar size={14} className="text-[#27532B]" />
          <span>Hari Ini (03 Feb 2026)</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        <span className="text-gray-500 font-medium">Total 48 Catatan</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filterType === 'all'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua (48)
        </button>
        <button
          onClick={() => setFilterType('timbang')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filterType === 'timbang'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Penimbangan (22)
        </button>
        <button
          onClick={() => setFilterType('obat')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filterType === 'obat'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Medis & Terapi (4)
        </button>
        <button
          onClick={() => setFilterType('registrasi')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filterType === 'registrasi'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Registrasi (2)
        </button>
      </div>

      {/* Ringkasan Harian Banner */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#27532B]" />
            <h4 className="text-xs font-bold text-gray-900">Ringkasan Harian (03 Feb)</h4>
          </div>
          <span className="bg-[#E6F4EA] text-[#1E7E34] text-[10px] font-black px-2 py-0.5 rounded">
            Target 92%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-400 font-semibold">Sesi Timbang</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">14</p>
            <p className="text-[10px] text-farm-700 font-bold">ADG +0.91 kg</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-400 font-semibold">Medis & Terapi</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">4</p>
            <p className="text-[10px] text-red-600 font-bold">1 Residu Kunci</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-400 font-semibold">Registrasi Baru</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">2</p>
            <p className="text-[10px] text-gray-500 font-medium">Kandang A1</p>
          </div>
        </div>
      </div>

      {/* Group: HARI INI */}
      {todayActivities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            HARI INI — 03 FEBRUARI 2026
          </div>

          {todayActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs space-y-3 hover:border-gray-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    act.type === 'timbang' 
                      ? 'bg-[#EAF2EC] text-[#27532B]' 
                      : act.type === 'obat'
                      ? 'bg-[#FEECEC] text-[#DC2626]'
                      : 'bg-emerald-100 text-[#27532B]'
                  }`}>
                    {act.type === 'timbang' && <Scale size={18} />}
                    {act.type === 'obat' && <Syringe size={18} />}
                    {act.type === 'registrasi' && <FileText size={18} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-gray-900">
                        {act.animalTag}
                      </span>
                      {act.badgeText && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          act.badgeVariant === 'red'
                            ? 'bg-[#991B1B] text-white'
                            : 'bg-[#27532B] text-white'
                        }`}>
                          {act.badgeText}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{act.animalDesc}</p>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                  {act.time}
                </span>
              </div>

              {/* Details Box */}
              {act.warningNote ? (
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-red-600" />
                    Masa Henti Obat: Hingga 10 Feb 2026 (7 Hari)
                  </p>
                  <p className="text-red-700 leading-relaxed">
                    {act.warningNote} Biaya HPP Terapi: Rp 45.000.
                  </p>
                </div>
              ) : (
                <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(act.details).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[10px] text-gray-400 font-semibold block">{key}</span>
                      <span className="font-bold text-gray-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  {act.operator}
                </span>
                <button
                  onClick={() => onSelectAnimalTag(act.animalTag)}
                  className="font-bold text-[#27532B] hover:underline"
                >
                  {act.actionText || 'Lihat Detail >'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group: KEMARIN */}
      {yesterdayActivities.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            KEMARIN — 02 FEBRUARI 2026
          </div>

          {yesterdayActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-700">
                    {act.type === 'reproduksi' ? <Sparkles size={18} /> : <Syringe size={18} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-gray-900">
                        {act.animalTag}
                      </span>
                      <span className="bg-gray-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {act.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{act.animalDesc}</p>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                  {act.time}
                </span>
              </div>

              {/* Details Box */}
              <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(act.details).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-[10px] text-gray-400 font-semibold block">{key}</span>
                    <span className="font-bold text-gray-800">{String(val)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  {act.operator}
                </span>
                <button
                  onClick={() => onSelectAnimalTag(act.animalTag)}
                  className="font-bold text-[#27532B] hover:underline"
                >
                  {act.actionText || 'Lihat Detail >'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="pt-3 text-center space-y-1">
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
          <RotateCcw size={14} /> Muat Riwayat Lainnya (42 Log Sebelumnya)
        </button>
        <p className="text-[11px] text-gray-400">Menampilkan 6 dari total 48 riwayat aktivitas</p>
      </div>
    </div>
  );
};
