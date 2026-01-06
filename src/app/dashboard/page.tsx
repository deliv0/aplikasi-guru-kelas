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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Halo, {profile?.full_name || user.email}!
          </h1>
          <p className="text-gray-500">Selamat datang di Aplikasi Guru Kelas.</p>
        </div>
        <div className="text-right">
           <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
             {profile?.role || 'Guru'}
           </span>
        </div>
      </div>

      {/* Bagian Data Kelas */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Daftar Kelas Saya</h2>
          
          <Link 
            href="/dashboard/create-class" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition inline-block"
          >
            + Tambah Kelas
          </Link>
        </div>

        {/* List Kelas */}
        {classError ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            Error database: {classError.message}
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((kelas) => (
              /* UPDATE: Menggunakan Link agar bisa diklik */
              <Link 
                key={kelas.id} 
                href={`/dashboard/class/${kelas.id}`} 
                className="block group"
              >
                <div className="border p-5 rounded-lg hover:shadow-lg transition cursor-pointer bg-white border-gray-200 group-hover:border-blue-400 h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                        {kelas.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2">ID: {kelas.id.slice(0, 8)}...</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-500 text-xl font-bold">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-dashed border-2 border-gray-300">
            <p className="text-gray-600 font-medium">Belum ada kelas.</p>
            <p className="text-sm text-gray-400 mt-1">Klik tombol "+ Tambah Kelas" untuk memulai.</p>
          </div>
        )}
      </div>
    </div>
  )
}