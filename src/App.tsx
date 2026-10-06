import React, { useState, useEffect, useRef } from 'react';
import { Animal, Activity } from './types';
import { INITIAL_ANIMALS, INITIAL_ACTIVITIES, DEMO_ANIMALS, DEMO_ACTIVITIES } from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ViewLogin } from './components/views/ViewLogin';
import { ViewDashboard } from './components/views/ViewDashboard';
import { ViewAnimalList } from './components/views/ViewAnimalList';
import { ViewScanner } from './components/views/ViewScanner';
import { ViewAddAnimal } from './components/views/ViewAddAnimal';
import { ViewWeightLog } from './components/views/ViewWeightLog';
import { ViewMedicationLog } from './components/views/ViewMedicationLog';
import { ViewActivities } from './components/views/ViewActivities';
import { ViewReports } from './components/views/ViewReports';
import { ModalAnimalDetail } from './components/ModalAnimalDetail';
import { ModalPrintLabel } from './components/ModalPrintLabel';
import { ModalReportPDF } from './components/ModalReportPDF';
import { playScanBeep } from './utils/audio';
import { fetchCentralData, saveCentralData } from './services/api';

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);

  // Scanner flow target
  const [scanActionTarget, setScanActionTarget] = useState<'detail' | 'timbang' | 'obat'>('detail');

  // Centralized state
  const [animals, setAnimals] = useState<Animal[]>(() => {
    try {
      const saved = localStorage.getItem('ternakpro_animals');
      return saved ? JSON.parse(saved) : INITIAL_ANIMALS;
    } catch {
      return INITIAL_ANIMALS;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('ternakpro_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Pull latest data from central cloud database on mount & periodically
  useEffect(() => {
    let mounted = true;

    async function syncFromCloud() {
      if (!isLoggedIn) return;
      setIsSyncing(true);
      const cloudData = await fetchCentralData();
      if (mounted && cloudData) {
        setAnimals(cloudData.animals);
        setActivities(cloudData.activities);
      }
      if (mounted) setIsSyncing(false);
    }

    // Initial fetch
    syncFromCloud();

    // Background polling every 8 seconds for real-time multi-device sync
    const interval = setInterval(syncFromCloud, 8000);

    // Sync on window focus
    const onFocus = () => syncFromCloud();
    window.addEventListener('focus', onFocus);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [isLoggedIn]);

  // Modal states
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [printableAnimal, setPrintableAnimal] = useState<Animal | null>(null);
  const [showReportPDF, setShowReportPDF] = useState(false);

  // Active animal for form actions (timbang, obat)
  const [activeAnimalForForm, setActiveAnimalForForm] = useState<Animal | undefined>(undefined);

  // Helper to persist to both cloud and local cache
  const updateAndSync = async (newAnimals: Animal[], newActivities: Activity[]) => {
    setAnimals(newAnimals);
    setActivities(newActivities);
    setIsSyncing(true);
    await saveCentralData(newAnimals, newActivities);
    setIsSyncing(false);
  };

  // Handle new animal registration
  const handleSaveNewAnimal = async (newAnimal: Animal, printImmediate: boolean) => {
    const updatedAnimals = [newAnimal, ...animals];

    // Prepend new activity
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type: 'registrasi',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      dateGroup: 'Hari Ini',
      animalTag: newAnimal.eartag,
      animalDesc: `${newAnimal.species.toUpperCase()} ${newAnimal.breed} • ${newAnimal.sex} • ${newAnimal.origin}`,
      title: `Pendaftaran Baru ${newAnimal.eartag}`,
      details: {
        'Eartag & Barcode': `ID: 3204-${newAnimal.eartag}`,
        'Bobot Masuk': `${newAnimal.weight} kg (${newAnimal.kandang.split(' ')[0]})`
      },
      operator: 'Operator Shift 1 (Budi)',
      badgeText: 'REGISTRASI',
      badgeVariant: 'green',
      actionText: 'Label Dicetak'
    };
    const updatedActivities = [newAct, ...activities];

    await updateAndSync(updatedAnimals, updatedActivities);

    if (printImmediate) {
      setPrintableAnimal(newAnimal);
    }

    setCurrentView('ternak');
  };

  // Handle save weight log
  const handleSaveWeight = async (updatedAnimal: Animal) => {
    const updatedAnimals = animals.map(a => a.id === updatedAnimal.id ? updatedAnimal : a);

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type: 'timbang',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      dateGroup: 'Hari Ini',
      animalTag: updatedAnimal.eartag,
      animalDesc: `${updatedAnimal.species.toUpperCase()} ${updatedAnimal.breed} • ${updatedAnimal.kandang.split(' ')[0]}`,
      title: `Penimbangan ${updatedAnimal.eartag}`,
      details: {
        'Bobot Terkini': `${updatedAnimal.weight} kg`,
        'Laju Pertumbuhan (ADG)': `${updatedAnimal.adg} kg/hari`
      },
      operator: 'Operator Shift 1 (Budi)',
      badgeText: 'TIMBANG',
      badgeVariant: 'green',
      actionText: 'Lihat Kartu >'
    };
    const updatedActivities = [newAct, ...activities];

    await updateAndSync(updatedAnimals, updatedActivities);
    setCurrentView('ternak');
  };

  // Handle save medication log
  const handleSaveMedication = async (updatedAnimal: Animal) => {
    const updatedAnimals = animals.map(a => a.id === updatedAnimal.id ? updatedAnimal : a);

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type: 'obat',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      dateGroup: 'Hari Ini',
      animalTag: updatedAnimal.eartag,
      animalDesc: `${updatedAnimal.species.toUpperCase()} ${updatedAnimal.breed} • Tindakan Obat`,
      title: `Pemberian Terapi ${updatedAnimal.eartag}`,
      details: {
        'Masa Henti Obat': updatedAnimal.withdrawalEndDate ? `Hingga ${updatedAnimal.withdrawalEndDate}` : 'Bebas Residu',
        'Biaya HPP Terapi': 'Rp 45.000'
      },
      warningNote: updatedAnimal.status === 'withdrawal' 
        ? 'Kunci proteksi aktif: Dilarang dipotong atau dijual demi keamanan pangan konsumsi.' 
        : undefined,
      operator: 'drh. Hendra Wijaya',
      badgeText: updatedAnimal.status === 'withdrawal' ? 'WITHDRAWAL AKTIF' : 'MEDIS',
      badgeVariant: updatedAnimal.status === 'withdrawal' ? 'red' : 'green',
      actionText: 'Audit Residu >'
    };
    const updatedActivities = [newAct, ...activities];

    await updateAndSync(updatedAnimals, updatedActivities);
    setCurrentView('dashboard');
  };

  // Delete an animal
  const handleDeleteAnimal = async (animalId: string) => {
    const updatedAnimals = animals.filter(a => a.id !== animalId);
    await updateAndSync(updatedAnimals, activities);
  };

  // Helper to load or clear demo data
  const handleLoadDemoData = async () => {
    if (window.confirm('Muat data contoh demo ternak ke akun terpusat? (Akan tersinkron ke semua device)')) {
      await updateAndSync(DEMO_ANIMALS, DEMO_ACTIVITIES);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Hapus SEMUA data ternak dan aktivitas dari akun terpusat? Data di semua device akan kembali kosong.')) {
      await updateAndSync([], []);
    }
  };

  // Scanner select handler based on scanActionTarget
  const handleScanSelectAnimal = (animal: Animal) => {
    playScanBeep('success');
    if (scanActionTarget === 'timbang') {
      setActiveAnimalForForm(animal);
      setCurrentView('timbang');
      setScanActionTarget('detail');
    } else if (scanActionTarget === 'obat') {
      setActiveAnimalForForm(animal);
      setCurrentView('obat');
      setScanActionTarget('detail');
    } else {
      setSelectedAnimal(animal);
    }
  };

  if (!isLoggedIn) {
    return <ViewLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#192019] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        isSyncing={isSyncing}
        onNavigate={(v) => {
          setScanActionTarget('detail');
          setCurrentView(v);
        }}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Top Banner Options: Multi-Device Shared Account Status */}
      <div className="bg-white border-b border-gray-200/60 px-4 py-1.5 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Akun Terpusat: <strong className="text-gray-900">{animals.length} Ekor</strong> (Sinkron otomatis HP & PC)
          </span>
          <div className="flex items-center gap-2">
            {animals.length === 0 ? (
              <button
                onClick={handleLoadDemoData}
                className="text-[11px] text-[#27532B] hover:underline font-bold"
              >
                + Muat Data Contoh (Demo)
              </button>
            ) : (
              <button
                onClick={handleClearAllData}
                className="text-[11px] text-red-600 hover:underline font-semibold"
              >
                Kosongkan Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {currentView === 'dashboard' && (
          <ViewDashboard
            animals={animals}
            activities={activities}
            onNavigate={(v) => {
              setScanActionTarget('detail');
              setCurrentView(v);
            }}
            onSelectAnimal={(animal) => setSelectedAnimal(animal)}
            onNewAnimal={() => setCurrentView('tambah')}
            onWeightAnimal={() => {
              setActiveAnimalForForm(animals[0]);
              setCurrentView('timbang');
            }}
            onMedAnimal={() => {
              setActiveAnimalForForm(animals[0]);
              setCurrentView('obat');
            }}
          />
        )}

        {currentView === 'ternak' && (
          <ViewAnimalList
            animals={animals}
            onSelectAnimal={(animal) => setSelectedAnimal(animal)}
            onNewAnimal={() => setCurrentView('tambah')}
          />
        )}

        {currentView === 'scan' && (
          <ViewScanner
            animals={animals}
            onSelectAnimal={handleScanSelectAnimal}
            onGoToAdd={() => setCurrentView('tambah')}
          />
        )}

        {currentView === 'aktivitas' && (
          <ViewActivities
            activities={activities}
            animals={animals}
            onBack={() => setCurrentView('dashboard')}
            onSelectAnimalTag={(tag) => {
              const animal = animals.find(a => a.eartag === tag);
              if (animal) setSelectedAnimal(animal);
            }}
          />
        )}

        {currentView === 'laporan' && (
          <ViewReports
            animals={animals}
            onOpenReportModal={() => setShowReportPDF(true)}
          />
        )}

        {currentView === 'tambah' && (
          <ViewAddAnimal
            existingAnimals={animals}
            onBack={() => setCurrentView('dashboard')}
            onSave={handleSaveNewAnimal}
          />
        )}

        {currentView === 'timbang' && (
          <ViewWeightLog
            animal={activeAnimalForForm}
            animals={animals}
            onBack={() => setCurrentView('dashboard')}
            onSwitchAnimal={() => {
              setScanActionTarget('timbang');
              setCurrentView('scan');
            }}
            onSaveWeight={handleSaveWeight}
            onGoToAdd={() => setCurrentView('tambah')}
          />
        )}

        {currentView === 'obat' && (
          <ViewMedicationLog
            animal={activeAnimalForForm}
            animals={animals}
            onBack={() => setCurrentView('dashboard')}
            onSwitchAnimal={() => {
              setScanActionTarget('obat');
              setCurrentView('scan');
            }}
            onSaveMedication={handleSaveMedication}
            onGoToAdd={() => setCurrentView('tambah')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={(v) => {
          setScanActionTarget('detail');
          setCurrentView(v);
        }}
      />

      {/* Modal: Detail Kartu Ternak */}
      <ModalAnimalDetail
        animal={selectedAnimal}
        onClose={() => setSelectedAnimal(null)}
        onTimbang={(animal) => {
          setActiveAnimalForForm(animal);
          setCurrentView('timbang');
        }}
        onCatatObat={(animal) => {
          setActiveAnimalForForm(animal);
          setCurrentView('obat');
        }}
        onPrintLabel={(animal) => {
          setPrintableAnimal(animal);
        }}
        onDeleteAnimal={handleDeleteAnimal}
      />

      {/* Modal: Cetak Label Barcode Eartag */}
      <ModalPrintLabel
        animal={printableAnimal}
        onClose={() => setPrintableAnimal(null)}
      />

      {/* Modal: Cetak Laporan PDF */}
      {showReportPDF && (
        <ModalReportPDF
          animals={animals}
          onClose={() => setShowReportPDF(false)}
        />
      )}
    </div>
  );
};

export default App;
