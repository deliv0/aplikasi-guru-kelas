'use client'

import { useState, useEffect } from 'react'
import { getMonthlyRecap } from './actions'
import Link from 'next/link'
import * as XLSX from 'xlsx'

export default function RecapPage({ params }: { params: Promise<{ id: string }> }) {
  // --- STATE ---
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  
  const [students, setStudents] = useState<any[]>([])
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [classId, setClassId] = useState('')

  // --- LOGIC ---
  useEffect(() => {
    params.then(p => {
      setClassId(p.id)
      loadData(p.id)
    })
  }, [params, month, year])

  async function loadData(cid: string) {
    setLoading(true)
    const result = await getMonthlyRecap(cid, month, year)
    
    if (result.error) {
      window.alert(result.error)
    } else {
      setStudents(result.students || [])
      const map: Record<string, string> = {}
      result.attendance?.forEach((item: any) => {
        const day = parseInt(item.date.split('-')[2]) 
        const key = `${item.student_id}-${day}`
        map[key] = item.status
      })
      setAttendanceMap(map)
    }
    setLoading(false)
  }

  const daysInMonth = new Date(year, month, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const calculateTotal = (studentId: string, statusType: string) => {
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      if (attendanceMap[`${studentId}-${d}`] === statusType) count++
    }
    return count
  }

  const handleDownloadExcel = () => {
    if (students.length === 0) return

    const dataRows = []
    dataRows.push([`REKAP ABSENSI BULAN ${month} TAHUN ${year}`])
    dataRows.push(['']) 

    const header = ['No', 'Nama Siswa', ...daysArray, 'Hadir', 'Sakit', 'Izin', 'Alpha']
    dataRows.push(header)

    students.forEach((student, index) => {
        const row = []
        row.push(index + 1)
        row.push(student.full_name)

        daysArray.forEach(d => {
            const status = attendanceMap[`${student.id}-${d}`] || '-'
            row.push(status)
        })

        row.push(calculateTotal(student.id, 'H'))
        row.push(calculateTotal(student.id, 'S'))
        row.push(calculateTotal(student.id, 'I'))
        row.push(calculateTotal(student.id, 'A'))

        dataRows.push(row)
    })

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(dataRows)

    // Styling lebar kolom Excel
    worksheet['!cols'] = [
        { wch: 5 }, { wch: 35 }, 
        ...daysArray.map(() => ({ wch: 3 })), 
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }
    ]

    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi")
    XLSX.writeFile(workbook, `Rekap_Absensi_${month}_${year}.xlsx`)
  }

  // --- UI COMPONENTS ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-6">
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            
            {/* Title & Back */}
            <div>
                <Link href={`/dashboard/class/${classId}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1 mb-2 transition">
                    &larr; Kembali ke Kelas
                </Link>
                <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    📊 Rekapitulasi Absensi
                </h1>
                <p className="text-gray-500 text-sm mt-1">Laporan kehadiran siswa per bulan.</p>
            </div>

            {/* Controls Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="bg-transparent text-gray-900 font-semibold text-sm py-2 px-3 outline-none cursor-pointer hover:bg-white rounded-md transition"
                    >
                        {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m, i) => (
                        <option key={i} value={i+1}>{m}</option>
                        ))}
                    </select>
                    <div className="w-px bg-gray-300 my-2"></div>
                    <select 
                        value={year} 
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="bg-transparent text-gray-900 font-semibold text-sm py-2 px-3 outline-none cursor-pointer hover:bg-white rounded-md transition"
                    >
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                    </select>
                </div>

                <button 
                    onClick={handleDownloadExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-green-200 shadow-lg font-bold text-sm flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                    <span>📥</span> Download Excel
                </button>
            </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col">
        
        {/* Keterangan Legenda */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-6 text-xs font-medium text-gray-600 overflow-x-auto">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Hadir</div>
            <div className="flex items-center gap-2"><span className="text-blue-600 font-bold">S</span> Sakit</div>
            <div className="flex items-center gap-2"><span className="text-yellow-600 font-bold">I</span> Izin</div>
            <div className="flex items-center gap-2"><span className="text-red-500 font-bold">A</span> Alpha</div>
        </div>

        {/* Tabel Data */}
        {loading ? (
            <div className="p-20 text-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Sedang menyiapkan laporan...</p>
            </div>
        ) : (
            <div className="overflow-x-auto relative">
                <table className="w-full text-xs text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-gray-100 text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            {/* Sticky Columns Header */}
                            <th className="p-4 sticky left-0 bg-gray-100 z-20 border-r border-gray-200 w-14 text-center font-bold text-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">No</th>
                            <th className="p-4 sticky left-14 bg-gray-100 z-20 border-r border-gray-200 w-64 font-bold text-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Siswa</th>
                            
                            {/* Dates Header */}
                            {daysArray.map(d => (
                                <th key={d} className="p-1 border-r border-gray-200 text-center w-8 font-semibold hover:bg-gray-200 transition cursor-default">{d}</th>
                            ))}

                            {/* Summary Header */}
                            <th className="p-3 bg-green-50 text-green-700 text-center w-12 font-bold border-l border-gray-200">H</th>
                            <th className="p-3 bg-blue-50 text-blue-700 text-center w-12 font-bold">S</th>
                            <th className="p-3 bg-yellow-50 text-yellow-700 text-center w-12 font-bold">I</th>
                            <th className="p-3 bg-red-50 text-red-700 text-center w-12 font-bold">A</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student, idx) => (
                            <tr key={student.id} className="hover:bg-blue-50/50 transition-colors group">
                                {/* Sticky Columns Body */}
                                <td className="p-3 sticky left-0 bg-white group-hover:bg-blue-50/50 border-r border-gray-200 text-center text-gray-500 z-10 font-mono shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    {idx + 1}
                                </td>
                                <td className="p-3 sticky left-14 bg-white group-hover:bg-blue-50/50 border-r border-gray-200 text-gray-900 font-semibold z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] truncate max-w-[200px]">
                                    {student.full_name}
                                </td>

                                {/* Cells Status */}
                                {daysArray.map(d => {
                                    const status = attendanceMap[`${student.id}-${d}`]
                                    return (
                                        <td key={d} className="p-1 border-r border-gray-100 text-center h-10">
                                            {status === 'H' && <div className="w-2 h-2 bg-green-400 rounded-full mx-auto" title="Hadir"></div>}
                                            {status === 'S' && <span className="text-blue-600 font-bold">S</span>}
                                            {status === 'I' && <span className="text-yellow-600 font-bold">I</span>}
                                            {status === 'A' && <span className="text-red-500 font-bold bg-red-100 px-1.5 rounded">A</span>}
                                        </td>
                                    )
                                })}

                                {/* Cells Total */}
                                <td className="text-center font-bold text-gray-800 bg-green-50/30 border-l border-gray-200">{calculateTotal(student.id, 'H')}</td>
                                <td className="text-center font-bold text-gray-600 bg-blue-50/30">{calculateTotal(student.id, 'S')}</td>
                                <td className="text-center font-bold text-gray-600 bg-yellow-50/30">{calculateTotal(student.id, 'I')}</td>
                                <td className="text-center font-bold text-red-600 bg-red-50/30">{calculateTotal(student.id, 'A')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  )
}