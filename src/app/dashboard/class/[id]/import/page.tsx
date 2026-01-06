'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { importStudents } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ImportPage({ params }: { params: Promise<{ id: string }> }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fungsi saat file dipilih
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  // Fungsi saat tombol Upload diklik
  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    // Unwrap params untuk Next.js terbaru
    const { id } = await params 

    // 1. Baca File CSV
    Papa.parse(file, {
      header: true, // Baris pertama dianggap judul kolom
      skipEmptyLines: true,
      complete: async (results: any) => {
        
        // Cek jika file kosong
        if (results.data.length === 0) {
            setError("File kosong atau tidak terbaca.")
            setLoading(false)
            return
        }

        // 2. Kirim data ke Server Action
        const response = await importStudents(id, results.data)

        if (response.success) {
          alert(`Berhasil import ${results.data.length} siswa!`)
          router.refresh() // Refresh data agar tabel terupdate otomatis
          router.push(`/dashboard/class/${id}`) // Balik ke detail kelas
        } else {
          setError('Gagal menyimpan: ' + response.message)
          setLoading(false)
        }
      },
      error: (err) => {
        setError('File rusak atau format salah: ' + err.message)
        setLoading(false)
      }
    })
  }

  // Kita butuh ID untuk link "Batal"
  // Karena params adalah Promise, kita perlu state atau trik lain untuk Link static.
  // Tapi karena ini Client Component, kita bisa pakai 'use' atau ambil dari path.
  // Cara termudah: tombol batal pakai router.back() atau link statis dashboard sementara.
  
  // SOLUSI: Kita buat tombol Batal pakai onClick router.back() saja agar aman
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Import Data Siswa</h1>
        <p className="text-gray-500 mb-6 text-sm">Upload file CSV untuk memasukkan banyak siswa sekaligus.</p>

        {/* Petunjuk Format */}
        <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-800 border border-blue-200">
          <p className="font-bold mb-1">Format Kolom CSV (Wajib):</p>
          <code className="block bg-white p-2 rounded border border-blue-200 text-xs mb-2 overflow-x-auto">
            full_name, nisn, gender, parent_name, parent_phone
          </code>
          <p className="text-xs">
            * Gender: <b>L</b> atau <b>P</b><br/>
            * Save As Excel: <b>CSV (Comma delimited)</b>
          </p>
        </div>

        {/* Input File */}
        <div className="mb-6">
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200 cursor-pointer border p-2 rounded"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
            ❌ {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button 
             onClick={() => router.back()}
             className="flex-1 px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
             Batal
          </button>
          
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className={`flex-1 px-4 py-2 rounded-md text-white transition font-medium ${
              !file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Memproses...' : 'Upload CSV'}
          </button>
        </div>
      </div>
    </div>
  )
}