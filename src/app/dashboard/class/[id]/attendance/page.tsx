'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAttendanceData, saveAttendance } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const [classId, setClassId] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]) 
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // --- LOGIC (Sama seperti sebelumnya, cuma lebih rapi) ---
  const fetchData = useCallback(async (cid: string, selectedDate: string) => {
    setLoading(true)
    const result = await getAttendanceData(cid, selectedDate)
    
    if (result.data) {
      // Auto-set status 'H' (Hadir) jika belum ada data
      const studentsWithDefault = result.data.map((s: any) => ({
        ...s,
        status: s.status || 'H' 
      }))
      setStudents(studentsWithDefault)
    } else {
      window.alert("Gagal mengambil data: " + result.error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    params.then(p => {
      setClassId(p.id)
      fetchData(p.id, date)
    })
  }, [params, date, fetchData])

  const handleStatusChange = (studentId: string, status: string) => {
    // Efek getar (Haptic Feedback) kalau di HP mendukung
    if (navigator.vibrate) navigator.vibrate(10); 
    
    setStudents(prev => prev.map(s => 
      s.student_id === studentId ? { ...s, status: status } : s
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveAttendance(classId, date, students)
    if (result.success) {
      window.alert(`✅ Absensi tanggal ${date} berhasil disimpan!`)
      router.refresh()
    } else {
      window.alert("❌ Gagal menyimpan: " + result.message)
    }
    setSaving(false)
  }

  // --- UI COMPONENTS ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32"> {/* PB-32 biar tombol simpan gak nutupin konten */}
      
      {/* 1. STICKY HEADER (Tanggal) */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href={`/dashboard/class/${classId}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
                &larr; <span className="hidden sm:inline">Kembali</span>
            </Link>
            
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tgl:</span>
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none p-0 text-gray-900 font-bold focus:ring-0 text-sm cursor-pointer"
                />
            </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4 mt-2">
        <div className="flex justify-between items-end">
            <h1 className="text-2xl font-extrabold text-gray-900">Presensi Siswa</h1>
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100">
                Total: {students.length} Siswa
            </span>
        </div>

        {/* 2. LIST SISWA (CARD STYLE) */}
        {loading ? (
             <div className="space-y-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
             </div>
        ) : (
            <div className="space-y-3">
                {students.map((student, index) => (
                    <div key={student.student_id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-blue-300">
                        
                        {/* Info Siswa */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <span className="text-gray-400 font-mono text-xs w-6 text-center">{index + 1}</span>
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg">{student.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${student.gender === 'L' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                                        {student.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                                    </span>
                                    {/* Indikator Status Teks */}
                                    <span className="text-xs font-medium text-gray-500">
                                        Status: <span className={getTextColor(student.status)}>{getStatusLabel(student.status)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tombol H/S/I/A (Segmented Control) */}
                        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                           <AttendanceButton 
                                label="H" fullLabel="Hadir" color="bg-green-500" 
                                active={student.status === 'H'} 
                                onClick={() => handleStatusChange(student.student_id, 'H')} 
                           />
                           <AttendanceButton 
                                label="S" fullLabel="Sakit" color="bg-blue-500" 
                                active={student.status === 'S'} 
                                onClick={() => handleStatusChange(student.student_id, 'S')} 
                           />
                           <AttendanceButton 
                                label="I" fullLabel="Izin" color="bg-yellow-500" 
                                active={student.status === 'I'} 
                                onClick={() => handleStatusChange(student.student_id, 'I')} 
                           />
                           <AttendanceButton 
                                label="A" fullLabel="Alpha" color="bg-red-500" 
                                active={student.status === 'A'} 
                                onClick={() => handleStatusChange(student.student_id, 'A')} 
                           />
                        </div>

                    </div>
                ))}
            </div>
        )}
      </div>

      {/* 3. FLOATING SAVE BUTTON */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40 pointer-events-none">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={`pointer-events-auto shadow-2xl shadow-blue-900/20 w-full max-w-md py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
            saving ? 'bg-gray-500 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? (
            <>⏳ Sedang Menyimpan...</>
          ) : (
            <>💾 Simpan Data Absensi</>
          )}
        </button>
      </div>

    </div>
  )
}

// --- SUB-COMPONENT: TOMBOL KEREN ---
function AttendanceButton({ label, fullLabel, color, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                relative flex-1 sm:flex-none w-12 h-12 rounded-lg font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center
                ${active ? `${color} text-white shadow-md scale-105 ring-2 ring-offset-2 ring-gray-100` : 'bg-white text-gray-400 hover:bg-gray-200 border border-gray-200'}
            `}
        >
            <span className="text-lg leading-none">{label}</span>
            {active && <span className="text-[8px] uppercase tracking-tighter opacity-90">{fullLabel}</span>}
        </button>
    )
}

// Helper Text Color
function getTextColor(status: string) {
    switch(status) {
        case 'H': return 'text-green-600 font-bold';
        case 'S': return 'text-blue-600 font-bold';
        case 'I': return 'text-yellow-600 font-bold';
        case 'A': return 'text-red-600 font-bold';
        default: return 'text-gray-400';
    }
}
function getStatusLabel(status: string) {
    switch(status) {
        case 'H': return 'Hadir';
        case 'S': return 'Sakit';
        case 'I': return 'Izin';
        case 'A': return 'Alpha';
        default: return '-';
    }
}