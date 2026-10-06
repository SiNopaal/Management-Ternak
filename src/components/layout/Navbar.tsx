import React from 'react';
import { TernakLogo } from '../TernakLogo';
import { Bell, LogOut, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <TernakLogo size={36} className="w-9 h-9" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                TernakPro
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
              Kandang Utama • Online (Sesi Aktif)
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl">
          {[
            { id: 'dashboard', label: 'Beranda' },
            { id: 'scan', label: 'Scan Eartag' },
            { id: 'ternak', label: 'Daftar Ternak' },
            { id: 'aktivitas', label: 'Aktivitas' },
            { id: 'laporan', label: 'Laporan' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                currentView === item.id
                  ? 'bg-white text-[#27532B] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Notifications & Operator Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button 
            onClick={() => onNavigate('aktivitas')}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 relative transition"
            title="Notifikasi Aktivitas"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          {/* Operator Badge */}
          <div className="flex items-center gap-2 bg-gray-100/90 hover:bg-gray-200/90 py-1 px-2.5 rounded-full border border-gray-200/80 transition cursor-default">
            <div className="w-6 h-6 rounded-full bg-[#27532B] text-white flex items-center justify-center text-[10px] font-black">
              OP
            </div>
            <span className="text-xs font-bold text-gray-800 hidden sm:inline">
              Operator Shift 1
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-gray-500 transition"
            title="Keluar Sesi"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
