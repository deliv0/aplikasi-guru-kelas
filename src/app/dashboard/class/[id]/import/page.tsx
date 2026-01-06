'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { importStudents } from './actions'
import { useRouter } from 'next/navigation'

export default function ImportPage({ params }: { params: Promise<{ id: string }> }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false) // Buat efek drag-drop
  const router = useRouter()

  // --- LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
      } else if (e.type === "dragleave") {
          setDragActive(false);
      }
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const droppedFile = e.dataTransfer.files[0];
          if(droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
            setFile(droppedFile);
            setError(null);
          } else {
            setError("Mohon upload file dengan format .csv");
          }
      }
  };

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const { id } = await params 

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        if (results.data.length === 0) {
            setError("File kosong atau tidak ada data yang terbaca.")
            setLoading(false)
            return
        }

        const response = await importStudents(id, results.data)

        if (response.success) {
          window.alert(`✅ Berhasil import ${results.data.length} siswa!`)
          router.refresh()
          router.push(`/dashboard/class/${id}`) 
        } else {
          setError('Gagal menyimpan: ' + response.message)
          setLoading(false)
        }
      },
      error: (err) => {
        setError('File rusak: ' + err.message)
        setLoading(false)
      }
    })
  }

  // Fungsi bikin CSV Dummy buat didownload user
  const downloadTemplate = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
          + "full_name,nisn,gender,parent_name,parent_phone\n"
          + "Budi Santoso,123456,L,Pak Santoso,08123456789\n"
          + "Siti Aminah,654321,P,Bu Aminah,08987654321";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "template_siswa.csv");
      document.body.appendChild(link);
      link.click();
  }

  // --- UI ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-green-600 p-6 text-center text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner border border-white/30">
                📂
            </div>
            <h1 className="text-2xl font-bold">Import Data Siswa</h1>
            <p className="text-green-100 text-sm mt-1">Upload file CSV untuk input massal.</p>
        </div>

        <div className="p-8">
            
            {/* ALERT INFO */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                    <p className="font-bold mb-1">Butuh contoh format?</p>
                    <p className="mb-2 text-blue-600/80">Download template ini, isi datanya, lalu upload kembali ke sini.</p>
                    <button onClick={downloadTemplate} className="text-xs font-bold bg-white border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-100 transition shadow-sm text-blue-600">
                        ⬇️ Download Template .CSV
                    </button>
                </div>
            </div>

            {/* DRAG & DROP ZONE */}
            <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                    dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
                } ${file ? "bg-green-50 border-green-500" : ""}`}
                onDragEnter={handleDrag} 
                onDragLeave={handleDrag} 
                onDragOver={handleDrag} 
                onDrop={handleDrop}
            >
                <input 
                    type="file" 
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {file ? (
                    <div>
                        <div className="text-4xl mb-2">📄</div>
                        <p className="font-bold text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                        <p className="text-xs text-green-600 font-bold mt-2">Klik untuk ganti file</p>
                    </div>
                ) : (
                    <div>
                        <div className="text-4xl mb-3 text-gray-300 group-hover:text-green-400 transition">☁️</div>
                        <p className="font-bold text-gray-700">Klik atau Tarik File ke Sini</p>
                        <p className="text-xs text-gray-400 mt-1">Hanya format .CSV yang didukung</p>
                    </div>
                )}
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 flex items-center gap-2 animate-pulse">
                    ⚠️ <span>{error}</span>
                </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-8">
                <button 
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-3 text-center border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                    Batal
                </button>
                <button 
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg transition transform active:scale-95 ${
                        !file || loading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                    }`}
                >
                    {loading ? '⏳ Memproses...' : '🚀 Upload Data'}
                </button>
            </div>

        </div>
      </div>
    </div>
  )
}