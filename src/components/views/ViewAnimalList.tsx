import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  AlertOctagon, 
  X, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { Animal, AnimalSpecies } from '../../types';

interface ViewAnimalListProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
  onNewAnimal: () => void;
}

export const ViewAnimalList: React.FC<ViewAnimalListProps> = ({
  animals,
  onSelectAnimal,
  onNewAnimal
}) => {
  const [search, setSearch] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | AnimalSpecies>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'aktif' | 'withdrawal' | 'bunting'>('all');
  const [showAlert, setShowAlert] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const withdrawalCount = animals.filter(a => a.status === 'withdrawal').length;
  const sapiCount = animals.filter(a => a.species === 'sapi').length;
  const kambingCount = animals.filter(a => a.species === 'kambing').length;
  const dombaCount = animals.filter(a => a.species === 'domba').length;

  const filteredAnimals = animals.filter((animal) => {
    const matchSearch =
      animal.eartag.toLowerCase().includes(search.toLowerCase()) ||
      animal.breed.toLowerCase().includes(search.toLowerCase()) ||
      animal.kandang.toLowerCase().includes(search.toLowerCase()) ||
      animal.species.toLowerCase().includes(search.toLowerCase());

    const matchSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
    const matchStatus = selectedStatus === 'all' || animal.status === selectedStatus;

    return matchSearch && matchSpecies && matchStatus;
  });

  return (
    <div className="space-y-4 pb-20 md:pb-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111A13] tracking-tight">
            Daftar Ternak
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            Total {animals.length} ekor ternak terdaftar
          </p>
        </div>
        <button
          onClick={onNewAnimal}
          className="bg-[#27532B] hover:bg-[#1E4122] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
        >
          <Plus size={16} />
          Registrasi Ternak
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nomor eartag, ras, atau kandang..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#27532B]/20 focus:border-[#27532B] transition placeholder:text-gray-400"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Species Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedSpecies('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedSpecies === 'all'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua ({animals.length})
        </button>
        <button
          onClick={() => setSelectedSpecies('sapi')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedSpecies === 'sapi'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sapi ({sapiCount})
        </button>
        <button
          onClick={() => setSelectedSpecies('kambing')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedSpecies === 'kambing'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Kambing ({kambingCount})
        </button>
        <button
          onClick={() => setSelectedSpecies('domba')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedSpecies === 'domba'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Domba ({dombaCount})
        </button>
      </div>

      {/* Status Filter Row */}
      <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto pb-1">
        <span className="text-[11px] text-gray-400 uppercase tracking-wider shrink-0">STATUS:</span>
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Semua Status
        </button>
        <button
          onClick={() => setSelectedStatus('aktif')}
          className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
            selectedStatus === 'aktif'
              ? 'bg-[#27532B] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Aktif
        </button>
        <button
          onClick={() => setSelectedStatus('withdrawal')}
          className={`px-3 py-1 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
            selectedStatus === 'withdrawal'
              ? 'bg-red-600 text-white'
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Withdrawal ({withdrawalCount})
        </button>
      </div>

      {/* Safety Alert Banner */}
      {showAlert && withdrawalCount > 0 && (
        <div className="bg-[#FEECEC] border border-[#FECACA] rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-red-900 leading-snug">
                Peringatan Keamanan Pangan
              </h4>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                <span className="font-semibold">{withdrawalCount} ternak sedang masa henti obat (withdrawal)</span>. Dilarang dipotong atau dijual demi keamanan konsumsi!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Animal Cards List OR Empty State */}
      {filteredAnimals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/90 p-10 text-center space-y-3">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-2xl text-gray-400">
            🐄
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {animals.length === 0 ? 'Belum Ada Ternak Terdaftar' : 'Ternak Tidak Ditemukan'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {animals.length === 0
              ? 'Mulai dengan menambahkan data ternak baru untuk mengaktifkan manajemen eartag dan penimbangan.'
              : 'Tidak ada ternak yang cocok dengan kriteria pencarian atau filter yang dipilih.'}
          </p>
          {animals.length === 0 && (
            <button
              onClick={onNewAnimal}
              className="inline-flex items-center gap-1.5 bg-[#27532B] hover:bg-[#1E4122] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Plus size={15} /> Registrasi Ternak Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnimals.slice(0, visibleCount).map((animal) => (
            <div
              key={animal.id}
              onClick={() => onSelectAnimal(animal)}
              className="bg-white hover:bg-gray-50/80 border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                    {animal.species === 'sapi' ? '🐄' : animal.species === 'kambing' ? '🐐' : '🐑'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base sm:text-lg font-extrabold text-gray-900">
                        {animal.eartag}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {animal.species}
                      </span>
                      <span className="text-xs text-gray-600 font-medium">
                        {animal.breed} • {animal.sex}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {animal.status === 'withdrawal' && (
                    <span className="bg-[#991B1B] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                      ⚠️ {animal.statusBadge || 'WITHDRAWAL'}
                    </span>
                  )}
                  {animal.status === 'aktif' && (
                    <span className="bg-[#27532B] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                      ✓ {animal.statusBadge || 'AKTIF'}
                    </span>
                  )}
                  {animal.status === 'bunting' && (
                    <span className="bg-neutral-800 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                      🔒 {animal.statusBadge || 'BUNTING'}
                    </span>
                  )}
                  {animal.status === 'terjual' && (
                    <span className="bg-gray-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      TERJUAL
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#F8FAF8] border border-gray-100 rounded-xl p-3 my-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400">Umur & Kandang</p>
                  <p className="font-bold text-gray-800 mt-0.5 truncate">
                    {animal.age} • {animal.kandang.split(' ')[0]} {animal.kandang.split(' ')[1] || ''}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400">Asal Ternak</p>
                  <p className="font-bold text-gray-800 mt-0.5 truncate">
                    {animal.origin}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {animal.weight} <span className="text-xs font-normal text-gray-500">kg</span>
                  </span>

                  {animal.status === 'withdrawal' && animal.subStatus && (
                    <span className="bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {animal.subStatus}
                    </span>
                  )}

                  {animal.status !== 'withdrawal' && animal.status !== 'bunting' && (
                    <span className="bg-[#E6F4EA] text-[#1E7E34] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      ↗ +{animal.adg} kg/hari
                    </span>
                  )}

                  {animal.status === 'bunting' && animal.subStatus && (
                    <span className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                      {animal.subStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center text-xs font-bold text-[#27532B] group-hover:underline">
                  Kartu Ternak <ChevronRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredAnimals.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-gray-500">
          <span>Menampilkan {Math.min(visibleCount, filteredAnimals.length)} dari {animals.length} ternak</span>
          {visibleCount < filteredAnimals.length && (
            <button
              onClick={() => setVisibleCount(c => c + 5)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition"
            >
              Muat Lebih Banyak <ChevronDown size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
