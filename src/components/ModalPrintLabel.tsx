import React from 'react';
import { Animal } from '../types';
import { X, Printer, Check } from 'lucide-react';

interface ModalPrintLabelProps {
  animal: Animal | null;
  onClose: () => void;
}

export const ModalPrintLabel: React.FC<ModalPrintLabelProps> = ({ animal, onClose }) => {
  if (!animal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-farm-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer size={18} />
            <h3 className="font-bold text-sm">Pratinjau Label Eartag Resmi</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Printable Yellow Eartag Card */}
          <div className="bg-[#FFE838] border-4 border-yellow-500 rounded-3xl p-5 text-black shadow-lg relative mx-auto max-w-[280px]">
            {/* Top hole punch indicator */}
            <div className="w-5 h-5 rounded-full bg-neutral-900/10 border-2 border-neutral-900/30 mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black/20"></div>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-800">
                TERNAKPRO • KANDANG UTAMA
              </p>
              
              {/* Massive Barcode & Eartag */}
              <div className="my-2 bg-white/80 p-2 rounded-lg border border-black/10">
                {/* SVG Simulated Barcode */}
                <div className="flex justify-center items-center h-12 gap-[2px] px-2 overflow-hidden">
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2.5 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                </div>
                <p className="font-mono text-center text-xs tracking-wider font-semibold text-neutral-700 mt-0.5">
                  ID: 3204-{animal.eartag}
                </p>
              </div>

              <div className="mt-1">
                <span className="font-mono text-2xl font-black tracking-tight text-neutral-950 block">
                  {animal.eartag}
                </span>
                <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wide block mt-0.5">
                  {animal.species} • {animal.breed} ({animal.sex})
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-black/15 flex items-center justify-between text-[10px] font-bold text-neutral-700">
                <span>BOBOT: {animal.weight} KG</span>
                <span>MASUK: {new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 no-print">
            Format label mendukung printer thermal bluetooth portabel ukuran 58mm / 80mm.
          </div>

          <div className="flex gap-2 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 bg-farm-800 hover:bg-farm-900 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Printer size={16} /> Cetak Sekarang
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
