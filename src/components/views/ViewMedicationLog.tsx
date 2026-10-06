import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Pill, 
  Syringe, 
  Calendar, 
  Info, 
  ShieldAlert, 
  Coins, 
  UserCheck, 
  Lock, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { Animal } from '../../types';

interface ViewMedicationLogProps {
  animal?: Animal;
  animals: Animal[];
  onBack: () => void;
  onSwitchAnimal: () => void;
  onSaveMedication: (updatedAnimal: Animal) => void;
  onGoToAdd: () => void;
}

export const ViewMedicationLog: React.FC<ViewMedicationLogProps> = ({
  animal: initialAnimal,
  animals,
  onBack,
  onSwitchAnimal,
  onSaveMedication,
  onGoToAdd
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(
    initialAnimal?.eartag || (animals[0]?.eartag || '')
  );

  const currentAnimal = animals.find(a => a.eartag === selectedTag) || initialAnimal || animals[0];

  const [category, setCategory] = useState<'obat' | 'vaksinasi'>('obat');
  const [medicine, setMedicine] = useState('Medoxy-L (Oxytetracycline 100mg)');
  const [medDate, setMedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dosage, setDosage] = useState(20);
  const [route, setRoute] = useState('Injeksi Intramuskular (Paha Belakang)');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Penurunan Nafsu Makan'
  ]);
  const [symptomDetail, setSymptomDetail] = useState(
    'Suhu rektal 39.4°C, nafsu konsumsi konsentrat menurun sejak pagi.'
  );

  // Withdrawal state
  const [hasWithdrawal, setHasWithdrawal] = useState(true);
  const [withdrawalDays, setWithdrawalDays] = useState(7);
  const [cost, setCost] = useState('45.000');
  const [officer, setOfficer] = useState('drh. Hendra / Operator Shift 1');
  const [instructions, setInstructions] = useState(
    'Observasi suhu tubuh 24 jam ke depan, ulangi dosis setengah jika demam berlanjut.'
  );

  if (!currentAnimal && animals.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">
          💊
        </div>
        <h2 className="text-xl font-bold text-gray-900">Belum Ada Ternak Terdaftar</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Tambahkan data ternak terlebih dahulu sebelum mencatat tindakan obat & vaksinasi.
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

  // Calculate safe withdrawal date based on withdrawalDays
  const calculatedSafeDate = () => {
    const d = new Date(medDate);
    d.setDate(d.getDate() + withdrawalDays);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = (continueNext: boolean) => {
    const updatedAnimal: Animal = {
      ...currentAnimal,
      status: hasWithdrawal ? 'withdrawal' : currentAnimal.status,
      statusBadge: hasWithdrawal ? `WITHDRAWAL (${withdrawalDays} HARI)` : currentAnimal.statusBadge,
      statusColor: hasWithdrawal ? 'red' : currentAnimal.statusColor,
      withdrawalEndDate: hasWithdrawal ? calculatedSafeDate() : undefined,
      withdrawalReason: hasWithdrawal ? `${medicine} - ${dosage} ml` : undefined
    };

    onSaveMedication(updatedAnimal);
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
            <h1 className="text-xl font-bold text-gray-900">Catat Obat & Medis</h1>
            <p className="text-xs text-gray-500">
              Input vaksinasi, terapi obat & masa henti konsumsi (withdrawal)
            </p>
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
          <label className="text-xs font-bold text-gray-700">Pilih Ternak yang Diberi Tindakan</label>
          <span className="text-xs text-gray-500 font-medium">{animals.length} ekor tersedia</span>
        </div>
        <select
          value={currentAnimal.eartag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none"
        >
          {animals.map((a) => (
            <option key={a.id} value={a.eartag}>
              {a.eartag} — {a.species.toUpperCase()} {a.breed} ({a.kandang.split(' ')[0]})
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-black text-gray-900">{currentAnimal.eartag}</span>
            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
              {currentAnimal.species} {currentAnimal.breed}
            </span>
          </div>
          <p className="text-xs text-gray-500">{currentAnimal.sex} • {currentAnimal.weight} kg</p>
        </div>
      </div>

      {/* Action Category Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 space-y-4 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Kategori Tindakan
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setCategory('obat')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                category === 'obat'
                  ? 'bg-[#1E4D2B] text-white border-[#1E4D2B]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Pill size={16} /> Obat / Terapi
            </button>
            <button
              type="button"
              onClick={() => setCategory('vaksinasi')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                category === 'vaksinasi'
                  ? 'bg-[#1E4D2B] text-white border-[#1E4D2B]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Syringe size={16} /> Vaksinasi
            </button>
          </div>
        </div>

        {/* Medication Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Nama Obat / Vaksin *
          </label>
          <select
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
          >
            <option value="Medoxy-L (Oxytetracycline 100mg)">Medoxy-L (Oxytetracycline 100mg)</option>
            <option value="Penstrep-400 (Penicillin & Streptomycin)">Penstrep-400 (Penicillin & Streptomycin)</option>
            <option value="Wormzol-B (Albendazole Bolus)">Wormzol-B (Albendazole Bolus)</option>
            <option value="Vitamin B-Kompleks Injeksi">Vitamin B-Kompleks Injeksi</option>
            <option value="Vaksin PMK Aftopor Booster">Vaksin PMK Aftopor Booster</option>
          </select>
          <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1">
            <Info size={13} className="shrink-0" />
            Antibiotik spektrum luas • Injeksi intramuskular
          </p>
        </div>

        {/* Tanggal Pemberian */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Tanggal Pemberian
          </label>
          <input
            type="date"
            value={medDate}
            onChange={(e) => setMedDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 font-medium focus:outline-none"
          />
        </div>

        {/* Dosis & Stepper */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Dosis & Penyesuaian Cepat
          </label>
          <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Jumlah:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={dosage}
                onChange={(e) => setDosage(Number(e.target.value))}
                className="w-16 text-right font-black text-xl text-gray-900 bg-transparent focus:outline-none"
              />
              <span className="text-sm font-normal text-gray-500">ml</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[-5, -1, 1, 5].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setDosage((d) => Math.max(1, d + amt))}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-mono text-xs font-bold transition shadow-xs"
              >
                {amt > 0 ? `+${amt}` : amt} ml
              </button>
            ))}
          </div>
        </div>

        {/* Rute Aplikasi */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Rute Aplikasi
          </label>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
          >
            <option value="Injeksi Intramuskular (Paha Belakang)">Injeksi Intramuskular (Paha Belakang)</option>
            <option value="Injeksi Subkutan (Bawah Kulit Leher)">Injeksi Subkutan (Bawah Kulit Leher)</option>
            <option value="Oral (Cekok / Campur Ransum)">Oral (Cekok / Campur Ransum)</option>
            <option value="Topikal (Semprot / Salep Luar)">Topikal (Semprot / Salep Luar)</option>
          </select>
        </div>

        {/* Diagnosa / Quick Tag */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Diagnosa / Quick Tag Keluhan
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              'Gejala Batuk / Pilek',
              'Luka Fisik / Abses',
              'Penurunan Nafsu Makan',
              'Pencegahan Rutin'
            ].map((sym) => {
              const active = selectedSymptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    active
                      ? 'bg-[#1E4D2B] text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={symptomDetail}
            onChange={(e) => setSymptomDetail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none"
          ></textarea>
        </div>
      </div>

      {/* Masa Henti Obat (Withdrawal Protocol) Card */}
      <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-red-900">
          <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-900">Masa Henti Obat</h4>
            <p className="text-[11px] text-red-600 font-medium">Safety Standard & Withdrawal Protocol</p>
          </div>
        </div>

        {/* Toggle Lock card */}
        <div className="bg-white rounded-xl p-3.5 border border-red-200 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-gray-900">Obat Memiliki Efek Residu?</p>
            <p className="text-[11px] text-gray-500">Kunci status ternak hingga bebas residu</p>
          </div>
          <button
            type="button"
            onClick={() => setHasWithdrawal(!hasWithdrawal)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              hasWithdrawal
                ? 'bg-[#B91C1C] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Lock size={12} />
            {hasWithdrawal ? 'YA (KUNCI)' : 'TIDAK'}
          </button>
        </div>

        {hasWithdrawal && (
          <>
            {/* Durasi presets */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Durasi Masa Henti (Withdrawal)
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[
                  { days: 3, label: '3 Hari' },
                  { days: 5, label: '5 Hari' },
                  { days: 7, label: '7 Hari (Rec)' },
                  { days: 14, label: '14 Hari' },
                  { days: 21, label: '21 Hari' },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => setWithdrawalDays(preset.days)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center transition ${
                      withdrawalDays === preset.days
                        ? 'bg-[#B91C1C] text-white shadow-xs'
                        : 'bg-white hover:bg-red-50 text-gray-700 border border-red-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated safe date */}
            <div className="bg-white rounded-xl p-3 border border-red-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-red-600" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Bebas Residu Pada:</p>
                  <p className="text-sm font-black text-red-900">{calculatedSafeDate()}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                23:59 WIB
              </span>
            </div>

            {/* ASUH Notice */}
            <div className="bg-white/80 rounded-xl p-3 border border-red-200/60 flex items-start gap-2 text-xs text-red-900">
              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">Perhatian Regulasi ASUH:</span> Ternak {currentAnimal.eartag} akan otomatis dikunci dan <span className="font-bold underline">DILARANG DIJUAL / DIPOTONG</span> sampai tanggal {calculatedSafeDate()} demi menjaga kepatuhan keamanan pangan daging.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Biaya Tindakan Medis (HPP) */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
            <Coins size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Biaya Tindakan Medis (HPP)</h4>
            <p className="text-[11px] text-gray-500">Nominal Biaya Terpakai (Obat + Spuit)</p>
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-gray-500">Rp</span>
          <input
            type="text"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-base font-bold text-gray-900 focus:outline-none"
          />
        </div>

        <p className="text-[11px] text-gray-500 bg-[#F8FAF8] p-2.5 rounded-lg border border-gray-100">
          Biaya akan otomatis dibukukan ke akumulasi modal HPP ternak {currentAnimal.eartag}.
        </p>
      </div>

      {/* Petugas & Instruksi Lanjutan */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
            <UserCheck size={18} />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-gray-900">Petugas & Instruksi Lanjutan</h4>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Tenaga Medis / Paramedis
          </label>
          <input
            type="text"
            value={officer}
            onChange={(e) => setOfficer(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Instruksi Lanjutan / Monitoring
          </label>
          <textarea
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:outline-none"
          ></textarea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => handleSave(false)}
          className="w-full bg-[#1E4D2B] hover:bg-[#16381F] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
        >
          <Lock size={16} />
          Simpan & Kunci Status Withdrawal
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
