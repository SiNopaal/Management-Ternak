import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bluetooth, 
  CheckCircle2, 
  QrCode, 
  Calendar, 
  Info, 
  Calculator, 
  TrendingUp, 
  Save, 
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { Animal } from '../../types';

interface ViewWeightLogProps {
  animal?: Animal;
  animals: Animal[];
  onBack: () => void;
  onSwitchAnimal: () => void;
  onSaveWeight: (updatedAnimal: Animal) => void;
  onGoToAdd: () => void;
}

export const ViewWeightLog: React.FC<ViewWeightLogProps> = ({
  animal: initialAnimal,
  animals,
  onBack,
  onSwitchAnimal,
  onSaveWeight,
  onGoToAdd
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(
    initialAnimal?.eartag || (animals[0]?.eartag || '')
  );

  const currentAnimal = animals.find(a => a.eartag === selectedTag) || initialAnimal || animals[0];

  const [currentWeight, setCurrentWeight] = useState<number>(() => {
    return currentAnimal ? currentAnimal.weight : 450;
  });

  const [weighDate, setWeighDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pullingData, setPullingData] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Nafsu Makan Lahap',
    'Sehat Aktif'
  ]);
  const [operatorNotes, setOperatorNotes] = useState(
    'Kondisi fisik prima, bulu mengkilap, bobot naik stabil.'
  );

  useEffect(() => {
    if (currentAnimal) {
      setCurrentWeight(currentAnimal.weight);
      if (currentAnimal.notes) setOperatorNotes(currentAnimal.notes);
    }
  }, [selectedTag]);

  if (!currentAnimal && animals.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">
          ⚖️
        </div>
        <h2 className="text-xl font-bold text-gray-900">Belum Ada Ternak Terdaftar</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Tambahkan data ternak terlebih dahulu sebelum mencatat penimbangan bobot rutin.
        </p>
        <button
          onClick={onGoToAdd}
          className="w-full bg-[#27532B] hover:bg-[#1E4122] text-white py-3 rounded-xl text-xs font-bold transition shadow-sm"
        >
          + Registrasi Ternak Baru
        </button>
      </div>
    );
  }

  const prevWeight = currentAnimal.initialWeight || (currentAnimal.weight - 10);
  const targetWeight = currentAnimal.targetWeight || 550.0;
  const diffWeight = +(currentWeight - prevWeight).toFixed(1);
  const remaining = Math.max(0, +(targetWeight - currentWeight).toFixed(1));

  // Dynamic ADG calculation based on interval
  const calculatedAdg = +(diffWeight / 14).toFixed(2);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handlePullBluetooth = () => {
    setPullingData(true);
    setTimeout(() => {
      // Simulate real-time digital scale reading
      const randomJitter = (Math.random() * 0.8 - 0.4);
      setCurrentWeight((w) => +(w + 2.5 + randomJitter).toFixed(1));
      setPullingData(false);
    }, 600);
  };

  const handleSave = (continueNext: boolean) => {
    const updated: Animal = {
      ...currentAnimal,
      weight: currentWeight,
      adg: calculatedAdg > 0 ? calculatedAdg : currentAnimal.adg,
      notes: operatorNotes
    };
    onSaveWeight(updated);
  };

  return (
    <div className="space-y-4 pb-24 md:pb-10 max-w-xl mx-auto">
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
            <h1 className="text-xl font-bold text-gray-900">Timbang Bobot Ternak</h1>
            <p className="text-xs text-gray-500">Input timbangan rutin & analisis ADG harian</p>
          </div>
        </div>

        <div className="bg-[#E6F4EA] text-[#1E7E34] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E7E34]"></span>
          SHIFT 1 AKTIF
        </div>
      </div>

      {/* Animal Selector Dropdown */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700">Pilih Ternak yang Ditimbang</label>
          <span className="text-xs text-gray-500 font-medium">{animals.length} ekor tersedia</span>
        </div>
        <select
          value={currentAnimal.eartag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none"
        >
          {animals.map((a) => (
            <option key={a.id} value={a.eartag}>
              {a.eartag} — {a.species.toUpperCase()} {a.breed} ({a.weight} kg)
            </option>
          ))}
        </select>

        {/* Animal Summary Details */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-black text-gray-900">{currentAnimal.eartag}</span>
            <span className="bg-[#1E4D2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {currentAnimal.statusBadge || currentAnimal.status}
            </span>
          </div>
          <p className="text-xs text-gray-500">{currentAnimal.kandang.split(' ')[0]} • {currentAnimal.sex}</p>
        </div>

        {/* Livestock Photo */}
        {currentAnimal.photoUrl && (
          <div className="relative aspect-16/9 rounded-xl overflow-hidden shadow-xs">
            <img
              src={currentAnimal.photoUrl}
              alt={currentAnimal.eartag}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-gray-800 flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>{currentAnimal.rfid || 'Teridentifikasi Barcode'}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3 Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-3 text-center shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BOBOT AWAL</p>
          <p className="text-lg font-black text-gray-900 mt-0.5">
            {prevWeight} <span className="text-xs font-normal text-gray-500">kg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Sesi sebelumnya</p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-3 text-center shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BOBOT SEKARANG</p>
          <p className="text-lg font-black text-farm-700 mt-0.5">
            {currentWeight} <span className="text-xs font-normal text-gray-500">kg</span>
          </p>
          <p className="text-[10px] text-farm-700 font-bold mt-0.5">+{diffWeight} kg</p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-3 text-center shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TARGET JUAL</p>
          <p className="text-lg font-black text-gray-900 mt-0.5">
            {targetWeight} <span className="text-xs font-normal text-gray-500">kg</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Sisa {remaining} kg</p>
        </div>
      </div>

      {/* Tanggal Timbang Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 space-y-2 shadow-xs">
        <label className="block text-xs font-bold text-gray-700">Tanggal Timbang</label>
        <input
          type="date"
          value={weighDate}
          onChange={(e) => setWeighDate(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 font-medium focus:outline-none"
        />
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <Info size={13} className="shrink-0" />
          Kebijakan: 1 sesi penimbangan tercatat per hari per ternak.
        </p>
      </div>

      {/* Bluetooth Digital Scale Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#27532B] text-white flex items-center justify-center shrink-0">
            <Bluetooth size={20} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Skala Digital Kandang</h4>
            <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sinyal Stabil • Baterai 88%
            </p>
          </div>
        </div>
        <button
          onClick={handlePullBluetooth}
          disabled={pullingData}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-2 rounded-xl transition"
        >
          {pullingData ? 'Sinkron...' : 'Tarik Data'}
        </button>
      </div>

      {/* Hasil Timbangan Hari Ini */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 text-center shadow-xs space-y-3">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
          HASIL TIMBANGAN HARI INI
        </p>
        <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight flex items-center justify-center">
          <input
            type="number"
            step="0.1"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            className="w-44 text-center bg-transparent border-b-2 border-farm-600 focus:outline-none"
          />
          <span className="text-lg font-normal text-gray-500 ml-1">kg</span>
        </div>

        <div>
          <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#1E7E34] text-xs font-bold px-3 py-1 rounded-full">
            <TrendingUp size={14} /> +{diffWeight} kg dari penimbangan lalu
          </span>
        </div>

        {/* Glove-Friendly Stepper Buttons */}
        <div className="pt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            PENYESUAIAN CEPAT (GLOVE-FRIENDLY STEPPER)
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: -1.0, label: '-1.0' },
              { val: -0.5, label: '-0.5' },
              { val: +0.5, label: '+0.5' },
              { val: +1.0, label: '+1.0' },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setCurrentWeight((w) => +(w + btn.val).toFixed(1))}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 py-3 rounded-xl font-mono text-sm font-bold transition shadow-xs"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kalkulator ADG Real-Time */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-[#27532B]" />
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Kalkulator ADG Real-Time</h4>
          </div>
          <span className="bg-[#1E4D2B] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            {calculatedAdg >= 0.8 ? 'SANGAT BAIK' : calculatedAdg >= 0.4 ? 'BAIK' : 'EVALUASI PAKAN'}
          </span>
        </div>

        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 font-medium">Laju Pertumbuhan (ADG)</p>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {calculatedAdg} <span className="text-xs font-normal text-gray-500">kg / hari</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Target Penggemukan: &gt; 0.85 kg/hari</p>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#27532B]"
                strokeDasharray="92, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-farm-800">92%</span>
          </div>
        </div>

        <div className="bg-[#EAF2EC] border border-[#CDE3D2] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#204925]">
          <TrendingUp size={16} className="shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Evaluasi Ransum:</span> Perkembangan bobot sangat optimal (+{diffWeight} kg). Penyerapan formula pakan berjalan maksimal.
          </p>
        </div>
      </div>

      {/* Kondisi Fisik & Nafsu Makan */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-900">Kondisi Fisik & Nafsu Makan</h4>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">OPSIONAL</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Nafsu Makan Lahap', 'Sehat Aktif', 'Agresif Normal', 'Perlu Cek Kaki'].map((chip) => {
            const active = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  active ? 'bg-[#1E4D2B] text-white shadow-xs' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Catatan Tambahan Operator
          </label>
          <textarea
            rows={2}
            value={operatorNotes}
            onChange={(e) => setOperatorNotes(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none"
          ></textarea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => handleSave(false)}
          className="w-full bg-[#27532B] hover:bg-[#1E4122] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
        >
          <Save size={16} />
          Simpan Catatan Bobot
        </button>

        <button
          onClick={() => handleSave(true)}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition"
        >
          <ArrowRight size={16} />
          Simpan & Selesai
        </button>
      </div>
    </div>
  );
};
