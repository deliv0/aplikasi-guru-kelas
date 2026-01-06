'use client'

import { useState, useEffect } from 'react'
import { getMonthlyRecap } from './actions'
import Link from 'next/link'
import * as XLSX from 'xlsx' // Import alat Excel

export default function RecapPage({ params }: { params: Promise<{ id: string }> }) {
  // State Tanggal
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1) // 1 - 12
  const [year, setYear] = useState(today.getFullYear())
  
  // State Data
  const [students, setStudents] = useState<any[]>([])
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [classId, setClassId] = useState('')

  // 1. Load Data
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
      alert(result.error)
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

  // Helper: Hari & Total
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const calculateTotal = (studentId: string, statusType: string) => {
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      if (attendanceMap[`${studentId}-${d}`] === statusType) count++
    }
    return count
  }

  // === FITUR SULTAN: DOWNLOAD EXCEL ===
  const handleDownloadExcel = () => {
    if (students.length === 0) return

    // 1. Buat Judul & Header
    const dataRows = []
    
    // Baris 1: Judul
    dataRows.push([`REKAP ABSENSI BULAN ${month} TAHUN ${year}`])
    dataRows.push(['']) // Spasi kosong

    // Baris 2: Header Kolom
    const header = ['No', 'Nama Siswa', ...daysArray, 'Hadir', 'Sakit', 'Izin', 'Alpha']
    dataRows.push(header)

    // 2. Masukkan Data Siswa
    students.forEach((student, index) => {
        const row = []
        row.push(index + 1) // No
        row.push(student.full_name) // Nama

        // Loop Tanggal 1-31
        daysArray.forEach(d => {
            const status = attendanceMap[`${student.id}-${d}`] || '-'
            row.push(status)
        })

        // Loop Total
        row.push(calculateTotal(student.id, 'H'))
        row.push(calculateTotal(student.id, 'S'))
        row.push(calculateTotal(student.id, 'I'))
        row.push(calculateTotal(student.id, 'A'))

        dataRows.push(row)
    })

    // 3. Convert ke Sheet Excel
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(dataRows)

    // Atur lebar kolom (Biar rapi)
    worksheet['!cols'] = [
        { wch: 5 },  // No
        { wch: 30 }, // Nama
        ...daysArray.map(() => ({ wch: 3 })), // Tanggal (kecil aja)
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 } // Total
    ]

    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi")

    // 4. Download File
    XLSX.writeFile(workbook, `Rekap_Absensi_${month}_${year}.xlsx`)
  }

  return (
    <div className="max-w-[95%] mx-auto p-6">
      {/* Header & Navigasi */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href={`/dashboard/class/${classId}`} className="text-blue-600 hover:underline text-sm mb-1 block">
            &larr; Kembali ke Kelas
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Rekap Absensi Bulanan</h1>
        </div>

        {/* Filter & Tombol Download */}
        <div className="flex flex-wrap gap-2 items-center">
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border p-2 rounded-md bg-white shadow-sm"
          >
            {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m, i) => (
              <option key={i} value={i+1}>{m}</option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border p-2 rounded-md bg-white shadow-sm"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          
          {/* TOMBOL SULTAN */}
          <button 
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm flex items-center gap-2 font-medium ml-2"
          >
            📥 Download Excel
          </button>
        </div>
      </div>

      {/* Tabel Scrollable */}
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500">Sedang menarik data... ⏳</div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="p-3 sticky left-0 bg-gray-100 z-10 border-r w-8 text-center">No</th>
                  <th className="p-3 sticky left-10 bg-gray-100 z-10 border-r w-48">Nama Siswa</th>
                  
                  {/* Kolom Tanggal 1-31 */}
                  {daysArray.map(d => (
                    <th key={d} className="p-1 border-r text-center w-8 text-gray-400 font-normal">{d}</th>
                  ))}

                  {/* Kolom Total */}
                  <th className="p-2 border-l bg-green-50 text-center w-10 font-bold text-green-700">H</th>
                  <th className="p-2 border-l bg-blue-50 text-center w-10 font-bold text-blue-700">S</th>
                  <th className="p-2 border-l bg-yellow-50 text-center w-10 font-bold text-yellow-700">I</th>
                  <th className="p-2 border-l bg-red-50 text-center w-10 font-bold text-red-700">A</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3 sticky left-0 bg-white border-r text-center text-gray-500">{idx + 1}</td>
                    <td className="p-3 sticky left-10 bg-white border-r font-medium text-gray-800 truncate max-w-[200px]">
                      {student.full_name}
                    </td>

                    {/* Isi Absen per Tanggal */}
                    {daysArray.map(d => {
                      const status = attendanceMap[`${student.id}-${d}`]
                      return (
                        <td key={d} className="p-1 border-r text-center">
                          {status === 'H' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="Hadir"></span>}
                          {status === 'S' && <span className="text-blue-600 font-bold">S</span>}
                          {status === 'I' && <span className="text-yellow-600 font-bold">I</span>}
                          {status === 'A' && <span className="text-red-500 font-bold">A</span>}
                        </td>
                      )
                    })}

                    {/* Total Hitungan */}
                    <td className="text-center font-bold text-gray-700 bg-green-50 border-l">{calculateTotal(student.id, 'H')}</td>
                    <td className="text-center font-bold text-gray-700 bg-blue-50 border-l">{calculateTotal(student.id, 'S')}</td>
                    <td className="text-center font-bold text-gray-700 bg-yellow-50 border-l">{calculateTotal(student.id, 'I')}</td>
                    <td className="text-center font-bold text-gray-700 bg-red-50 border-l">{calculateTotal(student.id, 'A')}</td>
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