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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/dashboard" className="hover:text-blue-600 hover:underline">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-gray-800">{kelas.name}</span>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{kelas.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data siswa, absensi, dan jurnal.</p>
        </div>
        
        {/* === TOMBOL MENU LENGKAP === */}
        <div className="flex flex-wrap gap-2">
            {/* 1. Absensi (Orange) */}
            <Link 
              href={`/dashboard/class/${kelas.id}/attendance`}
              className="bg-orange-500 text-white px-4 py-2.5 rounded-md hover:bg-orange-600 text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
                <span>📅</span> Absen
            </Link>

            {/* 2. Jurnal Mengajar (Ungu) - BARU! */}
            <Link 
              href={`/dashboard/class/${kelas.id}/journal`}
              className="bg-purple-600 text-white px-4 py-2.5 rounded-md hover:bg-purple-700 text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
                <span>📝</span> Jurnal
            </Link>

            {/* 3. Rekap (Cyan) */}
            <Link 
              href={`/dashboard/class/${kelas.id}/recap`}
              className="bg-cyan-600 text-white px-4 py-2.5 rounded-md hover:bg-cyan-700 text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
                <span>📊</span> Rekap
            </Link>

            {/* 4. Import (Hijau) */}
            <Link 
              href={`/dashboard/class/${kelas.id}/import`}
              className="bg-green-600 text-white px-4 py-2.5 rounded-md hover:bg-green-700 text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
                <span>📂</span> Import
            </Link>

            {/* 5. Siswa (Biru) */}
            <Link 
              href={`/dashboard/class/${kelas.id}/add-student`}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
                <span>+</span> Siswa
            </Link>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
           <h2 className="font-semibold text-gray-700">
             Daftar Siswa ({students?.length || 0})
           </h2>
        </div>
        
        {students && students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-medium border-b">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Nama Lengkap</th>
                  <th className="px-6 py-3">L/P</th>
                  <th className="px-6 py-3">NISN</th>
                  <th className="px-6 py-3">Orang Tua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {student.full_name}
                    </td>
                    <td className="px-6 py-4">
                      {student.gender === 'L' ? 
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">L</span> : 
                        student.gender === 'P' ? 
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-bold">P</span> : '-'
                      }
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{student.nisn || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {student.parent_name || '-'} 
                      {student.parent_phone && <span className="text-xs text-green-600 block">📞 {student.parent_phone}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="text-2xl text-gray-400">🎓</span>
            </div>
            <p className="text-gray-900 font-medium text-lg">Belum ada siswa</p>
            <p className="text-gray-500 text-sm mt-1">Silakan tambahkan siswa atau import CSV.</p>
          </div>
        )}
      </div>
    </div>
  )
}