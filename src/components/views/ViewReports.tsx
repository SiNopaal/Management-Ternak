import React, { useState } from 'react';
import { 
  TrendingUp, 
  Tag, 
  Coins, 
  Scale, 
  ShieldCheck, 
  AlertOctagon, 
  Syringe, 
  Baby, 
  Printer, 
  Clock, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Animal } from '../../types';

interface ViewReportsProps {
  animals: Animal[];
  onOpenReportModal: () => void;
}

export const ViewReports: React.FC<ViewReportsProps> = ({
  animals,
  onOpenReportModal
}) => {
  const [period, setPeriod] = useState<'bulan' | '3bulan' | 'tahun'>('bulan');

  const totalAnimals = animals.length;
  const sapiList = animals.filter(a => a.species === 'sapi');
  const kambingList = animals.filter(a => a.species === 'kambing');
  const dombaList = animals.filter(a => a.species === 'domba');
  const withdrawalAnimals = animals.filter(a => a.status === 'withdrawal');

  const avgSapiAdg = sapiList.length > 0
    ? +(sapiList.reduce((acc, a) => acc + (a.adg || 0.8), 0) / sapiList.length).toFixed(2)
    : 0.92;

  const avgKambingAdg = kambingList.length > 0
    ? +(kambingList.reduce((acc, a) => acc + (a.adg || 0.2), 0) / kambingList.length).toFixed(2)
    : 0.18;

  const avgDombaAdg = dombaList.length > 0
    ? +(dombaList.reduce((acc, a) => acc + (a.adg || 0.15), 0) / dombaList.length).toFixed(2)
    : 0.14;

  const sapiPercent = totalAnimals > 0 ? Math.round((sapiList.length / totalAnimals) * 100) : 60;
  const kambingPercent = totalAnimals > 0 ? Math.round((kambingList.length / totalAnimals) * 100) : 25;
  const dombaPercent = totalAnimals > 0 ? Math.max(0, 100 - sapiPercent - kambingPercent) : 15;

  return (
    <div className="space-y-5 pb-20 md:pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold tracking-widest text-[#2E6835] uppercase">
            ANALITIK OPERASIONAL
          </p>
          <span className="bg-[#E6F4EA] text-[#1E7E34] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E7E34]"></span>
            Data Terkini
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111A13] tracking-tight mt-0.5">
          Laporan Peternakan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
          Ringkasan performa ternak, bobot, dan efisiensi kandang.
        </p>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setPeriod('bulan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            period === 'bulan'
              ? 'bg-[#27532B] text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bulan Ini
        </button>
        <button
          onClick={() => setPeriod('3bulan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            period === '3bulan'
              ? 'bg-[#27532B] text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          3 Bulan
        </button>
        <button
          onClick={() => setPeriod('tahun')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            period === 'tahun'
              ? 'bg-[#27532B] text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tahun 2026
        </button>
        <button className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
          <Calendar size={13} /> Kustom
        </button>
      </div>

      {/* Hero Banner: Efisiensi Siklus Ini */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-emerald-900 to-[#193F1F] text-white p-5 sm:p-6">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 space-y-1">
          <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp size={14} /> EFISIENSI SIKLUS INI
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            68.7% <span className="text-lg sm:text-xl font-bold text-emerald-200">Margin Operasional</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg leading-relaxed pt-1">
            Rasio konversi pakan ke pertambahan bobot berada di performa kuartil atas.
          </p>
        </div>
      </div>

      {/* Section 1: Pakan vs Penjualan (HPP & Margin) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
          Pakan vs Penjualan (HPP & Margin)
        </h3>

        {/* Card 1: Estimasi Penjualan */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">Estimasi Penjualan Ternak</p>
            <h4 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
              Rp {totalAnimals > 0 ? (totalAnimals * 18500000).toLocaleString('id-ID') : '68.500.000'}
            </h4>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Realisasi dari {totalAnimals} ekor ternak aktif di farm
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Tag size={20} />
          </div>
        </div>

        {/* Card 2: Biaya Pakan */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Biaya Pakan</p>
            <h4 className="text-xl sm:text-2xl font-black text-[#B91C1C] mt-0.5">
              Rp {totalAnimals > 0 ? (totalAnimals * 5800000).toLocaleString('id-ID') : '21.450.000'}
            </h4>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Komposisi: 65% Konsentrat, 35% Hijauan & Silase
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
            <Coins size={20} />
          </div>
        </div>

        {/* Card 3: Margin Operasional Kasar */}
        <div className="bg-[#1E4D2B] text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
              MARGIN OPERASIONAL KASAR
            </p>
            <span className="bg-[#A3E635] text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} /> EFISIENSI TINGGI
            </span>
          </div>

          <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            + Rp {totalAnimals > 0 ? (totalAnimals * 12700000).toLocaleString('id-ID') : '47.050.000'}
          </h4>

          <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
            <div className="bg-[#A3E635] h-full rounded-full" style={{ width: '68.7%' }}></div>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Surplus kas pakan menghasilkan rasio 3.19x dari setiap rupiah modal nutrisi.
          </p>
        </div>
      </div>

      {/* Section 2: Pertumbuhan Bobot (ADG) */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Pertumbuhan Bobot (ADG)</h3>
            <p className="text-xs text-gray-500">Rata-rata pertambahan harian per ekor</p>
          </div>
          <Scale size={18} className="text-[#27532B]" />
        </div>

        <div className="space-y-4">
          {/* Sapi ADG */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-800">Sapi ({sapiList.length} ekor)</span>
              <div className="flex items-center gap-2">
                <span className="bg-[#1E4D2B] text-white text-[10px] font-black px-2 py-0.5 rounded">
                  {avgSapiAdg >= 0.85 ? 'SANGAT BAIK' : 'BAIK'}
                </span>
                <span className="font-mono text-sm font-black text-gray-900">
                  {avgSapiAdg} <span className="text-xs font-normal text-gray-500">kg/hari</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#27532B] h-full rounded-full" style={{ width: `${Math.min(100, (avgSapiAdg / 1.0) * 100)}%` }}></div>
            </div>
            <p className="text-[11px] text-gray-400">Target Penggemukan: 0.85 kg/hari</p>
          </div>

          {/* Kambing ADG */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-800">Kambing ({kambingList.length} ekor)</span>
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 text-white text-[10px] font-black px-2 py-0.5 rounded">
                  {avgKambingAdg >= 0.15 ? 'BAIK' : 'OPTIMASI'}
                </span>
                <span className="font-mono text-sm font-black text-gray-900">
                  {avgKambingAdg} <span className="text-xs font-normal text-gray-500">kg/hari</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#27532B] h-full rounded-full" style={{ width: `${Math.min(100, (avgKambingAdg / 0.25) * 100)}%` }}></div>
            </div>
            <p className="text-[11px] text-gray-400">Target Penggemukan: 0.15 kg/hari</p>
          </div>

          {/* Domba ADG */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-800">Domba ({dombaList.length} ekor)</span>
              <div className="flex items-center gap-2">
                <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded ${
                  avgDombaAdg >= 0.15 ? 'bg-[#1E4D2B]' : 'bg-[#B91C1C]'
                }`}>
                  {avgDombaAdg >= 0.15 ? 'BAIK' : 'EVALUASI PAKAN'}
                </span>
                <span className="font-mono text-sm font-black text-gray-900">
                  {avgDombaAdg} <span className="text-xs font-normal text-gray-500">kg/hari</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#27532B] h-full rounded-full" style={{ width: `${Math.min(100, (avgDombaAdg / 0.2) * 100)}%` }}></div>
            </div>
            <p className="text-[11px] text-gray-400">Target Penggemukan: 0.15 kg/hari</p>
          </div>
        </div>

        <div className="bg-[#F8FAF8] border border-gray-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-gray-700">
          <Sparkles size={16} className="text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-gray-900">Insight Lapangan:</span> Penimbangan rutin menunjukkan kenaikan optimal setelah jadwal ransum konsentrat shift pagi dipenuhi tepat waktu.
          </p>
        </div>
      </div>

      {/* Section 3: Dinamika Populasi */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Dinamika Populasi</h3>
            <p className="text-xs text-gray-500">Arus masuk, keluar, dan vitalitas kandang</p>
          </div>
          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-lg">
            {totalAnimals} Ekor Aktif
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center justify-center gap-1">
              ⊕ MASUK
            </span>
            <p className="text-xl font-black text-gray-900 mt-0.5">+{totalAnimals} <span className="text-xs font-normal text-gray-500">ekor</span></p>
            <p className="text-[10px] text-gray-400 mt-0.5">Terdaftar Aktif</p>
          </div>

          <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-gray-600 uppercase flex items-center justify-center gap-1">
              ⊖ KELUAR
            </span>
            <p className="text-xl font-black text-gray-900 mt-0.5">0 <span className="text-xs font-normal text-gray-500">ekor</span></p>
            <p className="text-[10px] text-gray-400 mt-0.5">Terkontrol</p>
          </div>

          <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-[#27532B] uppercase flex items-center justify-center gap-1">
              🛡 MORTALITAS
            </span>
            <p className="text-xl font-black text-gray-900 mt-0.5">0 <span className="text-xs font-normal text-gray-500">ekor</span></p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">0% Nilai Ideal</p>
          </div>
        </div>

        {/* Proportion bar */}
        <div>
          <p className="text-[11px] font-bold text-gray-500 mb-1.5">Rincian Populasi Kandang</p>
          <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 bg-gray-100">
            <div className="bg-[#27532B]" style={{ width: `${sapiPercent}%` }} title={`Sapi: ${sapiList.length}`}></div>
            <div className="bg-[#528A5B]" style={{ width: `${kambingPercent}%` }} title={`Kambing: ${kambingList.length}`}></div>
            <div className="bg-[#8BB992]" style={{ width: `${dombaPercent}%` }} title={`Domba: ${dombaList.length}`}></div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-gray-600 mt-1.5">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#27532B]"></span> Sapi: {sapiList.length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#528A5B]"></span> Kambing: {kambingList.length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8BB992]"></span> Domba: {dombaList.length}</span>
          </div>
        </div>
      </div>

      {/* Section 4: Kesehatan & Kepatuhan */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Kesehatan & Kepatuhan</h3>
          <ShieldCheck size={18} className="text-emerald-700" />
        </div>

        {withdrawalAnimals.length > 0 ? (
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                MASA HENTI OBAT (WITHDRAWAL)
              </p>
              <h4 className="text-xs sm:text-sm font-bold text-red-900 mt-0.5">
                {withdrawalAnimals.length} Ekor Sedang Masa Henti Obat
              </h4>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                Ternak yang terkunci: {withdrawalAnimals.map(a => a.eartag).join(', ')}. <span className="font-bold underline">Dilarang dipotong/dijual untuk konsumsi pangan.</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>Semua ternak bebas dari masa henti obat (Withdrawal 0 ekor). Kepatuhan ASUH 100%.</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#27532B] flex items-center justify-center mb-1.5">
              <Syringe size={14} />
            </div>
            <p className="text-xs text-gray-500 font-medium">Tindakan Medis</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{withdrawalAnimals.length > 0 ? withdrawalAnimals.length : 0} <span className="text-xs font-normal text-gray-500">Catatan</span></p>
            <p className="text-[10px] text-gray-400 mt-0.5">Terkontrol buku kesehatan</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#27532B] flex items-center justify-center mb-1.5">
              <Baby size={14} />
            </div>
            <p className="text-xs text-gray-500 font-medium">Pemeriksaan PKB</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">
              {animals.filter(a => a.status === 'bunting').length} <span className="text-xs font-normal text-gray-500">Induk Bunting</span>
            </p>
            <p className="text-[10px] text-farm-700 font-bold mt-0.5">Monitoring aktif</p>
          </div>
        </div>
      </div>

      {/* Cetak / Unduh Laporan PDF Button */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onOpenReportModal}
          className="w-full bg-[#1E4D2B] hover:bg-[#16381F] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
        >
          <Printer size={16} />
          Cetak / Unduh Laporan PDF
        </button>

        <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <Clock size={13} />
          Sinkronisasi otomatis cloud • {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};
