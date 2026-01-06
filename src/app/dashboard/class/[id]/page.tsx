import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Cek User & Data
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: kelas, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !kelas) return notFound()

  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', id)
    .order('full_name', { ascending: true })

  // --- HELPER UNTUK INISIAL NAMA (UI COSMETIC) ---
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // --- UI COMPONENT ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* === HEADER & BREADCRUMB === */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                <span>/</span>
                <span className="font-semibold text-gray-900">Detail Kelas</span>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">{kelas.name}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Kelola aktivitas pembelajaran kelas ini.</p>
                </div>
                <div className="hidden md:block">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                        ID: {kelas.id.slice(0, 8)}...
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* === ACTION GRID (MENU UTAMA) === */}
        <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Menu Aktivitas</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                
                {/* 1. ABSENSI CARD */}
                <Link href={`/dashboard/class/${kelas.id}/attendance`} className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
                        📅
                    </div>
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Absensi</span>
                        <span className="text-xs text-gray-500">Cek kehadiran</span>
                    </div>
                </Link>

                {/* 2. JURNAL CARD */}
                <Link href={`/dashboard/class/${kelas.id}/journal`} className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
                        📝
                    </div>
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Jurnal</span>
                        <span className="text-xs text-gray-500">Catat harian</span>
                    </div>
                </Link>

                {/* 3. REKAP CARD */}
                <Link href={`/dashboard/class/${kelas.id}/recap`} className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
                        📊
                    </div>
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Laporan</span>
                        <span className="text-xs text-gray-500">Rekap data</span>
                    </div>
                </Link>

                {/* 4. IMPORT CARD */}
                <Link href={`/dashboard/class/${kelas.id}/import`} className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
                        📂
                    </div>
                    <div>
                        <span className="block font-bold text-gray-900 text-sm">Import</span>
                        <span className="text-xs text-gray-500">Upload CSV</span>
                    </div>
                </Link>

                {/* 5. ADD SISWA CARD */}
                <Link href={`/dashboard/class/${kelas.id}/add-student`} className="group bg-white p-4 rounded-xl border border-blue-200 ring-1 ring-blue-50 shadow-sm hover:shadow-md hover:bg-blue-50 transition flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg group-hover:rotate-90 transition">
                        +
                    </div>
                    <div>
                        <span className="block font-bold text-blue-700 text-sm">Siswa Baru</span>
                        <span className="text-xs text-blue-500">Input manual</span>
                    </div>
                </Link>

            </div>
        </div>

        {/* === DATA SISWA SECTION === */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">👥</div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">Direktori Siswa</h2>
                        <p className="text-gray-500 text-xs">Total {students?.length || 0} siswa terdaftar</p>
                    </div>
                </div>
            </div>

            {students && students.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">No</th>
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4 text-center">Gender</th>
                                <th className="px-6 py-4">NISN</th>
                                <th className="px-6 py-4">Wali Murid</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {students.map((student, index) => (
                                <tr key={student.id} className="hover:bg-blue-50/30 transition group cursor-default">
                                    <td className="px-6 py-4 text-center text-gray-400 font-mono">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar Inisial */}
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold flex items-center justify-center text-xs border border-gray-300">
                                                {getInitials(student.full_name)}
                                            </div>
                                            <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                                {student.full_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {student.gender === 'L' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Laki-laki
                                            </span>
                                        ) : student.gender === 'P' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                                Perempuan
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600">
                                        {student.nisn || <span className="text-gray-300 italic">Kosong</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{student.parent_name || '-'}</span>
                                            {student.parent_phone && (
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    📞 {student.parent_phone}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 text-gray-300">
                        🎓
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Kelas Masih Kosong</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">
                        Belum ada siswa di kelas ini. Anda bisa menambahkan satu per satu atau import data dari Excel.
                    </p>
                    <Link href={`/dashboard/class/${kelas.id}/import`} className="text-blue-600 font-semibold hover:underline">
                        Import Data Siswa &rarr;
                    </Link>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}