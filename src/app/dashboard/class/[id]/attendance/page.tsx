'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAttendanceData, saveAttendance } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const [classId, setClassId] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]) // Default Hari Ini
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Fungsi untuk mengambil data dari server
  const fetchData = useCallback(async (cid: string, selectedDate: string) => {
    setLoading(true)
    const result = await getAttendanceData(cid, selectedDate)
    
    if (result.data) {
      // === MODIFIKASI DIMULAI DI SINI ===
      // Kita cek satu-satu datanya. 
      // Kalau statusnya masih kosong (null), kita paksa jadi 'H' (Hadir).
      // Kalau sudah ada isinya (misal kemarin sudah disimpan 'S'), biarkan tetap 'S'.
      
      const studentsWithDefault = result.data.map((s: any) => ({
        ...s,
        status: s.status || 'H' // <-- Ini Mantra Ajaibnya
      }))
      
      setStudents(studentsWithDefault)
      // === MODIFIKASI SELESAI ===
    } else {
      alert("Gagal mengambil data: " + result.error)
    }
    setLoading(false)
  }, [])

  // Efek Pertama kali buka / Ganti Tanggal
  useEffect(() => {
    params.then(p => {
      setClassId(p.id)
      fetchData(p.id, date)
    })
  }, [params, date, fetchData])

  // Fungsi saat tombol H/S/I/A diklik
  const handleStatusChange = (studentId: string, status: string) => {
    setStudents(prev => prev.map(s => 
      s.student_id === studentId ? { ...s, status: status } : s
    ))
  }

  // Fungsi Simpan ke Database
  const handleSave = async () => {
    setSaving(true)
    
    // Karena default sudah 'H', maka semua siswa pasti punya status.
    // Jadi kita simpan semua data siswa yang ada di layar.
    const result = await saveAttendance(classId, date, students)
    
    if (result.success) {
      alert(`Berhasil menyimpan absensi tanggal ${date}!`)
      router.refresh()
    } else {
      alert("Gagal menyimpan: " + result.message)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
       {/* Navigasi Balik */}
       <div className="mb-6">
        <Link href={`/dashboard/class/${classId}`} className="text-blue-600 hover:underline text-sm">
          &larr; Kembali ke Kelas
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Presensi Harian</h1>
        
        {/* Pilih Tanggal */}
        <div className="flex items-center gap-2 bg-white p-2 border rounded-md shadow-sm">
          <span className="text-sm text-gray-500">Tanggal:</span>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="outline-none text-gray-700 font-medium"
          />
        </div>
      </div>

      {/* Tabel Absensi */}
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Sedang memuat data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm border-b">
                <th className="p-4 font-semibold w-10">No</th>
                <th className="p-4 font-semibold">Nama Siswa</th>
                <th className="p-4 font-semibold text-center w-64">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr key={student.student_id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {student.name}
                    <span className="ml-2 text-xs text-gray-400">({student.gender})</span>
                  </td>
                  <td className="p-4">
                    {/* Tombol Pilihan H/S/I/A */}
                    <div className="flex justify-center gap-1 bg-gray-100 p-1 rounded-full w-fit mx-auto">
                      {['H', 'S', 'I', 'A'].map((code) => (
                        <button
                          key={code}
                          onClick={() => handleStatusChange(student.student_id, code)}
                          className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                            student.status === code
                              ? getColor(code) + ' text-white shadow-md transform scale-105 ring-2 ring-offset-1 ring-gray-300'
                              : 'text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tombol Simpan */}
      <div className="fixed bottom-6 right-6 md:static md:mt-8 md:flex md:justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={`px-8 py-3 rounded-full shadow-lg text-white font-bold text-lg transition-all flex items-center gap-2 ${
            saving ? 'bg-gray-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
          }`}
        >
          {saving ? (
            <>⏳ Menyimpan...</>
          ) : (
            <>💾 Simpan Absensi</>
          )}
        </button>
      </div>
    </div>
  )
}

// Helper Warna (Tetap sama)
function getColor(code: string) {
  switch (code) {
    case 'H': return 'bg-green-500' 
    case 'S': return 'bg-blue-400'  
    case 'I': return 'bg-yellow-400' 
    case 'A': return 'bg-red-500'   
    default: return 'bg-gray-400'
  }
}