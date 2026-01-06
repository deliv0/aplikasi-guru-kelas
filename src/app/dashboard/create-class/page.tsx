import { createClass } from './actions'
import Link from 'next/link'

export default function CreateClassPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      
      {/* CARD CONTAINER */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative">
        
        {/* HEADER CANTIK */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-8 text-center relative overflow-hidden">
           {/* Dekorasi Background */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10 blur-xl"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full transform -translate-x-5 translate-y-5 blur-xl"></div>

           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
               🏫
             </div>
             <h1 className="text-2xl font-extrabold text-white tracking-tight">Buat Kelas Baru</h1>
             <p className="text-blue-100 text-sm mt-1">Siapkan ruang belajar digital untuk siswa Anda.</p>
           </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-8">
          <form action={createClass} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nama Kelas / Rombel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                 {/* Ikon di dalam input */}
                 <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🏷️</span>
                 <input
                    name="className"
                    type="text"
                    placeholder="Contoh: Kelas 6A (2025/2026)"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white shadow-sm"
                 />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">Tips: Gunakan nama yang spesifik agar mudah dicari.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="flex-1 px-4 py-3.5 text-center border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🚀</span> Buat Kelas
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}