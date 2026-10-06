import React, { useState } from 'react';
import { TernakLogo } from '../TernakLogo';
import { Lock, Eye, EyeOff, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface ViewLoginProps {
  onLoginSuccess: () => void;
}

export const ViewLogin: React.FC<ViewLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('kandang-utama-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Logo & Name */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-center p-2 mb-3">
          <TernakLogo size={48} className="w-12 h-12 rounded-xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">TernakPro</h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">Sistem Manajemen Ternak & Barcode</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Masuk Operator</h2>
          <p className="text-xs text-gray-500 mt-0.5">Satu akun terpusat untuk kelola kandang & eartag</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              KATA SANDI AKSES
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-farm-700/20 focus:border-farm-700 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Sesi info badge */}
          <div className="bg-[#EDF5EE] border border-[#D5E8D8] text-[#245229] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck size={16} className="text-[#245229] shrink-0" />
            <span>Sesi aktif 30 hari • Proteksi HMAC & Rate Limit</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#27532B] hover:bg-[#1E4122] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition duration-150 shadow-sm disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block animate-spin mr-2">⟳</span>
            ) : null}
            Masuk ke Sistem <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Info note */}
      <div className="w-full max-w-[420px] mt-4 flex items-start gap-2.5 text-xs text-gray-500 px-2 leading-relaxed">
        <Clock size={15} className="text-gray-400 shrink-0 mt-0.5" />
        <p>
          Masuk sekali untuk mengaktifkan pemindai barcode kamera di kandang tanpa perlu login berulang kali.
        </p>
      </div>

      {/* Footer */}
      <div className="w-full max-w-[420px] mt-8 pt-4 border-t border-gray-200/60 text-center">
        <p className="text-[11px] text-gray-400">
          TernakPro MVP v1.0 • Satu Kandang, Satu Operator
        </p>
      </div>
    </div>
  );
};
