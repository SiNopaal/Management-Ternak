import React from 'react';
import { 
  QrCode, 
  ChevronRight, 
  AlertTriangle, 
  Ban, 
  Plus, 
  Scale, 
  Syringe, 
  Clock,
  Sparkles,
  Weight,
  FileText
} from 'lucide-react';
import { Animal, Activity } from '../../types';

interface ViewDashboardProps {
  animals: Animal[];
  activities: Activity[];
  onNavigate: (view: string) => void;
  onSelectAnimal: (animal: Animal) => void;
  onNewAnimal: () => void;
  onWeightAnimal: () => void;
  onMedAnimal: () => void;
}

export const ViewDashboard: React.FC<ViewDashboardProps> = ({
  animals,
  activities,
  onNavigate,
  onSelectAnimal,
  onNewAnimal,
  onWeightAnimal,
  onMedAnimal
}) => {
  const withdrawalAnimals = animals.filter(a => a.status === 'withdrawal');
  const sapiCount = animals.filter(a => a.species === 'sapi').length;
  const kambingCount = animals.filter(a => a.species === 'kambing').length;
  const dombaCount = animals.filter(a => a.species === 'domba').length;
  const totalCount = animals.length;

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-5xl mx-auto">
      {/* Greeting Header */}
      <div>
        <p className="text-[11px] font-bold tracking-widest text-[#2E6835] uppercase">
          DASHBOARD OPERASIONAL
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111A13] tracking-tight mt-0.5">
          Selamat Pagi, Operator
        </h1>
        <p className="text-xs sm:text-sm text-[#526354] mt-1 font-medium">
          Ringkasan kondisi ternak & aktivitas kandang hari ini
        </p>
      </div>

      {/* Main Scan Banner */}
      <button
        onClick={() => onNavigate('scan')}
        className="w-full bg-[#27532B] hover:bg-[#1E4122] text-white p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between text-left transition transform active:scale-[0.99] group"
      >
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition">
            <QrCode size={26} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg tracking-tight">Scan Barcode Eartag</h3>
            <p className="text-white/80 text-xs sm:text-sm mt-0.5 font-medium">
              Kamera cepat identifikasi ternak
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90 group-hover:translate-x-1 transition">
          <ChevronRight size={20} />
        </div>
      </button>

      {/* Withdrawal Alert Card (Only if active withdrawal animals exist) */}
      {withdrawalAnimals.length > 0 && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="text-[#DC2626] shrink-0 mt-0.5" size={20} />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#991B1B] text-sm sm:text-base">
                    Withdrawal Aktif (Masa Henti Obat)
                  </h4>
                </div>
                <p className="text-[#B91C1C] text-xs sm:text-sm mt-1 font-medium">
                  Dilarang dipotong atau dijual demi keamanan pangan:
                </p>
              </div>
            </div>
            <span className="bg-[#B91C1C] text-white text-xs font-black px-2.5 py-1 rounded-lg shrink-0 text-center">
              {withdrawalAnimals.length} Ekor
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 pl-7">
            {withdrawalAnimals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => onSelectAnimal(animal)}
                className="bg-white hover:bg-red-50 border border-[#FCA5A5] text-[#991B1B] px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Ban size={13} className="text-red-500" />
                <span>{animal.eartag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Aksi Cepat */}
      <div>
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
          AKSI CEPAT
        </h3>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <button
            onClick={onNewAnimal}
            className="bg-white hover:bg-[#F2F7F3] border border-gray-200/90 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition shadow-xs group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 group-hover:bg-[#E1EDE3] text-gray-700 group-hover:text-[#27532B] flex items-center justify-center mb-2 transition">
              <Plus size={20} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-[#27532B]">
              + Ternak Baru
            </span>
          </button>

          <button
            onClick={onWeightAnimal}
            className="bg-white hover:bg-[#F2F7F3] border border-gray-200/90 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition shadow-xs group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 group-hover:bg-[#E1EDE3] text-gray-700 group-hover:text-[#27532B] flex items-center justify-center mb-2 transition">
              <Scale size={20} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-[#27532B]">
              Timbang Bobot
            </span>
          </button>

          <button
            onClick={onMedAnimal}
            className="bg-white hover:bg-[#F2F7F3] border border-gray-200/90 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition shadow-xs group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 group-hover:bg-[#E1EDE3] text-gray-700 group-hover:text-[#27532B] flex items-center justify-center mb-2 transition">
              <Syringe size={20} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-[#27532B]">
              Catat Obat
            </span>
          </button>
        </div>
      </div>

      {/* Ringkasan Populasi Aktif */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
            RINGKASAN POPULASI AKTIF
          </h3>
          <span className="text-xs font-bold text-[#27532B]">
            Total: {totalCount} ekor
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
              <span>🐄</span> Sapi
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {sapiCount}
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">
              ekor aktif
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
              <span>🐐</span> Kambing
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {kambingCount}
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">
              ekor aktif
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
              <span>🐑</span> Domba
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {dombaCount}
            </div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">
              ekor aktif
            </div>
          </div>
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
            AKTIVITAS TERBARU
          </h3>
          {activities.length > 0 && (
            <button
              onClick={() => onNavigate('aktivitas')}
              className="text-xs font-bold text-[#27532B] hover:underline"
            >
              Lihat Semua
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 text-center text-xs text-gray-500 shadow-xs">
            Belum ada aktivitas tercatat. Mulai dengan mendaftarkan ternak baru atau mencatat timbangan.
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.slice(0, 3).map((act) => (
              <div
                key={act.id}
                onClick={() => {
                  const target = animals.find(a => a.eartag === act.animalTag);
                  if (target) onSelectAnimal(target);
                }}
                className="bg-white hover:bg-[#F9FAF9] border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    act.type === 'timbang' 
                      ? 'bg-[#EAF2EC] text-[#27532B]' 
                      : act.type === 'obat'
                      ? 'bg-[#FEECEC] text-[#DC2626]'
                      : 'bg-[#EDF2F7] text-gray-700'
                  }`}>
                    {act.type === 'timbang' && <Scale size={18} />}
                    {act.type === 'obat' && <Syringe size={18} />}
                    {act.type === 'registrasi' && <FileText size={18} />}
                    {act.type === 'reproduksi' && <Sparkles size={18} />}
                    {act.type === 'vaksinasi' && <Syringe size={18} />}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {act.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      {act.type === 'timbang' && `${Object.values(act.details)[0] || ''}`}
                      {act.type === 'obat' && (
                        <span className="text-red-600 font-semibold">
                          {act.warningNote || act.animalDesc}
                        </span>
                      )}
                      {act.type === 'registrasi' && `${act.animalDesc}`}
                      {act.type !== 'timbang' && act.type !== 'obat' && act.type !== 'registrasi' && act.animalDesc}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
