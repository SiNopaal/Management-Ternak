import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  QrCode, 
  History, 
  Camera, 
  Search, 
  Plus, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { Animal } from '../../types';
import { playScanBeep } from '../../utils/audio';

interface ViewScannerProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
  onGoToAdd: () => void;
}

export const ViewScanner: React.FC<ViewScannerProps> = ({
  animals,
  onSelectAnimal,
  onGoToAdd
}) => {
  const [flashOn, setFlashOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState('');
  const [detectedIndex, setDetectedIndex] = useState(0);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showScanSuccessBanner, setShowScanSuccessBanner] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const detectedAnimal = animals.length > 0 ? (animals[detectedIndex % animals.length]) : null;

  // Toggle real webcam stream
  useEffect(() => {
    if (useRealCamera) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('Kamera fisik tidak dapat diakses atau izin ditolak. Menggunakan mode simulasi.');
          setUseRealCamera(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [useRealCamera]);

  const triggerBeepAndSuccess = (animal: Animal) => {
    if (soundEnabled) {
      playScanBeep('success');
    }
    setShowScanSuccessBanner(true);
    setTimeout(() => {
      setShowScanSuccessBanner(false);
      onSelectAnimal(animal);
    }, 400);
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    if (!manualCode.trim()) return;

    const found = animals.find(a => a.eartag.toLowerCase() === manualCode.trim().toLowerCase());
    if (found) {
      triggerBeepAndSuccess(found);
    } else {
      setManualError(`Nomor eartag "${manualCode}" belum terdaftar.`);
    }
  };

  const handleSimulateScan = () => {
    if (!detectedAnimal) return;
    triggerBeepAndSuccess(detectedAnimal);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8 max-w-lg mx-auto">
      {/* Top Status & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            {useRealCamera ? 'KAMERA FISIK' : 'KAMERA AKTIF'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Sound Notification Toggle */}
          <button
            onClick={() => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              if (nextState) playScanBeep('double');
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
              soundEnabled
                ? 'bg-[#E6F4EA] text-[#1E7E34] border-emerald-300'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}
            title={soundEnabled ? 'Notifikasi Bunyi Aktif (Klik untuk mute)' : 'Notifikasi Bunyi Mati'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setUseRealCamera(!useRealCamera)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              useRealCamera 
                ? 'bg-emerald-700 text-white border-emerald-800' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
            }`}
            title="Buka Kamera HP / Laptop"
          >
            {useRealCamera ? <Video size={14} /> : <VideoOff size={14} />}
            <span className="hidden sm:inline">{useRealCamera ? 'Webcam Aktif' : 'Gunakan Webcam'}</span>
          </button>

          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
              flashOn 
                ? 'bg-amber-400 text-neutral-900 border-amber-500' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
            }`}
            title="Flash"
          >
            <Zap size={16} />
          </button>

          {animals.length > 1 && (
            <button
              onClick={() => {
                setDetectedIndex(i => i + 1);
                if (soundEnabled) playScanBeep('double');
              }}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition"
              title="Pindah Target Scan Ternak Lain"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0 text-amber-600" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Floating Success Sound Toast */}
      {showScanSuccessBanner && (
        <div className="bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-bounce">
          <CheckCircle2 size={16} />
          <span>BEEP! Barcode {detectedAnimal?.eartag} Berhasil Terpindai</span>
        </div>
      )}

      <p className="text-xs text-gray-600 leading-relaxed">
        Posisikan kode QR atau barcode eartag ternak tepat di dalam kotak fokus.
      </p>

      {/* Camera Viewfinder Box */}
      <div 
        onClick={handleSimulateScan}
        className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-neutral-900 cursor-pointer group"
        title="Klik untuk memindai / trigger beep scanner"
      >
        {useRealCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
            alt="Eartag Viewfinder"
            className="w-full h-full object-cover filter brightness-90 group-hover:brightness-95 transition"
          />
        )}

        <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center p-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#A3E635] rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#A3E635] rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#A3E635] rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#A3E635] rounded-br-lg"></div>

            <div className="absolute left-2 right-2 h-1 bg-[#A3E635]/90 rounded-full shadow-[0_0_12px_#A3E635] animate-scan"></div>
          </div>

          <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold">
            <QrCode size={14} className="text-[#A3E635]" />
            <span>Ketuk layar untuk trigger pemindaian barcode</span>
          </div>
        </div>
      </div>

      {/* Auto-Detected Card */}
      {detectedAnimal ? (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                TERDETEKSI OTOMATIS
              </p>
              <h3 className="font-mono text-lg font-black text-gray-900 tracking-tight">
                {detectedAnimal.eartag}
              </h3>
              <p className="text-xs text-gray-600 truncate max-w-[160px] sm:max-w-[200px]">
                {detectedAnimal.species} {detectedAnimal.breed} {detectedAnimal.sex} • {detectedAnimal.kandang}
              </p>
            </div>
          </div>

          <button
            onClick={() => triggerBeepAndSuccess(detectedAnimal)}
            className="bg-[#27532B] hover:bg-[#1E4122] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-sm"
          >
            Buka <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div>
            <p className="text-xs font-bold text-gray-900">Belum Ada Eartag Terdaftar</p>
            <p className="text-[11px] text-gray-500">Mulai input data ternak pertama kamu.</p>
          </div>
          <button
            onClick={onGoToAdd}
            className="bg-[#27532B] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
      )}

      {/* Manual Input Fallback Card */}
      <div className="bg-[#F8FAF8] border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-gray-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-800">
              Eartag Kotor atau QR Rusak?
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Ketik nomor seri eartag secara manual jika kamera terhalang lumpur atau kondisi pencahayaan rendah.
            </p>
          </div>
        </div>

        <form onSubmit={handleManualLookup} className="space-y-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              Nomor Eartag Fisik
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 font-mono font-bold text-sm">#</span>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Contoh: SP-26-0001"
                className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#27532B]/20 focus:border-[#27532B]"
              />
            </div>
            {manualError && (
              <p className="text-xs text-red-600 font-medium mt-1">{manualError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#27532B] hover:bg-[#1E4122] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs"
          >
            <QrCode size={16} />
            Buka Kartu Ternak
          </button>
        </form>
      </div>

      {/* Riwayat Pindai Terakhir */}
      {animals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Riwayat Pindai Terakhir
            </h4>
            <span className="text-xs text-gray-400">Hari Ini</span>
          </div>

          <div className="space-y-2">
            {animals.slice(0, 3).map((animal, idx) => (
              <div
                key={animal.id}
                onClick={() => triggerBeepAndSuccess(animal)}
                className="bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl p-3 flex items-center justify-between cursor-pointer transition shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <History size={16} />
                  </div>
                  <div>
                    <h5 className="font-mono text-xs font-bold text-gray-900">{animal.eartag}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {animal.species} {animal.breed} • {animal.weight} kg
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  animal.status === 'withdrawal'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-[#E6F4EA] text-[#1E7E34]'
                }`}>
                  {animal.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
