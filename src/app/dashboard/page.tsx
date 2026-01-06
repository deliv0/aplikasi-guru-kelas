import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Ambil Data Profil User
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Ambil Data Kelas
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // --- COMPONENT UI ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Dashboard Guru
            </h1>
            <p className="text-gray-600 mt-1 text-base">
              Selamat datang, <span className="font-semibold text-gray-900">{profile?.full_name || user.email}</span>! 👋
            </p>
          </div>
          
          <Link 
            href="/dashboard/create-class" 
            className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <span className="text-xl leading-none">+</span>
            <span>Buat Kelas Baru</span>
          </Link>
        </div>

        {/* === CONTENT SECTION === */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              📂 Daftar Kelas
              <span className="text-xs font-normal bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {classes?.length || 0}
              </span>
            </h2>
          </div>

          {/* ERROR STATE */}
          {classError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
              <span>⚠️</span>
              <p>Gagal memuat data: {classError.message}</p>
            </div>
          )}

          {/* GRID KELAS */}
          {classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((kelas) => (
                <Link 
                  key={kelas.id} 
                  href={`/dashboard/class/${kelas.id}`} 
                  className="group relative block h-full outline-none"
                >
                  {/* Efek Bayangan Belakang (Layer 1) */}
                  <div className="absolute inset-0 bg-gray-200 rounded-2xl transform translate-y-2 transition-transform duration-300 group-hover:translate-y-3"></div>
                  
                  {/* Kartu Utama (Layer 2) */}
                  <div className="relative h-full bg-white border border-gray-200 rounded-2xl p-6 transition-transform duration-300 transform group-hover:-translate-y-1 group-hover:border-blue-400 group-focus:ring-2 group-focus:ring-blue-500">
                    
                    {/* Icon Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        🎓
                      </div>
                      <span className="bg-gray-50 text-gray-400 text-[10px] font-mono px-2 py-1 rounded border border-gray-100">
                        ID: {kelas.id.slice(0, 4)}...
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {kelas.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        Kelola absensi siswa, jurnal harian, dan rekap laporan untuk kelas ini.
                      </p>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600">
                        Lihat Detail
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                        ➝
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* EMPTY STATE (Kalau belum ada kelas) */
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-blue-300 transition">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                ✨
              </div>
              <h3 className="text-lg font-bold text-gray-900">Belum ada kelas aktif</h3>
              <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
                Mulai perjalanan mengajar Anda dengan membuat kelas pertama. Klik tombol di bawah ini.
              </p>
              <Link 
                href="/dashboard/create-class" 
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                Buat Kelas Sekarang
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}