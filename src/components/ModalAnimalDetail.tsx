import React from 'react';
import { Animal } from '../types';
import { X, Calendar, MapPin, Scale, Activity, ShieldAlert, CheckCircle2, QrCode, Trash2 } from 'lucide-react';

interface ModalAnimalDetailProps {
  animal: Animal | null;
  onClose: () => void;
  onTimbang: (animal: Animal) => void;
  onCatatObat: (animal: Animal) => void;
  onPrintLabel: (animal: Animal) => void;
  onDeleteAnimal: (animalId: string) => void;
}

export const ModalAnimalDetail: React.FC<ModalAnimalDetailProps> = ({
  animal,
  onClose,
  onTimbang,
  onCatatObat,
  onPrintLabel,
  onDeleteAnimal
}) => {
  if (!animal) return null;

  const handleDelete = () => {
    if (window.confirm(`Yakin ingin menghapus ternak dengan nomor eartag ${animal.eartag}? Tindakan ini tidak dapat dibatalkan.`)) {
      onDeleteAnimal(animal.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-farm-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold tracking-wider">{animal.eartag}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                animal.status === 'withdrawal' 
                  ? 'bg-red-500 text-white' 
                  : animal.status === 'bunting'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {animal.status}
              </span>
            </div>
            <p className="text-farm-200 text-xs mt-0.5 capitalize">
              {animal.species} {animal.breed} • {animal.sex}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Photo if available */}
          {animal.photoUrl && (
            <div className="aspect-16/9 rounded-xl overflow-hidden shadow-xs">
              <img src={animal.photoUrl} alt={animal.eartag} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Withdrawal Alert if active */}
          {animal.status === 'withdrawal' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3">
              <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-red-800 text-xs uppercase tracking-wide">Masa Henti Obat Aktif</p>
                <p className="text-red-700 text-xs mt-0.5 font-medium">
                  {animal.withdrawalReason || 'Pengobatan Antibiotik Terapi'}
                </p>
                <p className="text-red-600 text-[11px] mt-1 font-semibold">
                  Aman dikonsumsi / dijual setelah: {animal.withdrawalEndDate || 'Selesai Siklus'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-500 font-medium">Bobot Terkini</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{animal.weight} <span className="text-xs font-normal text-gray-500">kg</span></p>
            </div>
            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-500 font-medium">ADG Harian</p>
              <p className="text-lg font-bold text-farm-700 mt-0.5">+{animal.adg} <span className="text-xs font-normal text-gray-500">kg/hr</span></p>
            </div>
            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-500 font-medium">Target Jual</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{animal.targetWeight || 550} <span className="text-xs font-normal text-gray-500">kg</span></p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-2.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-sm">
            <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500 text-xs flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" /> Penempatan
              </span>
              <span className="font-semibold text-xs text-gray-800">{animal.kandang}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500 text-xs flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" /> Umur & Asal
              </span>
              <span className="font-semibold text-xs text-gray-800">{animal.age} ({animal.origin})</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500 text-xs flex items-center gap-1.5">
                <QrCode size={14} className="text-gray-400" /> RFID / Microchip
              </span>
              <span className="font-mono text-xs text-gray-700">{animal.rfid || 'Terhubung Eartag Fisik'}</span>
            </div>
            {animal.notes && (
              <div className="pt-1">
                <span className="text-gray-500 text-xs block mb-1">Catatan Khusus:</span>
                <p className="text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200/80 leading-relaxed">
                  {animal.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onTimbang(animal);
                onClose();
              }}
              className="flex items-center justify-center gap-2 bg-farm-800 hover:bg-farm-900 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Scale size={15} /> Timbang Bobot
            </button>
            <button
              onClick={() => {
                onCatatObat(animal);
                onClose();
              }}
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Activity size={15} /> Catat Medis/Obat
            </button>
          </div>

          <button
            onClick={() => onPrintLabel(animal)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-3 rounded-xl text-xs font-bold transition border border-gray-300"
          >
            <QrCode size={15} /> Cetak Label Barcode / Eartag
          </button>

          {/* Delete Animal button */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Trash2 size={14} /> Hapus Data Ternak Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
