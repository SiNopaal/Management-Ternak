import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Animal } from '../types';

interface ModalReportPDFProps {
  onClose: () => void;
  animals: Animal[];
}

export const ModalReportPDF: React.FC<ModalReportPDFProps> = ({ onClose, animals }) => {
  const handlePrint = () => {
    window.print();
  };

  const sapiCount = animals.filter(a => a.species === 'sapi').length;
  const kambingCount = animals.filter(a => a.species === 'kambing').length;
  const dombaCount = animals.filter(a => a.species === 'domba').length;
  const withdrawalCount = animals.filter(a => a.status === 'withdrawal').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6">
        <div className="bg-farm-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer size={18} />
            <h3 className="font-bold text-sm">Dokumen Laporan Operasional Ternak</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-farm-700 hover:bg-farm-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer size={14} /> Cetak / Simpan PDF
            </button>
            <button 
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-gray-900 bg-white">
          {/* Farm Header */}
          <div className="border-b-2 border-farm-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-farm-900 tracking-tight">TERNAKPRO AGRI-MANAGEMENT</h1>
              <p className="text-xs text-gray-600 font-medium">Sistem Pemantauan Terpadu Kandang Utama & Barcode Eartag</p>
              <p className="text-xs text-gray-500 mt-1">Kabupaten Bandung, Jawa Barat • Lisensi ASUH Peternakan</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-farm-100 text-farm-900 font-mono text-xs px-2.5 py-1 rounded font-bold">
                LAP-OPR-2026/03
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-semibold">Total Populasi</p>
              <p className="text-xl font-bold text-gray-900">{animals.length} Ekor</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-semibold">Margin Operasional</p>
              <p className="text-xl font-bold text-farm-700">68.7%</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-semibold">ADG Rata-rata</p>
              <p className="text-xl font-bold text-gray-900">0.92 kg/hr</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-semibold">Karantina/Withdrawal</p>
              <p className="text-xl font-bold text-red-600">{withdrawalCount} Ekor</p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div>
            <h3 className="font-bold text-sm text-gray-800 mb-2 uppercase tracking-wide">
              1. Ringkasan Finansial Pakan vs Penjualan
            </h3>
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2.5 text-left border-b border-gray-200">Komponen Biaya / Pendapatan</th>
                  <th className="p-2.5 text-left border-b border-gray-200">Keterangan</th>
                  <th className="p-2.5 text-right border-b border-gray-200">Nominal (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2.5 font-medium">Estimasi Penjualan Ternak</td>
                  <td className="p-2.5 text-gray-600">Realisasi 3 sapi & 5 kambing siap potong</td>
                  <td className="p-2.5 text-right font-bold text-farm-800">Rp 68.500.000</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Total Biaya Pakan (HPP)</td>
                  <td className="p-2.5 text-gray-600">Konsentrat 65%, Hijauan & Silase 35%</td>
                  <td className="p-2.5 text-right font-medium text-gray-800">Rp 21.450.000</td>
                </tr>
                <tr className="bg-farm-50/50 font-bold">
                  <td className="p-2.5 text-farm-900">Surplus Margin Operasional Kasar</td>
                  <td className="p-2.5 text-farm-700">Efisiensi Tinggi (3.19x modal nutrisi)</td>
                  <td className="p-2.5 text-right text-farm-800 text-sm">+ Rp 47.050.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Livestock Table */}
          <div>
            <h3 className="font-bold text-sm text-gray-800 mb-2 uppercase tracking-wide">
              2. Status Ternak & Kepatuhan Keamanan Pangan (ASUH)
            </h3>
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-left border-b">No. Eartag</th>
                  <th className="p-2 text-left border-b">Spesies / Ras</th>
                  <th className="p-2 text-center border-b">Kandang</th>
                  <th className="p-2 text-right border-b">Bobot</th>
                  <th className="p-2 text-right border-b">ADG</th>
                  <th className="p-2 text-left border-b">Status Kepatuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {animals.map((a) => (
                  <tr key={a.id} className={a.status === 'withdrawal' ? 'bg-red-50/60' : ''}>
                    <td className="p-2 font-mono font-bold">{a.eartag}</td>
                    <td className="p-2 capitalize">{a.species} {a.breed}</td>
                    <td className="p-2 text-center">{a.kandang.split(' ')[0]}</td>
                    <td className="p-2 text-right font-medium">{a.weight} kg</td>
                    <td className="p-2 text-right text-farm-700 font-semibold">+{a.adg}</td>
                    <td className="p-2">
                      {a.status === 'withdrawal' ? (
                        <span className="text-red-700 font-bold flex items-center gap-1">
                          ● KUNCI RESIDU ({a.withdrawalEndDate})
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">✓ Siap / Sehat</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-gray-200 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-gray-500 mb-12">Disiapkan Oleh (Operator Lapangan):</p>
              <p className="font-bold text-gray-900 border-b border-gray-400 inline-block px-8 pb-1">Budi Setiawan</p>
              <p className="text-[11px] text-gray-500">Operator Shift 1</p>
            </div>
            <div>
              <p className="text-gray-500 mb-12">Disetujui Oleh (Dokter Hewan Farm):</p>
              <p className="font-bold text-gray-900 border-b border-gray-400 inline-block px-8 pb-1">drh. Hendra Wijaya</p>
              <p className="text-[11px] text-gray-500">SIP: 503/SIP-DH/2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
