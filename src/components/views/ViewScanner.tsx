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
  Upload,
  Check
} from 'lucide-react';
import jsQR from 'jsqr';
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState('');
  const [useRealCamera, setUseRealCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<string | null>(null);
  const [unknownScannedCode, setUnknownScannedCode] = useState<string | null>(null);
  const [showScanSuccessBanner, setShowScanSuccessBanner] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isCooldownRef = useRef(false);

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Fitur kamera tidak didukung di peramban ini.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setCameraReady(true);
          setCameraError(null);
        }
      } catch (err: unknown) {
        console.warn('Camera initiation error:', err);
        if (mounted) {
          setCameraError('Izin kamera ditolak atau tidak ada webcam aktif. Kamu tetap bisa gunakan mode upload gambar atau simulasi.');
          setUseRealCamera(false);
        }
      }
    }

    if (useRealCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [useRealCamera]);

  function stopCamera() {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }

  // Handle scanned raw string
  const handleDecodedString = (rawValue: string) => {
    if (isCooldownRef.current) return;
    const clean = rawValue.trim();
    if (!clean) return;

    isCooldownRef.current = true;
    setLastScannedResult(clean);

    if (soundEnabled) {
      playScanBeep('success');
    }

    // Try finding matching animal
    // Match by full eartag, substring (e.g. "ID: 3204-SP-26-0001" or "SP-26-0001"), or ID
    const matched = animals.find(a => 
      a.eartag.toLowerCase() === clean.toLowerCase() ||
      clean.toLowerCase().includes(a.eartag.toLowerCase()) ||
      a.id === clean
    );

    if (matched) {
      setUnknownScannedCode(null);
      setShowScanSuccessBanner(true);
      setTimeout(() => {
        setShowScanSuccessBanner(false);
        onSelectAnimal(matched);
        isCooldownRef.current = false;
      }, 700);
    } else {
      setUnknownScannedCode(clean);
      setShowScanSuccessBanner(true);
      setTimeout(() => {
        setShowScanSuccessBanner(false);
        isCooldownRef.current = false;
      }, 2000);
    }
  };

  // Real-time decoding loop
  useEffect(() => {
    if (!useRealCamera || !cameraReady) return;

    let active = true;

    async function scanFrame() {
      if (!active) return;

      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA && !isCooldownRef.current) {
        // Method 1: Modern BarcodeDetector API (Supports 1D Barcode + 2D QR Code)
        if ('BarcodeDetector' in window) {
          try {
            const detector = new (window as unknown as { BarcodeDetector: new (opts?: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector({
              formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a']
            });
            const barcodes = await detector.detect(video);
            if (barcodes && barcodes.length > 0) {
              handleDecodedString(barcodes[0].rawValue);
              animationFrameId.current = requestAnimationFrame(scanFrame);
              return;
            }
          } catch {
            // Fallback to jsQR
          }
        }

        // Method 2: jsQR Canvas analysis
        try {
          if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
          }
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });
            if (code && code.data) {
              handleDecodedString(code.data);
            }
          }
        } catch (e) {
          console.warn('Scan frame error:', e);
        }
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      active = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [useRealCamera, cameraReady, animals, soundEnabled]);

  // Decode uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDecodedString(code.data);
          } else {
            alert('Tidak dapat mendeteksi kode QR atau Barcode pada gambar yang diunggah. Pastikan gambar jelas dan tidak buram.');
          }
        }
      };
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    if (!manualCode.trim()) return;

    const found = animals.find(a => a.eartag.toLowerCase() === manualCode.trim().toLowerCase());
    if (found) {
      if (soundEnabled) playScanBeep('success');
      onSelectAnimal(found);
    } else {
      setManualError(`Nomor eartag "${manualCode}" belum terdaftar.`);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8 max-w-lg mx-auto">
      {/* Top Status & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cameraReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            {cameraReady ? 'DETEKSI QR & BARCODE AKTIF' : 'KAMERA STANDBY'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playScanBeep('double');
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

          {/* Toggle Camera On/Off */}
          <button
            onClick={() => setUseRealCamera(!useRealCamera)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              useRealCamera 
                ? 'bg-emerald-700 text-white border-emerald-800' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
            }`}
          >
            {useRealCamera ? <Video size={14} /> : <VideoOff size={14} />}
            <span>{useRealCamera ? 'Kamera Hidup' : 'Nyalakan Kamera'}</span>
          </button>

          {/* Upload file fallback */}
          <label 
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 cursor-pointer transition"
            title="Scan dari Gambar / File QR"
          >
            <Upload size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {cameraError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
          <AlertTriangle size={16} className="shrink-0 text-amber-600 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Floating Success Sound Toast */}
      {showScanSuccessBanner && (
        <div className="bg-emerald-600 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl animate-bounce">
          <CheckCircle2 size={18} />
          <span>BEEP! Barcode {lastScannedResult} Berhasil Terdeteksi!</span>
        </div>
      )}

      <p className="text-xs text-gray-600 leading-relaxed">
        Arahkan kamera ke kode QR atau barcode fisik pada eartag ternak. Sistem akan otomatis mendeteksi secara langsung.
      </p>

      {/* Camera Viewfinder Box */}
      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-neutral-900">
        {/* Real Live Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${useRealCamera && cameraReady ? 'block' : 'hidden'}`}
        />

        {/* Fallback Viewfinder if camera off */}
        {(!useRealCamera || !cameraReady) && (
          <img
            src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
            alt="Eartag Viewfinder"
            className="w-full h-full object-cover filter brightness-90"
          />
        )}

        {/* Laser Overlay & Corners */}
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-6 pointer-events-none">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#A3E635] rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#A3E635] rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#A3E635] rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#A3E635] rounded-br-lg"></div>

            {/* Real animated laser scanner */}
            <div className="absolute left-2 right-2 h-1 bg-[#A3E635] rounded-full shadow-[0_0_12px_#A3E635] animate-scan"></div>
          </div>

          <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold">
            <QrCode size={14} className="text-[#A3E635]" />
            <span>Pindai QR / Barcode Eartag</span>
          </div>
        </div>
      </div>

      {/* Unknown Code Banner if Scanned a new code */}
      {unknownScannedCode && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Kode Terdeteksi: <span className="font-mono">{unknownScannedCode}</span>
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Nomor ini belum terdaftar di database kandang.
              </p>
            </div>
          </div>
          <button
            onClick={onGoToAdd}
            className="w-full bg-[#27532B] hover:bg-[#1E4122] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Plus size={14} /> Daftarkan Ternak dengan Nomor Ini
          </button>
        </div>
      )}

      {/* Quick Detected or Registered Shortcut */}
      {animals.length > 0 && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center font-mono font-bold text-sm shrink-0">
              {animals[0].eartag.slice(0, 2)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                TERNAK TERDAFTAR
              </p>
              <h3 className="font-mono text-base font-black text-gray-900 tracking-tight">
                {animals[0].eartag}
              </h3>
              <p className="text-xs text-gray-500">
                {animals[0].species} {animals[0].breed} • {animals[0].weight} kg
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playScanBeep('success');
              onSelectAnimal(animals[0]);
            }}
            className="bg-[#27532B] hover:bg-[#1E4122] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs"
          >
            Buka <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Manual Input Fallback */}
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
            {animals.slice(0, 3).map((animal) => (
              <div
                key={animal.id}
                onClick={() => {
                  if (soundEnabled) playScanBeep('success');
                  onSelectAnimal(animal);
                }}
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
