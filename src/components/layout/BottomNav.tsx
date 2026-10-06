import React from 'react';
import { LayoutGrid, QrCode, ClipboardList, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'BERANDA', icon: LayoutGrid },
    { id: 'scan', label: 'SCAN', icon: QrCode },
    { id: 'ternak', label: 'TERNAK', icon: ClipboardList },
    { id: 'laporan', label: 'LAPORAN', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 py-2 px-3 md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition ${
                isActive ? 'text-[#27532B]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className={`text-[10px] tracking-wider mt-1 ${
                isActive ? 'font-extrabold text-[#27532B]' : 'font-semibold text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
